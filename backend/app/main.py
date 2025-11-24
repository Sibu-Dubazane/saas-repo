# FastAPI application factory and router wiring

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.rate_limiter import init_rate_limiter
from app.api import auth, users

app = FastAPI(title="SaaS Backend", version="0.1.0")

# CORS for local dev (origins from env)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.BACKEND_CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_rate_limiter(app)

# Routers
app.include_router(auth.router)
app.include_router(users.router)

@app.get("/")
def health():
    return {"status": "ok", "service": "backend"}
