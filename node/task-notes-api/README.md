# Task Notes API

Production-ready Task Notes API built with Node.js, Express, PostgreSQL, JWT auth, Prometheus metrics, Docker, and CI.

## Features

- JWT auth with 15 minute access token
- Refresh token endpoint
- Role-based authorization (`user`, `admin`)
- Owner/admin checks on task routes
- PostgreSQL persistence for users and tasks
- Repository layer with parameterized SQL
- RFC 7807 Problem Details errors
- Cursor and offset-based pagination
- OpenAPI 3.0 specification
- External API integrations with resilience patterns (Timeout/Retry/Backoff)
- `healthz`, `readyz`, `health / db`, `metrics`
- Prometheus-compatible metrics
- Docker multi-stage build
- ESLint, Prettier, Vitest, GitHub Actions

## Required environment variables

Copy `.env.example` to `.env` and update values:

- `NODE_ENV`
- `PORT`
- `LOG_LEVEL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `DATABASE_URL`
- `CORS_ORIGIN`

Example:

```env
NODE_ENV = development
PORT = 3000
LOG_LEVEL = info
JWT_SECRET = change - me - access
JWT_REFRESH_SECRET = change - me - refresh
DATABASE_URL = postgres://postgres:postgres@localhost:5432/taskapp_dev
CORS_ORIGIN = http://localhost:3000
```

## Install

```bash
pnpm install
```
