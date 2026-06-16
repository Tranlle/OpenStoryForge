@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "DESKTOP_DIR=%ROOT_DIR%web\desktop"

if not exist "%DESKTOP_DIR%\package.json" (
    echo Cannot find web\desktop\package.json.
    exit /b 1
)

cd /d "%DESKTOP_DIR%"

if not exist "node_modules" (
    echo Installing desktop dependencies...
    call npm install
    if errorlevel 1 exit /b %errorlevel%
)

echo Starting OpenStoryForge Electron frontend. Backend integration is disabled for now.
set "OSF_BACKEND_DISABLED=1"
set "VITE_OPENSTORYFORGE_BACKEND_DISABLED=true"
call npm run dev

endlocal
