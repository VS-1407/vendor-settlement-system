from tests.test_setup import client
import uuid


# Generate a unique user for testing
test_username = "test_" + str(uuid.uuid4())[:8]
test_password = "test123"
admin_username = "admin_" + str(uuid.uuid4())[:8]
admin_password = "admin123"

def test_home():
    response = client.get("/docs")

    assert response.status_code == 200


def test_register_user():

    response = client.post(
        "/register",
        params={
            "username": test_username,
            "email": f"{test_username}@gmail.com",
            "password": test_password,
            "role": "vendor"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "User registered successfully"
    assert data["role"] == "vendor"


def test_login_success():

    response = client.post(
        "/login",
        params={
            "username": test_username,
            "password": test_password
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "vendor"


def test_login_invalid_password():

    response = client.post(
        "/login",
        params={
            "username": test_username,
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401

    data = response.json()

    assert data["success"] is False
    assert data["error"] == "Invalid username or password"


def test_admin_route_without_token():

    response = client.get(
        "/analytics/overview"
    )

    assert response.status_code == 401

def test_vendor_cannot_access_admin_route():

    # Login as vendor
    login_response = client.post(
        "/login",
        params={
            "username": test_username,
            "password": test_password
        }
    )

    token = login_response.json()["access_token"]

    # Access admin API using vendor token
    response = client.get(
        "/analytics/overview",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 403

    data = response.json()

def test_admin_can_access_admin_route():

    # Register admin
    register_response = client.post(
        "/register",
        params={
            "username": admin_username,
            "email": f"{admin_username}@gmail.com",
            "password": admin_password,
            "role": "admin"
        }
    )

    assert register_response.status_code == 200


    # Login as admin
    login_response = client.post(
        "/login",
        params={
            "username": admin_username,
            "password": admin_password
        }
    )

    assert login_response.status_code == 200

    token = login_response.json()["access_token"]


    # Access admin protected route
    response = client.get(
        "/analytics/overview",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )


    assert response.status_code == 200

    data = response.json()

    assert "total_vendor_payout" in data
    assert "successful_transactions" in data
    assert "failed_transactions" in data
    assert "pending_transactions" in data
