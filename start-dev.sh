#!/bin/bash

echo "🎲 Запуск Crypto Dice MVP в режиме разработки..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Установите Node.js 18+"
    exit 1
fi

# Проверяем версию Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Требуется Node.js 18+. Текущая версия: $(node -v)"
    exit 1
fi

echo "✅ Node.js версия: $(node -v)"

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm run install:all
fi

# Создаем .env файлы если их нет
if [ ! -f "bot/.env" ]; then
    echo "📝 Создание bot/.env..."
    cp bot/env.example bot/.env
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Создание backend/.env..."
    cp backend/env.example backend/.env
fi

if [ ! -f "frontend/.env" ]; then
    echo "📝 Создание frontend/.env..."
    cp frontend/env.example frontend/.env
fi

echo "🚀 Запуск всех сервисов..."
echo "📱 Bot: http://localhost:3000 (если не занят)"
echo "🔧 Backend: http://localhost:3001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Запускаем все сервисы
npm run dev
