"""Deprecated module: use `app.api.v1.auth`."""

from __future__ import annotations

import warnings

from app.api.v1.auth import router

warnings.warn(
    "Importing `app.api.auth` is deprecated. Use `app.api.v1.auth` instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["router"]
