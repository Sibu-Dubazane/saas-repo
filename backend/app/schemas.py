# Pydantic schemas for requests/responses

from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator

from app.db.models import UserRole
from app.core.password_policy import validate_password_strength

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    password_confirm: str

    @field_validator("password")
    def password_policy(cls, v):
        validate_password_strength(v)
        return v

    @field_validator("password_confirm")
    def passwords_match(cls, v, info):
        # In Pydantic v2, sibling values are inside info.data
        password = info.data.get("password")
        if password and v != password:
            raise ValueError("Passwords do not match")
        return v


class UserPublic(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    role: UserRole
    created_at: datetime | None = None
    updated_at: datetime | None = None


    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class RoleUpdate(BaseModel):
    role: UserRole
