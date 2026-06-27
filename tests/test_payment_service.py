import pytest
from unittest.mock import MagicMock, patch

from app.payment_service import send_vendor_payment
from app.custom_exceptions import PaymentException


class DummyVendor:
    razorpay_account_id = "acc_test123"


def test_vendor_payment_success():

    vendor = DummyVendor()

    with patch(
        "app.payment_service.client.transfer.create"
    ) as mock_transfer:

        mock_transfer.return_value = {
            "id": "trf_12345"
        }

        result = send_vendor_payment(
            vendor,
            1000
        )

        assert result["success"] == True
        assert result["transfer_id"] == "trf_12345"


def test_vendor_payment_failure():

    vendor = DummyVendor()

    with patch(
        "app.payment_service.client.transfer.create"
    ) as mock_transfer:

        mock_transfer.side_effect = Exception(
            "Razorpay error"
        )

        with pytest.raises(PaymentException):

            send_vendor_payment(
                vendor,
                1000
            )