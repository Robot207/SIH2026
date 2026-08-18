from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Medicine, Location, Inventory


router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"]
)


# ==========================================
# REQUEST MODEL
# ==========================================

class InventoryUpdate(BaseModel):
    medicine_id: int
    location_id: int
    quantity: int
    expiry_date: date


# ==========================================
# GET INVENTORY OPTIONS
# ==========================================

@router.get("/options")
def get_inventory_options(
    db: Session = Depends(get_db)
):

    rows = (
        db.query(
            Inventory.id,
            Medicine.id.label("medicine_id"),
            Medicine.name.label("medicine"),
            Location.id.label("location_id"),
            Location.name.label("location"),
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
        .order_by(
            Location.name,
            Medicine.name
        )
        .all()
    )

    return [
        {
            "inventory_id": row.id,
            "medicine_id": row.medicine_id,
            "medicine": row.medicine,
            "location_id": row.location_id,
            "location": row.location,
            "quantity": row.quantity,
            "expiry_date": row.expiry_date
        }
        for row in rows
    ]


# ==========================================
# UPDATE INVENTORY
# ==========================================

@router.post("/update")
def update_inventory(
    request: InventoryUpdate,
    db: Session = Depends(get_db)
):

    inventory = (
        db.query(Inventory)
        .filter(
            Inventory.medicine_id == request.medicine_id,
            Inventory.location_id == request.location_id
        )
        .first()
    )


    if not inventory:

        raise HTTPException(
            status_code=404,
            detail="Inventory record not found"
        )


    # Update values

    inventory.quantity = request.quantity

    inventory.expiry_date = request.expiry_date


    db.commit()

    db.refresh(inventory)


    return {
        "message": "Inventory updated successfully",

        "inventory": {
            "inventory_id": inventory.id,
            "medicine_id": inventory.medicine_id,
            "location_id": inventory.location_id,
            "quantity": inventory.quantity,
            "expiry_date": inventory.expiry_date
        }
    }