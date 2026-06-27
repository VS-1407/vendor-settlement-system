from datetime import datetime

from workers.celery_worker import celery_app
from app.database import SessionLocal
from app.models import Settlement, Vendor
from app.payment_service import send_vendor_payment
from app.ledger import create_log
from app.logger import logger


@celery_app.task
def process_settlement(order_id):

    db = SessionLocal()

    try:

        settlements = (
            db.query(Settlement)
            .filter(
                Settlement.status == "Pending"
            )
            .all()
        )

        for settlement in settlements:

            vendor = (
                db.query(Vendor)
                .filter(
                    Vendor.id == settlement.vendor_id
                )
                .first()
            )

            if not vendor:
                continue


            result = send_vendor_payment(
                vendor,
                settlement.amount
            )


            # Payment successful
            if result["success"]:

                settlement.status = "Success"

                logger.info(
                    f"Payment successful for Settlement ID: {settlement.id}"
                )

                settlement.transfer_id = (
                    result["transfer_id"]
                )

                create_log(
                    db,
                    settlement.id,
                    "PAYMENT_SUCCESS",
                    "Vendor payout completed successfully"
                )


            # Payment failed
            else:

                settlement.status = "Failed"

                logger.error(
                    f"Payment failed for Settlement ID: {settlement.id}"
                )

                create_log(
                    db,
                    settlement.id,
                    "PAYMENT_FAILED",
                    "Vendor payout failed"
                )


        db.commit()


        return {
            "message": "Settlement processing completed"
        }


    finally:
        db.close()



# ---------------------------------
# Retry Failed Settlements
# ---------------------------------

@celery_app.task
def retry_failed_settlements():

    db = SessionLocal()

    try:

        failed_settlements = (
            db.query(Settlement)
            .filter(
                Settlement.status == "Failed",
                Settlement.retry_count < 3
            )
            .all()
        )


        for settlement in failed_settlements:

            vendor = (
                db.query(Vendor)
                .filter(
                    Vendor.id == settlement.vendor_id
                )
                .first()
            )


            if not vendor:
                continue


            result = send_vendor_payment(
                vendor,
                settlement.amount
            )


            # Retry successful
            if result["success"]:

                settlement.status = "Success"

                logger.info(
                    f"Retry payment successful for Settlement ID: {settlement.id}"
                )

                settlement.transfer_id = (
                    result["transfer_id"]
                )

                create_log(
                    db,
                    settlement.id,
                    "RETRY_SUCCESS",
                    "Payment completed after retry"
                )


            # Retry failed
            else:

                settlement.retry_count += 1

                settlement.last_retry_at = (
                    datetime.utcnow()
                )
                logger.warning(
                    f"Retry {settlement.retry_count} failed for Settlement ID: {settlement.id}"
                )  
                create_log(
                    db,
                    settlement.id,
                    "RETRY_FAILED",
                    f"Retry attempt {settlement.retry_count} failed"
                )


        db.commit()


        return {
            "message": "Retry process completed"
        }


    finally:
        db.close()