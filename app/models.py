from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)

    name = Column(String(100))
    email = Column(String(100))
    account_id = Column(String(100))
    created_at = Column(
     DateTime,
     default=datetime.utcnow
    )   


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class Settlement(Base):
    __tablename__ = "settlements"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer)
    vendor_id = Column(Integer)

    amount = Column(Float)

    status = Column(String(50), default="Pending")

    transfer_id = Column(String(100), nullable=True)

    retry_count = Column(Integer, default=0)

    last_retry_at = Column(
        DateTime,
        nullable=True
    )

    created_at = Column(DateTime, default=datetime.utcnow)

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer)
    vendor_id = Column(Integer)

    item_name = Column(String(100))
    price = Column(Float)
    quantity = Column(Integer)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(50),
        unique=True,
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    role = Column(
        String(20),
        default="vendor"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


class TransactionLedger(Base):
    __tablename__ = "transaction_ledger"

    id = Column(Integer, primary_key=True, index=True)

    settlement_id = Column(Integer)

    event_type = Column(
        String(50)
    )

    message = Column(
        String(255)
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )