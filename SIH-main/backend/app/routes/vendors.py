from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Supplier


router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"]
)


# ==========================================
# REQUEST MODEL
# ==========================================

class VendorCreate(BaseModel):
    name: str
    email: EmailStr
    rating: float
    latitude: float
    longitude: float


# ==========================================
# GET ALL VENDORS
# ==========================================

@router.get("/")
def get_vendors(
    db: Session = Depends(get_db)
):

    vendors = (
        db.query(Supplier)
        .order_by(Supplier.id)
        .all()
    )

    return [
        {
            "id": vendor.id,
            "name": vendor.name,
            "email": vendor.email,
            "rating": vendor.rating,
            "latitude": vendor.latitude,
            "longitude": vendor.longitude
        }
        for vendor in vendors
    ]


# ==========================================
# ADD VENDOR
# ==========================================

@router.post("/")
def create_vendor(
    vendor_data: VendorCreate,
    db: Session = Depends(get_db)
):

    existing_vendor = (
        db.query(Supplier)
        .filter(
            Supplier.email == vendor_data.email
        )
        .first()
    )

    if existing_vendor:

        raise HTTPException(
            status_code=400,
            detail="A vendor with this email already exists."
        )


    vendor = Supplier(
        name=vendor_data.name,
        email=vendor_data.email,
        rating=vendor_data.rating,
        latitude=vendor_data.latitude,
        longitude=vendor_data.longitude
    )


    db.add(vendor)
    db.commit()
    db.refresh(vendor)


    return {
        "message": "Vendor created successfully",
        "vendor": {
            "id": vendor.id,
            "name": vendor.name,
            "email": vendor.email,
            "rating": vendor.rating,
            "latitude": vendor.latitude,
            "longitude": vendor.longitude
        }
    }


# ==========================================
# UPDATE VENDOR
# ==========================================

@router.put("/{vendor_id}")
def update_vendor(
    vendor_id: int,
    vendor_data: VendorCreate,
    db: Session = Depends(get_db)
):

    vendor = (
        db.query(Supplier)
        .filter(
            Supplier.id == vendor_id
        )
        .first()
    )


    if not vendor:

        raise HTTPException(
            status_code=404,
            detail="Vendor not found."
        )


    vendor.name = vendor_data.name
    vendor.email = vendor_data.email
    vendor.rating = vendor_data.rating
    vendor.latitude = vendor_data.latitude
    vendor.longitude = vendor_data.longitude


    db.commit()
    db.refresh(vendor)


    return {
        "message": "Vendor updated successfully",
        "vendor": {
            "id": vendor.id,
            "name": vendor.name,
            "email": vendor.email,
            "rating": vendor.rating,
            "latitude": vendor.latitude,
            "longitude": vendor.longitude
        }
    }


# ==========================================
# DELETE VENDOR
# ==========================================

@router.delete("/{vendor_id}")
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    vendor = (
        db.query(Supplier)
        .filter(
            Supplier.id == vendor_id
        )
        .first()
    )


    if not vendor:

        raise HTTPException(
            status_code=404,
            detail="Vendor not found."
        )


    db.delete(vendor)
    db.commit()


    return {
        "message": "Vendor deleted successfully"
    }