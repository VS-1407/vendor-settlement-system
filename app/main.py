from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.database import Base, engine
import app.models

from app.middleware import RequestLoggerMiddleware
from app.rate_limiter import limiter

# Routers
from app.routes.auth import router as auth_router
from app.routes.orders import router as order_router
from app.routes.order_items import router as item_router
from app.routes.vendors import router as vendor_router
from app.routes.settlements import router as settlement_router
from app.routes.vendor_dashboard import router as vendor_dashboard_router
from app.routes.analytics import router as analytics_router
from app.routes.dashboard import router as dashboard_router

# Custom Exceptions
from app.custom_exceptions import (
    PaymentException,
    SettlementException,
    AuthorizationException,
)

# Exception Handlers
from app.exception_handler import (
    http_exception_handler,
    validation_exception_handler,
    database_exception_handler,
    general_exception_handler,
    payment_exception_handler,
    settlement_exception_handler,
    authorization_exception_handler,
)

app = FastAPI(
    title="Multi Vendor Settlement API",
    version="1.0.0"
)

# -----------------------------
# CREATE ALL TABLES
# -----------------------------
Base.metadata.create_all(bind=engine)

# -----------------------------
# Rate Limiter
# -----------------------------
app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)

app.add_middleware(SlowAPIMiddleware)

# -----------------------------
# Middleware
# -----------------------------
app.add_middleware(RequestLoggerMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Routers
# -----------------------------
app.include_router(auth_router)
app.include_router(vendor_router)
app.include_router(order_router)
app.include_router(item_router)
app.include_router(settlement_router)
app.include_router(vendor_dashboard_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)

# -----------------------------
# Home
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "Multi Vendor Settlement API Running"
    }

# -----------------------------
# Exception Handlers
# -----------------------------
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
    PaymentException,
    payment_exception_handler
)

app.add_exception_handler(
    SettlementException,
    settlement_exception_handler
)

app.add_exception_handler(
    AuthorizationException,
    authorization_exception_handler
)

app.add_exception_handler(
    Exception,
    general_exception_handler
)