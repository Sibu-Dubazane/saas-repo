"""User management routes for API v1."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import UserPublic, RoleUpdate
from app.db.models import User, UserRole
from app.deps import (
    get_current_user,
    get_db,
    get_current_master_admin,
    get_current_active_superuser,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def read_me(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current


@router.get("/", response_model=list[UserPublic])
def list_users(
    _: User = Depends(get_current_master_admin),
    db: Session = Depends(get_db),
):
    return db.query(User).all()


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(
    user_id: int,
    current: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    elevated_roles = {
        UserRole.SUPERUSER,
        UserRole.MASTER_ADMIN,
        UserRole.NORMAL_ADMIN,
    }
    if current.role not in elevated_roles and current.id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return user


@router.patch("/{user_id}/role", response_model=UserPublic)
def update_user_role(
    user_id: int,
    payload: RoleUpdate,
    current: User = Depends(get_current_active_superuser),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = payload.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

