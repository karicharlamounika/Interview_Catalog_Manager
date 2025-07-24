#!/usr/bin/env bash
set -e

echo "Setting up the backend environment..."
cd backend
echo "Installing backend dependencies..."
npm install
echo "Starting backend."
npm run start-backend