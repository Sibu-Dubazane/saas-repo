from hashlib import sha1
from typing import Final

import httpx

from app.core.config import settings

HIBP_RANGE_ENDPOINT: Final[str] = "https://api.pwnedpasswords.com/range/{prefix}"


def validate_password_strength(password: str) -> None:
    """Validate password complies with local policy and (optionally) HIBP."""
    _ensure_minimum_requirements(password)
    if settings.HIBP_ENABLED:
        _ensure_not_breached(password)


def _ensure_minimum_requirements(password: str) -> None:
    if len(password) < 12:
        raise ValueError("Password must be at least 12 characters long")

    if not any(c.islower() for c in password):
        raise ValueError("Password must include a lowercase letter")
    if not any(c.isupper() for c in password):
        raise ValueError("Password must include an uppercase letter")
    if not any(c.isdigit() for c in password):
        raise ValueError("Password must include a number")
    if not any(not c.isalnum() for c in password):
        raise ValueError("Password must include a special character")


def _ensure_not_breached(password: str) -> None:
    digest = sha1(password.encode("utf-8")).hexdigest().upper()
    prefix, suffix = digest[:5], digest[5:]
    url = HIBP_RANGE_ENDPOINT.format(prefix=prefix)

    try:
        response = httpx.get(
            url,
            headers={"Add-Padding": "true"},
            timeout=settings.HIBP_TIMEOUT,
        )
        response.raise_for_status()
    except httpx.HTTPError:
        # Fail open: we don't block signup if the service is unavailable.
        return

    for line in response.text.splitlines():
        if not line:
            continue
        hash_suffix, *_count = line.split(":")
        if hash_suffix == suffix:
            raise ValueError("Password appears in a known data breach")

