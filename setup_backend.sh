#!/usr/bin/env bash
set -e

echo "Setting up the backend environment..."
cd backend || exit 1
echo "Installing backend dependencies..."
npm install
echo "Starting backend."
nohup npm run start-backend > backend.log 2>&1 &