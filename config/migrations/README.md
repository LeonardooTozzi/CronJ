# Database Migrations

This directory contains Knex.js migration files for the CronJ database schema.

## Available Migrations

1. **001_create_jobs_table.js** - Creates the `jobs` table
   - Stores scheduled job definitions
   - Fields: id, name, cron_expression, task_config, status, metadata, timestamps

2. **002_create_executions_table.js** - Creates the `executions` table
   - Stores job execution history
   - Fields: id, job_id (FK), status, timestamps, duration, result, error

3. **003_add_jobs_updated_at_trigger.js** - Adds auto-update trigger for `updated_at`
   - PostgreSQL only (SQLite handles this in application code)

## Running Migrations

### Run all pending migrations:
```bash
npm run migrate:latest
```

### Rollback last migration:
```bash
npm run migrate:rollback
```

### Check migration status:
```bash
npm run migrate:status
```

### Create a new migration:
```bash
npm run migrate:make migration_name
```

## Database Support

- **SQLite** (default): Uses TEXT for UUIDs and JSON fields
- **PostgreSQL**: Uses native UUID and JSONB types

The migrations are designed to work with both databases. When switching to PostgreSQL, update the `knexfile.js` connection settings.

## Schema Notes

- **UUIDs**: Stored as TEXT(36) in SQLite, UUID in PostgreSQL
- **JSON/JSONB**: Stored as TEXT in SQLite, JSONB in PostgreSQL
- **ENUMs**: Stored as TEXT with CHECK constraints in SQLite, native ENUM in PostgreSQL
- **Timestamps**: Uses database-specific functions (NOW() for PostgreSQL, current timestamp for SQLite)

