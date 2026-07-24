#!/bin/bash
# Post-merge setup: runs automatically after a task merge.
# Idempotent, non-interactive, fail-fast.
set -e

echo "→ Installing dependencies..."
npm install --no-audit --no-fund

# Sync database schema only if a database is configured (site is static in prod;
# the DB is only used by the dev/contact tooling when DATABASE_URL is present).
if [ -n "$DATABASE_URL" ]; then
  echo "→ Pushing database schema..."
  npx drizzle-kit push --force
else
  echo "→ DATABASE_URL not set — skipping db push"
fi

echo "✓ Post-merge setup done"
