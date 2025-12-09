@echo off
echo Starting Mock API Server...
cd /d "%~dp0"
npx json-server --watch mock/db.json --port 3001 --routes mock/routes.json
