"""Deprecated module: use `app.api.v1.users`."""

from __future__ import annotations

import warnings

from app.api.v1.users import router

warnings.warn(
    "Importing `app.api.users` is deprecated. Use `app.api.v1.users` instead.",
    DeprecationWarning,
    stacklevel=2,
)

__all__ = ["router"]