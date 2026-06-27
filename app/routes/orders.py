from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Order
from workers.tasks import process_settlement

router = APIRouter()


# ==========================
# Create New Order
# ==========================
@router.post("/orders")
def create_order(
    amount: float,
    db: Session = Depends(get_db)
):
    order = Order(
        amount=amount,
        status="Pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "message": "Order created successfully",
        "order_id": order.id,
        "amount": order.amount,
        "status": order.status
    }


# ==========================
# Get All Orders
# ==========================
@router.get("/orders")
def get_orders(
    db: Session = Depends(get_db)
):
    return (
        db.query(Order)
        .order_by(Order.id.desc())
        .all()
    )


# ==========================
# Complete Order
# ==========================
@router.put("/orders/{order_id}/complete")
def complete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status == "Completed":
        return {
            "message": "Order already completed"
        }

    order.status = "Completed"

    db.commit()
    db.refresh(order)

    # Start Celery Background Task
    process_settlement.delay(order.id)

    return {
        "message": "Order completed successfully",
        "order": order
    }


# ==========================
# Recent Orders
# ==========================
@router.get("/recent-orders")
def recent_orders(
    db: Session = Depends(get_db)
):
    return (
        db.query(Order)
        .order_by(Order.id.desc())
        .limit(10)
        .all()
    )


# ==========================
# Delete Order
# ==========================
@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    db.delete(order)
    db.commit()

    return {
        "message": "Order deleted successfully"
    }