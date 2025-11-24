# SaaS Mono (FastAPI + Next.js + Postgres, Docker, Windows PowerShell)

Monorepo starter that pairs a FastAPI backend with a Next.js frontend plus dev tooling for Windows users.

- **Backend:** FastAPI, SQLAlchemy 2.0, Alembic, Passlib, JWT auth, SlowAPI rate limiting.
- **Frontend:** Next.js App Router with Bulma UI, Axios client, dashboard pages.
- **Database:** PostgreSQL 16.
- **Tooling:** Docker Compose, Traefik (dev proxy), PowerShell helper scripts.

---

## 1. Repository layout

```
saas-mono/
├── backend/                 # FastAPI app, Alembic, pytest
├── frontend/                # Next.js app (App Router)
├── docker/                  # docker-compose.dev.yml + .env template
├── reverse-proxy/           # Traefik static/dynamic config (optional hardening)
├── powershell/              # setup/dev/test helper scripts
├── README.md                # this file
└── .venv/                   # optional local virtualenv (gitignored)
```

---

## 2. Environment variables

Copy the provided templates and adjust the values before running anything:

```powershell
copy docker\.env.example docker\.env
copy backend\.env.example backend\.env
copy frontend\.env.local.example frontend\.env.local
```

Key variables:

| File | Purpose | Important Keys |
|------|---------|----------------|
| `docker/.env` | Compose-level secrets for Postgres + backend | `POSTGRES_*`, `BACKEND_PORT`, `JWT_SECRET`, `TRAEFIK_DASHBOARD` |
| `backend/.env` | FastAPI settings | `DATABASE_URL`, `JWT_SECRET`, `RATE_LIMIT_*`, `HIBP_*` |
| `frontend/.env.local` | Next.js runtime config | `NEXT_PUBLIC_API_URL` |

Generate a 64-char hex secret for `JWT_SECRET` (use `powershell -Command "[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')"`).

---

## 3. One-time setup (Windows PowerShell)

```powershell
# Clone and enter repo
git clone <your-repo-url> saas-mono
cd saas-mono

# Bootstrap everything (copies env templates, sets JWT secret, installs frontend deps, builds containers, runs migrations)
powershell\setup.ps1
```

> Need to regenerate env files? Re-run `setup.ps1 -Force`.

---

## 4. Daily workflow

```powershell
# Start or restart the dockerized dev stack (db, backend, frontend, traefik)
powershell\dev.ps1

# Apply Alembic migrations without restarting everything
powershell\db-migrate.ps1 -Upgrade

# Run backend pytest suite inside container
powershell\test.ps1
```

Backend auto-reloads via `uvicorn --reload`, frontend via `next dev`. Traefik proxies everything on http://localhost.

---

## 5. Testing locally (without Docker)

### Backend
```powershell
cd backend
python -m venv .venv
.\\.venv\\Scripts\\activate
pip install -r requirements.txt
pytest -q
```

### Frontend
```powershell
cd frontend
npm install
npm run lint
npm run dev
```

---

## 6. Security features

- **Password policy:** `backend/app/core/password_policy.py` enforces 12+ chars, mixed complexity, optional HaveIBeenPwned checks.
- **Rate limiting:** SlowAPI middleware with configurable limits for `/auth/signup` and `/auth/login`.
- **JWT handling:** Tokens are issued server-side (httpOnly cookie optional) with configurable expiry.
- **Role-based access control:** `app/deps.py` enforces role gates (superuser/master/admin).
- **Frontend:** Axios client ready for secure cookie mode (set `withCredentials=true`).

Future hardening ideas (optional): enable HTTPS via Traefik certificates, guard the Traefik dashboard, and add CI-powered SAST + dependency scans.

---

## 7. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `No module named pytest` | Activate `.venv` or run `pip install -r backend/requirements.txt`. |
| Frontend can’t reach API | Ensure `NEXT_PUBLIC_API_URL` matches backend URL/port and CORS origins include the frontend. |
| Traefik dashboard inaccessible | It’s bound to `127.0.0.1:8080` by default; change the port mapping if you need LAN access (not recommended). |
| Postgres data missing | Volume `pgdata` is defined in `docker-compose.dev.yml`; ensure Docker Desktop has adequate disk space. |

---

## 8. Next steps

- Add CI (GitHub Actions) to run pytest, eslint, bandit/ruff, npm audit.
- Switch frontend auth storage to secure cookies (remove `localStorage` tokens).
- Tighten Traefik (TLS, auth) and add monitoring/logging stack.

Happy hacking! 💻🚀

# SaaS Mono (FastAPI + Next.js + Postgres, Docker, Windows PowerShell)

This monorepo gives you a working SaaS starter:
- **Backend:** FastAPI + SQLAlchemy + Alembic + JWT auth
- **Frontend:** Next.js (App Router) + Bulma CSS + simple auth pages
- **Database:** PostgreSQL
- **Dev Orchestration:** Docker Compose + Traefik
- **OS:** Windows (PowerShell scripts provided)

## Quick Start (Windows, Local Dev)

```powershell
# Clone and enter
git clone <your-repo-url> saas-mono
cd saas-mono

# One-time setup: copy envs, create secrets, install Node deps, build images, run migrations
powershell\setup.ps1

# Start dev stack (hot reload for frontend/backend inside containers)
powershell\dev.ps1
