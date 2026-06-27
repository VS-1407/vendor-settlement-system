from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.custom_exceptions import (
    PaymentException,
    SettlementException,
    AuthorizationException
)
from app.logger import logger


# Handle HTTP Exceptions
async def http_exception_handler(
    request: Request,
    exc: HTTPException
):

    logger.warning(
        f"HTTP Error {exc.status_code}: "
        f"{request.method} {request.url.path} - {exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail
        }
    )


# Handle Validation Errors
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):

    logger.warning(
        f"Validation Error: "
        f"{request.method} {request.url.path} - {exc.errors()}"
    )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Invalid request data",
            "details": exc.errors()
        }
    )


# Handle Database Errors
async def database_exception_handler(
    request: Request,
    exc: SQLAlchemyError
):

    logger.error(
        f"Database Error: "
        f"{request.method} {request.url.path} - {str(exc)}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Database operation failed"
        }
    )


# Handle Unexpected Exceptions
async def general_exception_handler(
    request: Request,
    exc: Exception
):

    logger.exception(
        f"Unhandled Error: "
        f"{request.method} {request.url.path}"
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error"
        }
    )

async def payment_exception_handler(
    request: Request,
    exc: PaymentException
):

    logger.error(
        f"Payment Error: {exc.message}"
    )

    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": exc.message
        }
    )


async def settlement_exception_handler(
    request: Request,
    exc: SettlementException
):

    logger.error(
        f"Settlement Error: {exc.message}"
    )

    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": exc.message
        }
    )


async def authorization_exception_handler(
    request: Request,
    exc: AuthorizationException
):

    logger.warning(
        f"Authorization Error: {exc.message}"
    )

    return JSONResponse(
        status_code=403,
        content={
            "success": False,
            "error": exc.message
        }
    )