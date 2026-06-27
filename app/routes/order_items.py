from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import OrderItem


router = APIRouter()


@router.post("/order-items")
def create_order_item(
    order_id: int,
    vendor_id: int,
    item_name: str,
    price: float,
    quantity: int,
    db: Session = Depends(get_db)
):

    item = OrderItem(
        order_id=order_id,
        vendor_id=vendor_id,
        item_name=item_name,
        price=price,
        quantity=quantity
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return {
        "message": "Item added",
        "item_id": item.id
    }


@router.get("/order-items")
def get_items(
    db: Session = Depends(get_db)
):

    return db.query(OrderItem).all()