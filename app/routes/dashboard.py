from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Vendor, Order, Settlement

router = APIRouter()

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    total_orders = db.query(Order).count()

    total_vendors = db.query(Vendor).count()

    total_revenue = (
        db.query(func.sum(Settlement.amount)).scalar() or 0
    )

    total_settlements = db.query(Settlement).count()

    return {
        "total_orders": total_orders,
        "total_vendors": total_vendors,
        "total_revenue": total_revenue,
        "total_settlements": total_settlements,
    }