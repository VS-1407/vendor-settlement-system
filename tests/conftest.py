import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add project root to Python path
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..")
    )
)

from app.main import app
from app.database import SessionLocal
from app.models import (
    Settlement,
    OrderItem,
    Vendor,
    User,
    TransactionLedger
)


# -----------------------
# Test Client Fixture
# -----------------------
@pytest.fixture
def client():
    return TestClient(app)


# -----------------------
# Database Fixture
# -----------------------
@pytest.fixture
def db():
    db = SessionLocal()

    # Clean database before each test
    db.query(TransactionLedger).delete()
    db.query(Settlement).delete()
    db.query(OrderItem).delete()
    db.query(Vendor).delete()
    db.query(User).delete()

    db.commit()

    try:
        yield db
    finally:
        db.close()

os.environ["TESTING"] = "True"
