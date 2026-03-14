- /healthz (Liveness): Is the Node event loop frozen? If down, Docker restarts container.
- /readyz (Readiness): Is the DB connected? If down, load balancer stops sending traffic.

## Required Env Vars

`DATABASE_URL` - Postgres connection string
