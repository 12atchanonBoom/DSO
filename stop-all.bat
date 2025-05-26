@echo off
echo Killing all Vispectra-related processes...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM ng.cmd /T >nul 2>&1
taskkill /F /IM uvicorn.exe /T >nul 2>&1
echo All processes terminated.
pause
