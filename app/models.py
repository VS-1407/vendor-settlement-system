from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# ----------------------------
# Users
# ----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    role = Column(String(20), default="vendor")

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    vendors = relationship(
        "Vendor",
        back_populates="user"
    )


# ----------------------------
# Vendors
# ----------------------------
class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)

    account_id = Column(
        String(100),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="vendors"
    )


# ----------------------------
# Orders
# ----------------------------
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    amount = Column(Float, nullable=False)

    status = Column(
        String(50),
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ----------------------------
# Settlements
# ----------------------------
class Settlement(Base):
    __tablename__ = "settlements"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id")
    )

    amount = Column(Float, nullable=False)

    status = Column(
        String(50),
        default="Pending"
    )

    transfer_id = Column(
        String(100),
        nullable=True
    )

    retry_count = Column(
        Integer,
        default=0
    )

    last_retry_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ----------------------------
# Order Items
# ----------------------------
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id")
    )

    item_name = Column(
        String(100),
        nullable=False
    )

    price = Column(
        Float,
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ----------------------------
# Transaction Ledger
# ----------------------------
class TransactionLedger(Base):
    __tablename__ = "transaction_ledger"

    id = Column(Integer, primary_key=True, index=True)

    settlement_id = Column(
        Integer,
        ForeignKey("settlements.id")
    )

    event_type = Column(
        String(50),
        nullable=False
    )

    message = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )