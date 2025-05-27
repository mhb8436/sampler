#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

# Run database migrations
echo "Running database migrations..."
npx prisma db push

# Start the application with PM2
echo "Starting the application..."
exec pm2-runtime ecosystem.config.js 