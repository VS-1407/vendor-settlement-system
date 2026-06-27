from app.models import OrderItem, Settlement
from app.ledger import create_log
from app.custom_exceptions import SettlementException


def split_payment(order_id, db):

    # Get all items of the order
    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order_id)
        .all()
    )

    # Check if order has items
    if not items:
        raise SettlementException("No items found for this order")

    # Prevent duplicate settlement
    existing = (
        db.query(Settlement)
        .filter(Settlement.order_id == order_id)
        .first()
    )

    if existing:
        raise SettlementException("Settlement already exists for this order")

    # Store total amount per vendor
    vendor_totals = {}

    for item in items:

        total = item.price * item.quantity

        if item.vendor_id not in vendor_totals:
            vendor_totals[item.vendor_id] = 0

        vendor_totals[item.vendor_id] += total


    settlements = []

    # Create settlements for each vendor
    for vendor_id, amount in vendor_totals.items():

        # Calculate 10% platform commission
        commission = amount * 0.10

        # Vendor receives remaining amount
        payout = amount - commission


        settlement = Settlement(
            order_id=order_id,
            vendor_id=vendor_id,
            amount=payout,
            status="Pending"
        )

        # Add settlement to database
        db.add(settlement)

        # Generate settlement ID before commit
        db.flush()

        # Create audit log
        create_log(
            db,
            settlement.id,
            "CREATED",
            f"Settlement created for vendor {vendor_id}"
        )


        settlements.append({
            "vendor_id": vendor_id,
            "total_sale": amount,
            "platform_fee": commission,
            "vendor_payout": payout
        })

    # Save settlements and logs
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise SettlementException("Failed to create settlement")

    return {
        "message": "Settlement created successfully",
        "settlements": settlements
    }