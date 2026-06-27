from tests.test_setup import client
from unittest.mock import patch


def test_create_order():

    response = client.post(
        "/orders",
        params={
            "amount": 5000
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Order created successfully"
    assert data["amount"] == 5000
    assert data["status"] == "Pending"


def test_get_orders():

    response = client.get(
        "/orders"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)


@patch("app.routes.orders.process_settlement.delay")
def test_complete_order_success(mock_delay):

    # Create an order first
    create_response = client.post(
        "/orders",
        params={
            "amount": 1000
        }
    )

    order_id = create_response.json()["order_id"]

    # Complete the order
    response = client.put(
        f"/orders/{order_id}/complete"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["message"] == "Order completed. Settlement started."
    assert data["order_id"] == order_id

    # Check Celery task called
    mock_delay.assert_called_once_with(order_id)


def test_complete_invalid_order():

    response = client.put(
        "/orders/999999/complete"
    )

    assert response.status_code == 404

    data = response.json()

    # Handle your custom exception format
    if "detail" in data:
        assert data["detail"] == "Order not found"
    else:
        assert data["error"] == "Order not found"