from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Medicine, Location, Inventory


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("")
def get_dashboard(db: Session = Depends(get_db)):

    # ==========================================
    # TOTAL STOCK
    # ==========================================

    total_stock = (
        db.query(
            func.coalesce(
                func.sum(Inventory.quantity),
                0
            )
        )
        .scalar()
    )


    # ==========================================
    # LOW STOCK ALERTS
    # ==========================================

    low_stock_rows = (
        db.query(
            Location.name.label("location"),
            Medicine.name.label("medicine"),
            Inventory.quantity,
            Medicine.reorder_level
        )
        .join(
            Medicine,
            Inventory.medicine_id == Medicine.id
        )
        .join(
            Location,
            Inventory.location_id == Location.id
        )
        .filter(
            Inventory.quantity <= Medicine.reorder_level
        )
        .order_by(
            Inventory.quantity.asc()
        )
        .all()
    )


    low_stock = [
        {
            "location": row.location,
            "medicine": row.medicine,
            "quantity": row.quantity,
            "reorder_level": row.reorder_level
        }
        for row in low_stock_rows
    ]


    # ==========================================
    # EXPIRING / EXPIRED STOCK
    # ==========================================

    today = date.today()

    six_months = today + timedelta(days=182)


    expiry_rows = (
        db.query(
            Location.name.label("location"),
            Medicine.name.label("medicine"),
            Inventory.quantity,
            Inventory.expiry_date
        )
        .join(
            Medicine,
            Inventory.medicine_id == Medicine.id
        )
        .join(
            Location,
            Inventory.location_id == Location.id
        )
        .filter(
            Inventory.expiry_date <= six_months
        )
        .order_by(
            Inventory.expiry_date.asc()
        )
        .all()
    )


    expiring = []


    for row in expiry_rows:

        days_remaining = (
            row.expiry_date - today
        ).days


        if days_remaining < 0:

            status = "Expired"

        elif days_remaining < 90:

            status = "Expiring < 3 months"

        else:

            status = "Expiring 3–6 months"


        expiring.append({
            "location": row.location,
            "medicine": row.medicine,
            "quantity": row.quantity,
            "expiry_date": row.expiry_date,
            "days_remaining": days_remaining,
            "status": status
        })


    # ==========================================
    # STOCK BY MEDICINE AND INSTITUTION
    # ==========================================
    #
    # Example:
    #
    # {
    #     "medicine": "Paracetamol 500mg",
    #     "Central Drug Warehouse": 500,
    #     "District Hospital Nashik": 926,
    #     "City General Hospital": 920,
    #     "Rural PHC Karjat": 250
    # }
    #
    # This structure is ideal for a stacked
    # bar chart in the Next.js frontend.
    # ==========================================

    stock_rows = (
        db.query(
            Medicine.name.label("medicine"),
            Location.name.label("location"),
            func.coalesce(
                func.sum(Inventory.quantity),
                0
            ).label("stock")
        )
        .join(
            Inventory,
            Inventory.medicine_id == Medicine.id
        )
        .join(
            Location,
            Inventory.location_id == Location.id
        )
        .group_by(
            Medicine.id,
            Medicine.name,
            Location.id,
            Location.name
        )
        .order_by(
            Medicine.name,
            Location.name
        )
        .all()
    )


    stock_by_medicine = {}


    for row in stock_rows:

        if row.medicine not in stock_by_medicine:

            stock_by_medicine[row.medicine] = {
                "medicine": row.medicine
            }


        stock_by_medicine[row.medicine][row.location] = row.stock


    stock_by_medicine = list(
        stock_by_medicine.values()
    )


    # ==========================================
    # FINAL DASHBOARD RESPONSE
    # ==========================================

    return {

        "summary": {

            "total_stock_units": total_stock,

            "low_stock_alerts": len(low_stock),

            "orders_in_progress": 13,

            "delayed_shipments": 2,

            "expiring_within_6_months": len(expiring)

        },


        "low_stock": low_stock,


        "expiring": expiring,


        "stock_by_medicine": stock_by_medicine

    }