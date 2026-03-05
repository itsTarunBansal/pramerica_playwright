@echo off
echo ========================================
echo Starting AI Insurance Test Copilot
echo ========================================
echo.

echo [1/4] Checking MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo MongoDB is running
) else (
    echo Starting MongoDB...
    net start MongoDB
)
echo.

echo [2/4] Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm start"
timeout /t 3 >nul
echo.

echo [3/4] Starting Frontend...
cd ..\frontend
start "Frontend Dev Server" cmd /k "npm run dev"
echo.

echo [4/4] Done!
echo.
echo ========================================
echo Applications Started:
echo ========================================
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo Field Manager: http://localhost:5173/field-manager
echo ========================================
echo.
echo Press any key to exit...
pause >nul
