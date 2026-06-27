from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Vendor

router = APIRouter()


# Get all vendors
@router.get("/vendors")
def get_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).order_by(Vendor.id.desc()).all()


# Add vendor
@router.post("/vendors")
def create_vendor(
    name: str,
    email: str,
    account_id: str,
    db: Session = Depends(get_db)
):
    vendor = Vendor(
        name=name,
        email=email,
        account_id=account_id
    )

    db.add(vendor)
    db.commit()
    db.refresh(vendor)

    return {
        "message": "Vendor created successfully",
        "vendor": vendor
    }


# Update vendor
@router.put("/vendors/{vendor_id}")
def update_vendor(
    vendor_id: int,
    name: str,
    email: str,
    account_id: str,
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    vendor.name = name
    vendor.email = email
    vendor.account_id = account_id

    db.commit()

    return {
        "message": "Vendor updated successfully"
    }


# Delete vendor
@router.delete("/vendors/{vendor_id}")
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    db.delete(vendor)
    db.commit()

    return {
        "message": "Vendor deleted successfully"
    }