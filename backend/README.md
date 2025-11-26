# Backend

## Common dev commands (inside container)
- `alembic revision --autogenerate -m "msg"`
- `alembic upgrade head`
- `pytest -q`

## API (v0.3.0)
- `POST /api/v1/auth/signup` { email, password }
- `POST /api/v1/auth/login` { email, password } -> { access_token }
- `GET /api/v1/users/me` (Authorization: Bearer <token>)

## Rate limiting & password policy
- Configure rate limits via env vars: `RATE_LIMIT_LOGIN` (default `5/minute`), `RATE_LIMIT_SIGNUP` (`3/minute`), and `RATE_LIMIT_STORAGE_URI` (`redis://...` or `memory://` for dev).
- HIBP breach checks can be toggled with `HIBP_ENABLED=true` (requests to the Have I Been Pwned API, timeout via `HIBP_TIMEOUT` seconds).