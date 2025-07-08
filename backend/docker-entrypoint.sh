#!/bin/sh
# Run database migrations and seed data, then start the server
npx prisma migrate deploy
node scripts/seed.js
npm start
