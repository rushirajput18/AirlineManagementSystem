
@echo off
echo Starting all services...

REM Start Backend
echo Starting Backend...
start cmd /k "cd backend\ && mvn spring-boot:run"

REM Start Frontend
echo Starting Frontend...
start cmd /k "cd frontend\ && npm run dev"

REM Start Login Service
echo Starting Login Service...
start cmd /k "cd login\ && mvn spring-boot:run"

echo All services launched in separate terminals.
pause
