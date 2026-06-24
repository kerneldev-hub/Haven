#!/bin/bash
# Haven DB Backup — Turso to local SQL dump
# Usage: bash scripts/backup-db.sh

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/haven_backup_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "Starting Haven database backup..."

if [ -z "$DATABASE_URL" ] || [ -z "$DATABASE_AUTH_TOKEN" ]; then
  echo "ERROR: DATABASE_URL and DATABASE_AUTH_TOKEN must be set"
  exit 1
fi

# Pull remote Turso DB via turso CLI if available
if command -v turso &> /dev/null; then
  DB_NAME=$(echo "$DATABASE_URL" | sed 's|libsql://||' | cut -d'.' -f1)
  turso db shell "$DB_NAME" ".dump" > "$BACKUP_FILE"
  echo "Backup saved: $BACKUP_FILE"
else
  # Fallback: use local sqlite3 if local.db exists
  if [ -f "local.db" ]; then
    sqlite3 local.db .dump > "$BACKUP_FILE"
    echo "Local backup saved: $BACKUP_FILE"
  else
    echo "WARNING: Neither turso CLI nor local.db found. Install turso CLI: curl -sSfL https://get.tur.so/install.sh | bash"
    exit 1
  fi
fi

# Keep only last 30 backups
ls -t "$BACKUP_DIR"/haven_backup_*.sql | tail -n +31 | xargs -r rm 2>/dev/null || true
echo "Backup complete."
