Create backup rotation strategy (daily/weekly retention).
Backup Rotation Strategy:

1. Keep 7 daily backups
2. 4 weekly backups
3. 12 monthly backups.

Disaster Recovery Procedure:

1. Isolate compromised DB.
2. Provision new instance.
3. Run restore procedure using latest pg_dump artifact.

--- PRODUCTION DEPLOYMENT CHECKLIST ---

1. Run pre-flight checks (Tests, Linting).
2. Execute 'pg_dump' to create a pre-deployment backup.
3. Run migrations (Zero-Downtime Strategy: Add tables/columns first, never drop/rename columns in active use. Update app code, then drop deprecated columns in a later deployment).
4. Deploy application containers.
5. Monitor /admin/health/db and /admin/metrics for anomalies.

---
