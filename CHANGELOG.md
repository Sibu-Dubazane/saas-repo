# Changelog

All notable changes to this project will be documented in this file. The format is inspired by [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to semantic versioning.

## [0.3.0] - 2025-11-26

### Breaking

- Removed the legacy `/auth/*` and `/users/*` routes. Clients must call `/api/v1/...` endpoints directly; requests to the old paths now return `404 Not Found`.

### Added

- Regression test (`backend/tests/test_auth.py::test_legacy_routes_removed`) that locks in the 404 behavior for unversioned routes.
- Centralized the `/api/v1` prefix inside `frontend/src/lib/api.ts` so all React callers reuse a single constant.
- Restored the API versioning utilities under `backend/tools/versioning_tools.py` to simplify cloning/diffing new versions.
- Added release documentation in `docs/api-versioning.md`, `docs/login-troubleshooting.md`, and backend README updates that reference `/api/v1`.

### Fixed

- Updated `.gitignore` so documentation files remain tracked.
- Synced backend metadata (`app/main.py`, `pyproject.toml`) to advertise version `0.3.0`.

### Migration Guide

1. Update every client (CLI scripts, integrations, tests, dashboards) to call `/api/v1/...` routes.
2. Verify health checks hit `/api/v1/health` instead of `/`.
3. Deploy backend v0.3.0 and watch logs for `404` responses on `/auth` or `/users`—they indicate straggling callers that still need to migrate.

## [0.2.0] - 2025-10-?? *(previous release)*

### Added

- Introduced `/api/v1` routers alongside temporary redirects from `/auth/*` and `/users/*`.
- Documented the deprecation timeline for legacy routes.

> Dates for prior releases can be filled in once the historical timeline is reconstructed.


