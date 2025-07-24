@echo off
echo Setting up the frontend environment...
cd frontend
echo Installing frontend dependencies...
call npm install

echo Starting frontend.
start "" npm run start-frontend

cd ..

setlocal enabledelayedexpansion
set RETRIES=5
set WAIT=2

for /L %%i in (1,1,%RETRIES%) do (
    powershell -Command "try {Invoke-WebRequest -Uri 'http://localhost:5173/login' -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0} catch {exit 1}"
    if !errorlevel! == 0 (
        echo Frontend is running!
        exit /b 0
    ) else (
        echo Frontend not ready yet. Retrying in %WAIT% seconds...
        timeout /t %WAIT% >nul
    )
)
echo Frontend did not start in time.
exit /b 1