@echo off
setlocal enabledelayedexpansion

echo Installing dependencies with bun...
bun install
if errorlevel 1 exit /b %errorlevel%

echo Setting up the database with Docker Compose...
docker-compose up -d
if errorlevel 1 exit /b %errorlevel%

echo Waiting for the database to be ready...
:wait_for_db
docker-compose exec db pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    timeout /t 1 >nul
    goto wait_for_db
)

:ask_database_url
set /p answer=Did you set DATABASE_URL=postgres://postgres:postgres@localhost:5432/notables_dev? (y/n) 

if /i "%answer%"=="y" (
    echo Awesome, running migrate...
    goto :continue
) else if /i "%answer%"=="n" (
    echo Please set it first!
    exit /b 1
) else (
    echo Please answer y or n.
    goto ask_database_url
)

:continue

echo Running Drizzle migrations...
bun drizzle-kit migrate
if errorlevel 1 exit /b %errorlevel%

echo Setup complete!
