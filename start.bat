@echo off
REM GIFT Nifty NSE Market Intelligence Terminal - Windows Startup Script
REM React + JavaScript + Supabase Architecture

echo ====================================
echo GIFT Nifty NSE Market Intelligence Terminal
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env exists, if not copy from .env.example
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo.
    echo IMPORTANT: Please edit .env file with your Supabase credentials!
    echo 1. Go to https://supabase.com and create a new project
    echo 2. Run the SQL schema from supabase/schema.sql in your Supabase SQL editor
    echo 3. Copy your Supabase URL and anon key to .env
    echo.
    pause
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed.
cd ..
echo.

REM Start the frontend development server
echo Starting frontend development server...
start "GIFT Nifty Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ====================================
echo Frontend server started successfully!
echo ====================================
echo.
echo Frontend: http://localhost:5173
echo.
echo IMPORTANT: Make sure you have:
echo 1. Created a Supabase project at https://supabase.com
echo 2. Run the SQL schema from supabase/schema.sql
echo 3. Updated .env with your Supabase credentials
echo.
echo Press any key to stop the server...
pause >nul

REM Kill the server process
taskkill /FI "WINDOWTITLE eq GIFT Nifty Frontend*" /T >nul 2>&1

echo Server stopped.
pause
