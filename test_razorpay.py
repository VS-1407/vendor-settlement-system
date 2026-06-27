from app.razorpay_client import client

try:
    # Simple API call to verify authentication
    payments = client.payment.all({"count": 1})
    print("✅ Razorpay connected successfully!")
    print(payments)

except Exception as e:
    print("❌ Connection failed")
    print(e)