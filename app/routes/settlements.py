from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Settlement
from app.settlement import split_payment
from app.auth import admin_required
from workers.tasks import retry_failed_settlements
from datetime import datetime, timedelta
from fastapi import Query

router = APIRouter()


# ------------------------------------
# Split payment after order completion
# ------------------------------------
@router.post("/split-payment/{order_id}")
def create_split(
    order_id: int,
    db: Session = Depends(get_db)
):
    return split_payment(order_id, db)


# ------------------------------------
# Get all settlements
# ------------------------------------
@router.get("/settlements")
def get_all_settlements(
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    return (
        db.query(Settlement)
        .order_by(Settlement.id.desc())
        .all()
    )


# ------------------------------------
# Pending settlements
# ------------------------------------
@router.get("/settlements/pending")
def pending_settlements(
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    return (
        db.query(Settlement)
        .filter(Settlement.status == "Pending")
        .all()
    )


# ------------------------------------
# Successful settlements
# ------------------------------------
@router.get("/settlements/success")
def successful_settlements(
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    return (
        db.query(Settlement)
        .filter(Settlement.status == "Success")
        .all()
    )


# ------------------------------------
# Failed settlements
# ------------------------------------
@router.get("/settlements/failed")
def failed_settlements(
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    return (
        db.query(Settlement)
        .filter(Settlement.status == "Failed")
        .all()
    )


# ------------------------------------
# Retry failed settlements
# ------------------------------------
@router.post("/settlements/retry")
def retry_settlements(
    current_user=Depends(admin_required)
):
    retry_failed_settlements.delay()

    return {
        "message": "Retry process started"
    }


# ------------------------------------
# Mark settlement as Paid
# ------------------------------------
@router.put("/settlements/{settlement_id}/pay")
def pay_settlement(
    settlement_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):
    settlement = (
        db.query(Settlement)
        .filter(Settlement.id == settlement_id)
        .first()
    )

    if not settlement:
        raise HTTPException(
            status_code=404,
            detail="Settlement not found"
        )

    settlement.status = "Paid"

    db.commit()
    db.refresh(settlement)

    return {
        "message": "Settlement paid successfully",
        "settlement": settlement
    }

@router.get("/settlements/date-filter")
def filter_by_date(
    start: str = Query(...),
    end: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(admin_required),
):
    start_date = datetime.fromisoformat(start)
    end_date = datetime.fromisoformat(end)

    settlements = (
        db.query(Settlement)
        .filter(
            Settlement.created_at >= start_date,
            Settlement.created_at <= end_date
        )
        .order_by(Settlement.id.desc())
        .all()
    )

    return settlements