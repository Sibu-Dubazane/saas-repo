"""add user role enum

Revision ID: 3e9d98c04dea
Revises: 4da2cb60c81d
Create Date: 2025-11-19 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column


# revision identifiers, used by Alembic.
revision: str = "3e9d98c04dea"
down_revision: Union[str, None] = "4da2cb60c81d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


user_role_enum = sa.Enum(
    "superuser",
    "master_admin",
    "normal_admin",
    "normal_user",
    name="user_role",
)


def upgrade() -> None:
    bind = op.get_bind()
    user_role_enum.create(bind, checkfirst=True)

    op.add_column("users", sa.Column("role", user_role_enum, nullable=True))

    # Backfill existing users:
    # - previous is_superuser = true  -> role = 'superuser'
    # - previous is_superuser = false -> role = 'normal_user'
    op.execute(
        """
        UPDATE users
        SET role = CASE
            WHEN is_superuser = TRUE THEN 'superuser'::user_role
            ELSE 'normal_user'::user_role
        END
        """
    )

    op.alter_column(
        "users",
        "role",
        existing_type=user_role_enum,
        nullable=False,
        server_default="normal_user",
    )

    op.drop_column("users", "is_superuser")


def downgrade() -> None:
    bind = op.get_bind()

    op.add_column(
        "users",
        sa.Column(
            "is_superuser",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )

    # Restore is_superuser flag from role for rollback
    op.execute(
        """
        UPDATE users
        SET is_superuser = CASE
            WHEN role = 'superuser'::user_role THEN TRUE
            ELSE FALSE
        END
        """
    )

    op.drop_column("users", "role")
    user_role_enum.drop(bind, checkfirst=True)


