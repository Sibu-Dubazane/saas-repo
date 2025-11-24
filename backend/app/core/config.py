# Centralized settings using pydantic-settings for type safety and convenience.

from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000"

    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_SIGNUP: str = "3/minute"
    RATE_LIMIT_STORAGE_URI: str = "memory://"

    HIBP_ENABLED: bool = False
    HIBP_TIMEOUT: float = 2.0

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
