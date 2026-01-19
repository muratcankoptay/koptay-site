@echo off
echo ========================================
echo   TUM SUNUCULARI KAPATILIYOR...
echo ========================================
echo.

echo Node.js processleri kapatiliyor...
taskkill /F /IM node.exe >nul 2>&1

echo npm processleri kapatiliyor...
taskkill /F /IM npm.cmd >nul 2>&1

echo.
echo ========================================
echo   TUM SUNUCULAR KAPATILDI!
echo ========================================
echo.
echo Port 3002, 3003 ve 5173 serbest birakildi.
echo.
pause
