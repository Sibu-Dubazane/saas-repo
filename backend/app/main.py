# FastAPI application factory and router wiring

from fastapi import APIRouter, FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.rate_limiter import init_rate_limiter
from app.api.v1 import router as v1_router

app = FastAPI(title="SaaS Backend", version="0.2.0")

# CORS for local dev (origins from env)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.BACKEND_CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_rate_limiter(app)

# Versioned API routers
app.include_router(v1_router)


def _legacy_redirect(prefix: str):
    async def handler(request: Request, path: str = ""):
        suffix = f"/{path}" if path else ""
        query = f"?{request.query_params}" if request and request.query_params else ""
        target = f"/api/v1/{prefix}{suffix}{query}"
        return RedirectResponse(
            url=target,
            status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        )

    return handler


legacy_router = APIRouter(include_in_schema=False)
_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

legacy_router.api_route("/auth", methods=_methods)(_legacy_redirect("auth"))
legacy_router.api_route("/auth/{path:path}", methods=_methods)(_legacy_redirect("auth"))
legacy_router.api_route("/users", methods=_methods)(_legacy_redirect("users"))
legacy_router.api_route("/users/{path:path}", methods=_methods)(_legacy_redirect("users"))

app.include_router(legacy_router)


@app.get("/", include_in_schema=False)
def root_redirect():
    """Redirect legacy callers to the versioned health endpoint."""
    return RedirectResponse(url="/api/v1/health")
