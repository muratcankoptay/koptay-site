# KOPTAY Sunucularını Kapat
Write-Host "========================================" -ForegroundColor Red
Write-Host "  TÜM SUNUCULAR KAPATILIYOR..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Node.js processlerini bul ve kapat
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "Node.js processleri kapatılıyor..." -ForegroundColor Cyan
    $nodeProcesses | ForEach-Object {
        Write-Host "  ○ PID $($_.Id) kapatılıyor..." -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force
    }
    Write-Host "  ✓ Tüm Node.js processleri kapatıldı" -ForegroundColor Green
} else {
    Write-Host "  ○ Aktif Node.js processi bulunamadı" -ForegroundColor Yellow
}

Write-Host ""

# npm processlerini kapat
$npmProcesses = Get-Process -Name "npm" -ErrorAction SilentlyContinue
if ($npmProcesses) {
    Write-Host "npm processleri kapatılıyor..." -ForegroundColor Cyan
    $npmProcesses | Stop-Process -Force
    Write-Host "  ✓ npm processleri kapatıldı" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  TÜM SUNUCULAR KAPATILDI!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Port 3002, 3003 ve 5173 serbest bırakıldı." -ForegroundColor Gray
Write-Host ""

Start-Sleep -Seconds 3
