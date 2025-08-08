# PowerShell скрипт для запуска Crypto Dice MVP

Write-Host "🎲 Запуск Crypto Dice MVP в режиме разработки..." -ForegroundColor Green

# Проверяем наличие Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js версия: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден. Установите Node.js 18+" -ForegroundColor Red
    exit 1
}

# Проверяем версию Node.js
$majorVersion = (node --version).Split('v')[1].Split('.')[0]
if ([int]$majorVersion -lt 18) {
    Write-Host "❌ Требуется Node.js 18+. Текущая версия: $(node --version)" -ForegroundColor Red
    exit 1
}

# Устанавливаем зависимости если нужно
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
    npm run install:all
}

# Создаем .env файлы если их нет
if (-not (Test-Path "bot/.env")) {
    Write-Host "📝 Создание bot/.env..." -ForegroundColor Yellow
    Copy-Item "bot/env.example" "bot/.env"
}

if (-not (Test-Path "backend/.env")) {
    Write-Host "📝 Создание backend/.env..." -ForegroundColor Yellow
    Copy-Item "backend/env.example" "backend/.env"
}

if (-not (Test-Path "frontend/.env")) {
    Write-Host "📝 Создание frontend/.env..." -ForegroundColor Yellow
    Copy-Item "frontend/env.example" "frontend/.env"
}

Write-Host "🚀 Запуск всех сервисов..." -ForegroundColor Green
Write-Host "📱 Bot: http://localhost:3000 (если не занят)" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Запускаем все сервисы
npm run dev
