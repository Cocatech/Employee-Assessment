@echo off
REM TRTH Employee Assessment - Docker Management Script

echo ========================================
echo TRTH Employee Assessment - Docker Setup
echo ========================================
echo.

:menu
echo Please select an option:
echo.
echo 1. Start All Services (First Time Setup)
echo 2. Start Services (Quick Start)
echo 3. Stop All Services
echo 4. View Logs
echo 5. Restart Services
echo 6. Clean All (Remove containers and volumes)
echo 7. Database Shell (psql)
echo 8. Run Prisma Migration
echo 9. Prisma Studio (Database GUI)
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="1" goto first_setup
if "%choice%"=="2" goto quick_start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto restart
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto db_shell
if "%choice%"=="8" goto migrate
if "%choice%"=="9" goto studio
if "%choice%"=="0" goto end

echo Invalid choice. Please try again.
goto menu

:first_setup
echo.
echo Starting First Time Setup...
echo This will:
echo - Pull Docker images
echo - Create database
echo - Run migrations
echo - Start all services
echo.
docker-compose up -d --build
echo.
echo Waiting for database to be ready...
timeout /t 10
echo.
echo Running Prisma migrations...
docker-compose exec app npx prisma migrate deploy
echo.
echo Setup complete!
echo.
echo Access points:
echo - Application: http://localhost:3000
echo - pgAdmin: http://localhost:5050 (admin@trth.local / admin)
echo - Database: localhost:5432
echo.
pause
goto menu

:quick_start
echo.
echo Starting services...
docker-compose up -d
echo.
echo Services started!
echo - Application: http://localhost:3000
echo - pgAdmin: http://localhost:5050
echo.
pause
goto menu

:stop
echo.
echo Stopping all services...
docker-compose down
echo Services stopped.
echo.
pause
goto menu

:logs
echo.
echo Showing logs (Ctrl+C to exit)...
docker-compose logs -f
goto menu

:restart
echo.
echo Restarting services...
docker-compose restart
echo Services restarted.
echo.
pause
goto menu

:clean
echo.
echo WARNING: This will remove all containers, volumes, and data!
set /p confirm="Are you sure? (yes/no): "
if not "%confirm%"=="yes" goto menu
echo.
echo Cleaning up...
docker-compose down -v
docker-compose rm -f
echo Cleanup complete.
echo.
pause
goto menu

:db_shell
echo.
echo Opening database shell...
echo (Type \q to exit)
docker exec -it trth-postgres psql -U postgres -d trth_assessment
pause
goto menu

:migrate
echo.
echo Running Prisma migration...
docker-compose exec app npx prisma migrate dev
echo Migration complete.
echo.
pause
goto menu

:studio
echo.
echo Starting Prisma Studio...
echo Opening http://localhost:5555
start http://localhost:5555
docker-compose exec app npx prisma studio
goto menu

:end
echo.
echo Goodbye!
exit
