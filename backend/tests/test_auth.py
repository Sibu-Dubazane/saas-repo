import os

import pytest
from fastapi.testclient import TestClient

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("JWT_SECRET", "test-secret")

from app.main import app
from app.db.session import Base, engine

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
client = TestClient(app)

STRONG_PASSWORD = "Sup3rSecurePwd!1"


@pytest.mark.order(1)
def test_signup_and_login():
    email = "test@example.com"
    r = client.post(
        "/auth/signup",
        json={
            "email": email,
            "password": STRONG_PASSWORD,
            "password_confirm": STRONG_PASSWORD,
        },
    )
    assert r.status_code in (200, 400)  # might exist if test reruns
    r = client.post("/auth/login", json={"email": email, "password": STRONG_PASSWORD})
    assert r.status_code == 200
    token = r.json()["access_token"]
    cookie_header = r.headers.get("set-cookie", "")
    assert "access_token=" in cookie_header
    assert "HttpOnly" in cookie_header
    assert "Secure" in cookie_header
    r = client.get("/users/me", cookies={"access_token": token})
    assert r.status_code == 200
    assert r.json()["email"] == email


@pytest.mark.order(2)
def test_logout_clears_cookie():
    email = "logout-test@example.com"
    client.post(
        "/auth/signup",
        json={
            "email": email,
            "password": STRONG_PASSWORD,
            "password_confirm": STRONG_PASSWORD,
        },
    )
    login = client.post("/auth/login", json={"email": email, "password": STRONG_PASSWORD})
    assert login.status_code == 200
    logout = client.post("/auth/logout")
    assert logout.status_code == 204
    cleared_header = logout.headers.get("set-cookie", "")
    assert "access_token=" in cleared_header
    assert "max-age=0" in cleared_header.lower()


@pytest.mark.order(3)
def test_signup_rejects_weak_password():
    resp = client.post(
        "/auth/signup",
        json={
            "email": "weak-pass@example.com",
            "password": "short",
            "password_confirm": "short",
        },
    )
    assert resp.status_code == 422
    assert "Password must be at least 12 characters long" in resp.text


@pytest.mark.order(99)
def test_login_rate_limited():
    email = "ratelimit@example.com"
    client.post(
        "/auth/signup",
        json={
            "email": email,
            "password": STRONG_PASSWORD,
            "password_confirm": STRONG_PASSWORD,
        },
    )
    headers = {"X-Forwarded-For": "203.0.113.10"}
    for _ in range(5):
        ok = client.post("/auth/login", json={"email": email, "password": STRONG_PASSWORD}, headers=headers)
        assert ok.status_code == 200

    blocked = client.post("/auth/login", json={"email": email, "password": STRONG_PASSWORD}, headers=headers)
    assert blocked.status_code == 429
