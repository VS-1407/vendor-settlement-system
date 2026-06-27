from fastapi.testclient import TestClient
from sqlalchemy.orm.session import Session

from app.models import User, Vendor, Settlement
from app.auth import hash_password


def create_vendor(db):

    user = User(
        username="dashboard_vendor",
        email="dashboard_vendor@gmail.com",
        password=hash_password("vendor123"),
        role="vendor"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    vendor = Vendor(
        user_id=user.id,
        name="Test Vendor",
        email="vendor@test.com",
        account_id="acc123"
    )

    db.add(vendor)
    db.commit()
    db.refresh(vendor)

    return user, vendor


def get_vendor_token(client):

    response = client.post(
        "/login",
        params={
            "username": "dashboard_vendor",
            "password": "vendor123"
        }
    )

    return response.json()["access_token"]


# ----------------------------
# Test vendor profile
# ----------------------------
def test_my_profile_success(client: TestClient, db: Session):

    create_vendor(db)

    token = get_vendor_token(client)

    response = client.get(
        "/my-profile",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Test Vendor"


# ----------------------------
# Test vendor settlements
# ----------------------------
def test_my_settlements_success(client: TestClient, db: Session):

    user, vendor = create_vendor(db)

    settlement = Settlement(
        order_id=999,
        vendor_id=vendor.id,
        amount=500,
        status="Success"
    )

    db.add(settlement)
    db.commit()

    token = get_vendor_token(client)

    response = client.get(
        "/my-settlements",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1


# ----------------------------
# Test settlement summary
# ----------------------------
def test_my_settlement_summary(client: TestClient, db: Session):

    user, vendor = create_vendor(db)

    settlement = Settlement(
        order_id=1000,
        vendor_id=vendor.id,
        amount=1000,
        status="Success"
    )

    db.add(settlement)
    db.commit()

    token = get_vendor_token(client)

    response = client.get(
        "/my-settlement-summary",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["total_earnings"] == 1000


# ----------------------------
# Test vendor profile not found
# ----------------------------
def test_vendor_profile_not_found(client: TestClient, db: Session):

    user = User(
        username="no_vendor",
        email="novendor@gmail.com",
        password=hash_password("test123"),
        role="vendor"
    )

    db.add(user)
    db.commit()

    response = client.post(
        "/login",
        params={
            "username": "no_vendor",
            "password": "test123"
        }
    )
    return response.json()["access_token"]

    response = client.get(
        "/my-profile",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 404

    data = response.json()

    assert data["error"] == "Vendor profile not found"