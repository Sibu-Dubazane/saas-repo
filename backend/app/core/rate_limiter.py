from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings


def _client_identifier(request: Request) -> str:
    """Resolve a best-effort client identifier for throttling."""
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "anonymous"


limiter = Limiter(
    key_func=_client_identifier,
    storage_uri=settings.RATE_LIMIT_STORAGE_URI,
)


def init_rate_limiter(app: FastAPI) -> None:
    """Register SlowAPI limiter middleware and exception handler."""
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    app.add_middleware(SlowAPIMiddleware)

