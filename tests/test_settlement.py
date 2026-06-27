import pytest

from app.settlement import split_payment
from app.models import OrderItem, Settlement
from app.custom_exceptions import SettlementException


# ----------------------------
# Test: No order items
# ----------------------------
def test_no_order_items(db):

    with pytest.raises(SettlementException) as exc:

        split_payment(999, db)

    assert str(exc.value) == "No items found for this order"


# ----------------------------
# Test: Duplicate settlement
# ----------------------------
def test_duplicate_settlement(db):

    # Step 1: Create order item FIRST (required for split_payment to proceed)
    item = OrderItem(
        order_id=1,
        vendor_id=1,
        price=100,
        quantity=1
    )

    db.add(item)
    db.commit()

    # Step 2: Create existing settlement
    settlement = Settlement(
        order_id=1,
        vendor_id=1,
        amount=100,
        status="Pending"
    )

    db.add(settlement)
    db.commit()

    # Step 3: Now call function → should raise duplicate exception
    with pytest.raises(SettlementException) as exc:
        split_payment(1, db)

    assert str(exc.value) == "Settlement already exists for this order"


# ----------------------------
# Test: Successful settlement
# ----------------------------
def test_successful_settlement(db):

    item = OrderItem(
        order_id=2,
        vendor_id=1,
        price=100,
        quantity=2
    )

    db.add(item)
    db.commit()


    result = split_payment(2, db)


    assert result["message"] == "Settlement created successfully"

    assert result["settlements"][0]["vendor_id"] == 1

    assert result["settlements"][0]["total_sale"] == 200

    assert result["settlements"][0]["platform_fee"] == 20

    assert result["settlements"][0]["vendor_payout"] == 180


# ----------------------------
# Test: Multiple vendors
# ----------------------------
def test_multiple_vendors(db):

    item1 = OrderItem(
        order_id=3,
        vendor_id=1,
        price=100,
        quantity=1
    )

    item2 = OrderItem(
        order_id=3,
        vendor_id=2,
        price=200,
        quantity=1
    )


    db.add(item1)
    db.add(item2)

    db.commit()


    result = split_payment(3, db)


    assert len(result["settlements"]) == 2

    vendor1 = result["settlements"][0]
    vendor2 = result["settlements"][1]


    assert vendor1["vendor_payout"] == 90
    assert vendor2["vendor_payout"] == 180


# ----------------------------
# Test: Settlement saved in DB
# ----------------------------
def test_settlement_created_in_database(db):

    item = OrderItem(
        order_id=4,
        vendor_id=5,
        price=500,
        quantity=1
    )

    db.add(item)
    db.commit()


    split_payment(4, db)


    settlement = (
        db.query(Settlement)
        .filter(Settlement.order_id == 4)
        .first()
    )


    assert settlement is not None
    assert settlement.vendor_id == 5
    assert settlement.amount == 450
    assert settlement.status == "Pending"