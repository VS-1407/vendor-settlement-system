from app.razorpay_client import client
from app.custom_exceptions import PaymentException


def send_vendor_payment(vendor, amount):

    try:
        transfer = client.transfer.create({
            "account": vendor.razorpay_account_id,
            "amount": int(amount * 100),
            "currency": "INR",
            "notes": {
                "purpose": "Marketplace Settlement"
            }
        })

        return {
            "success": True,
            "transfer_id": transfer["id"]
        }

    except Exception as e:
        raise PaymentException("Vendor payment failed")