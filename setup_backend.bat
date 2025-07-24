@echo off
echo Setting up the backend environment...
cd backend
echo Installing backend dependencies...
call npm install
echo Starting backend.
call npm run start-backend