from app.models import TransactionLedger


def create_log(
    db,
    settlement_id,
    event_type,
    message
):

    log = TransactionLedger(
        settlement_id=settlement_id,
        event_type=event_type,
        message=message
    )

    db.add(log)