from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Inventory, Medicine, Location


router = APIRouter(
    prefix="/expiry",
    tags=["Expiry Tracking"]
)


@router.get("/")
def get_expiry_tracking(
    db: Session = Depends(get_db)
):
    today = date.today()

    rows = (
        db.query(
            Inventory,
            Medicine.name.label("medicine"),
            Location.name.label("location")
        )
        .join(
            Medicine,
            Inventory.medicine_id == Medicine.id
        )
        .join(
            Location,
            Inventory.location_id == Location.id
        )
        .order_by(Inventory.expiry_date)
        .all()
    )

    result = []

    for inventory, medicine, location in rows:

        if not inventory.expiry_date:
            continue

        days_remaining = (
            inventory.expiry_date - today
        ).days

        if days_remaining < 0:
            status = "Expired"

        elif days_remaining <= 90:
            status = "Expiring < 3 months"

        elif days_remaining <= 180:
            status = "Expiring 3–6 months"

        else:
            status = "Valid"

        result.append({
            "medicine": medicine,
            "location": location,
            "expiry_date": inventory.expiry_date,
            "days_remaining": days_remaining,
            "status": status
        })

    return result