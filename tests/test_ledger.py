from unittest.mock import MagicMock

from app.ledger import create_log


def test_create_log():

    # Create fake database
    db = MagicMock()

    # Call function
    create_log(
        db,
        settlement_id=1,
        event_type="CREATED",
        message="Settlement created successfully"
    )

    # Check db.add was called once
    db.add.assert_called_once()

    # Get added object
    log = db.add.call_args[0][0]

    assert log.settlement_id == 1
    assert log.event_type == "CREATED"
    assert log.message == "Settlement created successfully"