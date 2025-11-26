"""Version 1 of the public API."""

from __future__ import annotations

from fastapi import APIRouter

from . import auth, users

router = APIRouter(prefix="/api/v1", tags=["v1"])

router.include_router(auth.router)
router.include_router(users.router)


@router.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Simple health probe for versioned API."""
    return {"status": "ok", "service": "backend", "version": "v1"}

