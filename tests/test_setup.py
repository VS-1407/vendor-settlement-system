import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal


# API client
client = TestClient(app)


# Database session fixture
@pytest.fixture
def db():

    database = SessionLocal()

    try:
        yield database

    finally:
        database.close()