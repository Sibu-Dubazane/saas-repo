"""Helpers for working with versioned API routers."""

from importlib import import_module
from fastapi import APIRouter

__all__ = ["get_version_router"]


def get_version_router(version: str) -> APIRouter:
    """Dynamically load the router for a given API version."""
    module = import_module(f"app.api.{version}")
    router = getattr(module, "router", None)
    if router is None:
        raise AttributeError(f"app.api.{version} does not expose a router")
    return router

