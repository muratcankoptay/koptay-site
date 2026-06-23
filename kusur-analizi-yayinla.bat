@echo off
chcp 65001 >nul
title Koptay Site - Kusur Analizi Sayfasini Yayinla
cd /d "%~dp0"

echo ============================================================
echo   Koptay Hukuk Sitesi - Yapay Zeka Kusur Analizi Yayini
echo ============================================================
echo.
echo Bu islem yeni Kusur Analizi sayfasini GitHub'a gonderir.
echo GitHub -^> Vercel otomatik deploy eder.
echo.

if exist ".git\index.lock" (
  echo [bilgi] Eski git kilidi siliniyor...
  del /f /q ".git\index.lock"
)

echo [1/3] Degisiklikler ekleniyor...
git add api/kusur-analizi.js
git add src/pages/KusurAnaliziPage.jsx
git add src/data/kusurSSS.js
git add src/App.jsx
git add src/pages/HesaplamaAraclariPage.jsx
git add scripts/prerender.js
git add public/generate-sitemap.js
git add index.html
git add src/components/CookieConsent.jsx
git add src/pages/KvkkPage.jsx
git add src/components/FloatingContact.jsx
git add kusur-analizi-yayinla.bat

echo.
echo [2/3] Eklenen dosyalar:
git status -s -- api/kusur-analizi.js src/pages/KusurAnaliziPage.jsx src/App.jsx src/pages/HesaplamaAraclariPage.jsx
echo.

echo [3/3] Commit ve push...
git commit -m "perf+seo: Microsoft Clarity kaldirildi (INP), kusur analizi sayfasi ic linkler ve soru-cevap"
if errorlevel 1 (
  echo [bilgi] Commit edilecek yeni degisiklik yok ya da bir sorun olustu.
)

git push origin main
if errorlevel 1 (
  echo.
  echo [HATA] Push basarisiz. GitHub girisinizi/erisiminizi kontrol edin.
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   TAMAM! GitHub'a gonderildi. Vercel 1-2 dakikada deploy eder.
echo.
echo   UNUTMAYIN: Vercel'de su ortam degiskenlerini ekleyin
echo   (Settings -^> Environment Variables):
echo     KUSURAI_API_URL = https://www.kusurtespiti.com.tr
echo     KUSURAI_API_KEY = (Railway'deki SITE_API_KEY ile ayni)
echo.
echo   Test: https://www.koptay.av.tr/hesaplama-araclari/yapay-zeka-kusur-analizi
echo ============================================================
echo.
pause
