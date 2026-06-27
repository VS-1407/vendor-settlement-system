from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Vendor, Settlement
from app.auth import vendor_required


router = APIRouter()


@router.get("/my-profile")
def my_profile(
    current_user = Depends(vendor_required),
    db: Session = Depends(get_db)
):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == current_user.id)
        .first()
    )

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found"
        )

    return vendor



@router.get("/my-settlements")
def my_settlements(
    current_user = Depends(vendor_required),
    db: Session = Depends(get_db)
):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == current_user.id)
        .first()
    )

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found"
        )


    settlements = (
        db.query(Settlement)
        .filter(
            Settlement.vendor_id == vendor.id
        )
        .all()
    )


    return settlements



@router.get("/my-settlement-summary")
def settlement_summary(
    current_user = Depends(vendor_required),
    db: Session = Depends(get_db)
):

    vendor = (
        db.query(Vendor)
        .filter(Vendor.user_id == current_user.id)
        .first()
    )

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor profile not found"
        )


    total = (
        db.query(
            func.sum(Settlement.amount)
        )
        .filter(
            Settlement.vendor_id == vendor.id,
            Settlement.status == "Success"
        )
        .scalar()
    )


    return {
        "vendor_id": vendor.id,
        "total_earnings": total or 0
    }