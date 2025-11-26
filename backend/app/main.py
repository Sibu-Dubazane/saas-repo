# FastAPI application factory and router wiring

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.core.config import settings
from app.core.rate_limiter import init_rate_limiter
from app.api.v1 import router as v1_router

app = FastAPI(title="SaaS Backend", version="0.3.0")

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


@app.get("/", include_in_schema=False)
def root_redirect():
    """Redirect legacy callers to the versioned health endpoint."""
    return RedirectResponse(url="/api/v1/health")
