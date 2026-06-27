import pytest
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.exception_handler import (
    http_exception_handler,
    validation_exception_handler,
    database_exception_handler,
    general_exception_handler,
    payment_exception_handler,
    settlement_exception_handler,
    authorization_exception_handler
)

from app.custom_exceptions import (
    PaymentException,
    SettlementException,
    AuthorizationException
)


# Fake request object
class FakeRequest:
    method = "GET"

    class URL:
        path = "/test"

    url = URL()


request = FakeRequest()


@pytest.mark.asyncio
async def test_http_exception_handler():

    exc = HTTPException(
        status_code=404,
        detail="Not found"
    )

    response = await http_exception_handler(request, exc)

    assert response.status_code == 404
    assert b"Not found" in response.body


@pytest.mark.asyncio
async def test_validation_exception_handler():

    exc = RequestValidationError(
        errors=[
            {
                "msg": "Invalid input"
            }
        ]
    )

    response = await validation_exception_handler(request, exc)

    assert response.status_code == 422
    assert b"Invalid request data" in response.body


@pytest.mark.asyncio
async def test_database_exception_handler():

    exc = SQLAlchemyError("Database failed")

    response = await database_exception_handler(request, exc)

    assert response.status_code == 500
    assert b"Database operation failed" in response.body


@pytest.mark.asyncio
async def test_general_exception_handler():

    exc = Exception("Unknown error")

    response = await general_exception_handler(request, exc)

    assert response.status_code == 500
    assert b"Internal server error" in response.body


@pytest.mark.asyncio
async def test_payment_exception_handler():

    exc = PaymentException("Payment failed")

    response = await payment_exception_handler(request, exc)

    assert response.status_code == 400
    assert b"Payment failed" in response.body


@pytest.mark.asyncio
async def test_settlement_exception_handler():

    exc = SettlementException("Settlement failed")

    response = await settlement_exception_handler(request, exc)

    assert response.status_code == 400
    assert b"Settlement failed" in response.body


@pytest.mark.asyncio
async def test_authorization_exception_handler():

    exc = AuthorizationException("Access denied")

    response = await authorization_exception_handler(request, exc)

    assert response.status_code == 403
    assert b"Access denied" in response.body