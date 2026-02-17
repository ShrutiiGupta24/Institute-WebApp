@echo off
REM ===================================================================
REM Institute Management System - Complete Startup Script
REM ===================================================================

echo.
echo ===================================================================
echo   Institute Management System - Web Application
echo ===================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM ===================================================================
REM Backend Setup and Start
REM ===================================================================

echo ===================================================================
echo   STEP 1: Setting up Backend...
echo ===================================================================
echo.

cd backend

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies if needed
echo Checking Python dependencies...
pip install -q -r requirements.txt

REM Check if .env exists
if not exist ".env" (
    echo.
    echo [WARNING] .env file not found!
    echo Creating .env from example...
    if exist ".env.example" (
        copy .env.example .env
    ) else (
        echo SECRET_KEY=change-this-secret-key-in-production > .env
        echo DATABASE_URL=sqlite:///./institute.db >> .env
        echo ALLOWED_ORIGINS=http://localhost:3000 >> .env
    )
    echo Please edit backend\.env and set your SECRET_KEY
    echo.
)

echo.
echo [OK] Backend setup complete
echo Starting Backend Server on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

REM Start backend in a new window
start "Institute Backend - FastAPI" cmd /k "cd /d %CD% && venv\Scripts\activate && python main.py"

cd ..

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM ===================================================================
REM Frontend Setup and Start
REM ===================================================================

echo.
echo ===================================================================
echo   STEP 2: Setting up Frontend...
echo ===================================================================
echo.

cd coaching

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing npm dependencies (this may take a few minutes)...
    call npm install
) else (
    echo Checking for npm dependency updates...
    call npm install
)

echo.
echo [OK] Frontend setup complete
echo Starting Frontend Server on http://localhost:3000
echo.

REM Start frontend in a new window
start "Institute Frontend - React" cmd /k "cd /d %CD% && npm start"

cd ..

REM ===================================================================
REM Summary
REM ===================================================================

echo.
echo ===================================================================
echo   APPLICATION STARTED SUCCESSFULLY!
echo ===================================================================
echo.
echo   Frontend (React):     http://localhost:3000
echo   Backend API:          http://localhost:8000
echo   API Documentation:    http://localhost:8000/docs
echo.
echo   Default Admin Login:
echo   Email:    admin@institute.com
echo   Password: admin123
echo.
echo   To stop the servers:
echo   - Close the terminal windows, OR
echo   - Press Ctrl+C in each window
echo.
echo ===================================================================

REM Open browser automatically
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit this window...
pause >nul
