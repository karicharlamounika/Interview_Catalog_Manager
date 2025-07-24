@echo off
echo Setting up the frontend environment...
cd frontend
echo Installing frontend dependencies...
call npm install
echo Starting frontend.
call npm run dev