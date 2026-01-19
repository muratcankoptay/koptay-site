# KOPTAY Admin Panel Starter
# Çift tıklayın ve admin paneli otomatik açılsın!

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KOPTAY ADMIN PANEL BASLATIYOR..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Proje dizinine git
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# Port kontrolü fonksiyonu
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Önceden çalışan servisleri kontrol et
Write-Host "[KONTROL] Portlar kontrol ediliyor..." -ForegroundColor Gray

$alreadyRunning = @()
if (Test-Port -Port 3003) { $alreadyRunning += "Analytics (3003)" }
if (Test-Port -Port 3002) { $alreadyRunning += "Admin API (3002)" }
if (Test-Port -Port 3001) { $alreadyRunning += "Vite (3001)" }

if ($alreadyRunning.Count -gt 0) {
    Write-Host "  ✓ Zaten çalışıyor: $($alreadyRunning -join ', ')" -ForegroundColor Green
    Write-Host ""
    Write-Host "Tarayıcı açılıyor..." -ForegroundColor Cyan
    Start-Process "http://localhost:3001/admin/login"
    Start-Sleep -Seconds 2
    exit
}

Write-Host ""

# Analytics Server Başlat
Write-Host "[1/3] Analytics Server başlatılıyor..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; node analytics-server.js" -WindowStyle Minimized

# Admin Server Başlat
Write-Host "[2/3] Admin Server başlatılıyor..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; node admin-server.js" -WindowStyle Minimized

# Vite Dev Server Başlat
Write-Host "[3/3] Vite Dev Server başlatılıyor..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectPath'; npm run dev" -WindowStyle Minimized

# Tarayıcıyı hemen aç (sunucular arka planda hazırlanırken)
Write-Host ""
Write-Host "Tarayıcı açılıyor..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
Start-Process "http://localhost:3001/admin/login"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ADMIN PANEL BAŞLATILIYOR!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Admin Panel:  " -NoNewline; Write-Host "http://localhost:3001/admin" -ForegroundColor Cyan
Write-Host "Analytics:    " -NoNewline; Write-Host "http://localhost:3003" -ForegroundColor Cyan
Write-Host "API Server:   " -NoNewline; Write-Host "http://localhost:3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sunucular arka planda hazırlanıyor..." -ForegroundColor Gray
Write-Host "Tarayıcıda yükleme bitene kadar bekleyin." -ForegroundColor Gray
Write-Host ""

# 5 saniye bekle ve pencereyi kapat
Start-Sleep -Seconds 5
