from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.rate_limiter import limiter
from app.logger import logger

router = APIRouter()


# -------------------------
# User Registration
# -------------------------
@router.post("/register")
def register(
    username: str,
    email: str,
    password: str,
    role: str = "vendor",
    db: Session = Depends(get_db),
):

    existing_user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists",
        )

    hashed_password = hash_password(password)

    user = User(
        username=username,
        email=email,
        password=hashed_password,
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info(
        f"New user registered: {username} ({role})"
    )

    return {
        "message": "User registered successfully",
        "user_id": user.id,
        "role": user.role,
    }


# -------------------------
# User Login
# -------------------------
@router.post("/login")
@limiter.limit("100/minute")
def login(
    request: Request,
    username: str,
    password: str,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:

        logger.warning(
            f"Failed login - Username not found: {username}"
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    if not verify_password(
        password,
        user.password,
    ):

        logger.warning(
            f"Failed login - Incorrect password for: {username}"
        )

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    token = create_access_token(
        {
            "user_id": user.id,
            "username": user.username,
            "role": user.role,
        }
    )

    logger.info(
        f"User logged in successfully: {username}"
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
    }

