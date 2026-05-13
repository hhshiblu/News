#!/bin/sh
set -e
# Create tables from schema when no migrations are shipped (image-only deploy).
if [ -z "${SKIP_DB_PUSH:-}" ]; then
  echo "[entrypoint] prisma db push (sync schema)..."
  npx prisma db push --skip-generate
fi
exec "$@"
