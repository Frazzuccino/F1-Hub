@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8765
  py -m http.server 8765
  exit /b
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:8765
  python -m http.server 8765
  exit /b
)
echo Python is not installed. Opening index.html directly instead.
echo For the installable Android/PWA version, use the GitHub Pages steps in SETUP.md.
start "" index.html
pause
