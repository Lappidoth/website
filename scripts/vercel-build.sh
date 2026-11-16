#!/bin/sh
# Runs on every Vercel deployment (see "vercel-build" in package.json).
# Only the live site may change the live database: preview builds of other
# branches skip the migration and product refresh.
set -e
if [ "$VERCEL_ENV" = "production" ]; then
  npx prisma migrate deploy
  npx prisma db seed
else
  echo "Not a production deployment — leaving the database untouched."
fi
npx next build
