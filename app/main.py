from fastapi import FastAPI
from app.middleware import RequestLoggerMiddleware
from app.routes import settlements
from app.routes.vendors import router as vendor_router
from app.routes.orders import router as order_router
from app.routes.settlements import router as settlement_router
from app.routes.order_items import router as item_router
from app.routes.auth import router as auth_router
from app.routes.vendor_dashboard import router as vendor_dashboard_router
from app.routes.analytics import router as analytics_router
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from app.rate_limiter import limiter
from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from fastapi.middleware.cors import CORSMiddleware
from app.routes.dashboard import router as dashboard_router
from app.routes import settlements


from app.exception_handler import (
    http_exception_handler,
    validation_exception_handler,
    database_exception_handler,
    general_exception_handler
)

from app.custom_exceptions import (
    PaymentException,
    SettlementException,
    AuthorizationException
)

from app.exception_handler import (
    payment_exception_handler,
    settlement_exception_handler,
    authorization_exception_handler
)
from app.routes import vendors

app = FastAPI(
    title="Multi Vendor Settlement API"
)

app.add_middleware(RequestLoggerMiddleware)
app.include_router(vendor_router)
app.include_router(order_router)
app.include_router(settlement_router)
app.include_router(item_router)
app.include_router(auth_router)
app.include_router(vendor_dashboard_router)
app.include_router(analytics_router)
app.include_router(vendors.router)
app.include_router(settlements.router)


@app.get("/")
def home():
    return {
        "message": "Multi Vendor Settlement API Running"
    }



app.add_exception_handler(
    HTTPException,
    http_exception_handler
)

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)

app.add_exception_handler(
    SQLAlchemyError,
    database_exception_handler
)

app.add_exception_handler(
    Exception,
    general_exception_handler
)

# Payment Exceptions
app.add_exception_handler(
    PaymentException,
    payment_exception_handler
)

# Settlement Exceptions
app.add_exception_handler(
    SettlementException,
    settlement_exception_handler
)

# Authorization Exceptions
app.add_exception_handler(
    AuthorizationException,
    authorization_exception_handler
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
