@echo off
echo ========================================
echo   KOPTAY ADMIN PANEL BASLATIYOR...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Analytics Server baslatiliyor...
start "Analytics Server" /MIN cmd /k "node analytics-server.js"

echo [2/3] Admin Server baslatiliyor...
start "Admin Server" /MIN cmd /k "node admin-server.js"

echo [3/3] Vite Dev Server baslatiliyor...
start "Vite Server" /MIN cmd /k "npm run dev"

echo.
echo Tarayici aciliyor...
timeout /t 1 /nobreak >nul
start http://localhost:3001/admin/login

echo.
echo ========================================
echo   ADMIN PANEL HAZIR!
echo ========================================
echo.
echo Admin Panel: http://localhost:3001/admin
echo Analytics: http://localhost:3003
echo API: http://localhost:3002
echo.
echo Sunucular ayri pencerelerde calisiyor.
echo Kapatmak icin her bir pencereyi kapatin.
echo.
pause
