# 🚀 Инструкция по деплою Crypto Dice MVP

## Проблема с 404: NOT_FOUND

Если вы видите ошибку `404: NOT_FOUND` и `DEPLOYMENT_NOT_FOUND`, это означает, что:
- Используется превью-деплой Vercel вместо стабильного URL
- Vercel удалил превью-деплой
- Нужен стабильный HTTPS URL

## Шаг 1: Деплой Backend на Render

### 1.1 Подготовка
1. Создайте аккаунт на [Render.com](https://render.com)
2. Подключите ваш GitHub репозиторий

### 1.2 Создание сервиса
1. В Render Dashboard → "New" → "Web Service"
2. Выберите ваш репозиторий
3. Настройте:
   - **Name**: `crypto-dice-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 1.3 Environment Variables
Добавьте в Render:
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-project.vercel.app
DB_PATH=./data/crypto_dice.db
BOT_TOKEN=8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y
```

### 1.4 Получите URL
После деплоя получите URL: `https://your-backend.onrender.com`

## Шаг 2: Деплой Frontend на Vercel

### 2.1 Подготовка
1. Создайте аккаунт на [Vercel.com](https://vercel.com)
2. Подключите ваш GitHub репозиторий

### 2.2 Создание проекта
1. В Vercel Dashboard → "New Project"
2. Выберите ваш репозиторий
3. Настройте:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.3 Environment Variables
Добавьте в Vercel:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

### 2.4 Получите стабильный URL
После деплоя получите URL: `https://your-project.vercel.app`

## Шаг 3: Обновите конфигурацию

### 3.1 Обновите bot/.env
```env
BOT_TOKEN=8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y
BACKEND_URL=https://your-backend.onrender.com
WEBAPP_URL=https://your-project.vercel.app
```

### 3.2 Обновите backend/.env
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=https://your-project.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DB_PATH=./data/crypto_dice.db
BOT_TOKEN=8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y
```

### 3.3 Обновите frontend/.env
```env
BACKEND_URL=https://your-backend.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

## Шаг 4: Проверьте деплой

### 4.1 Проверьте Backend
```bash
curl -I https://your-backend.onrender.com/health
```
Должен вернуть `HTTP/1.1 200 OK`

### 4.2 Проверьте Frontend
```bash
curl -I https://your-project.vercel.app
```
Должен вернуть `HTTP/1.1 200 OK`

## Шаг 5: Настройте бота

### 5.1 Через BotFather
1. Найдите @BotFather в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Выберите "Bot Settings" → "Menu Button"
5. Установите URL: `https://your-project.vercel.app`

### 5.2 Или через код
Обновите `bot/src/index.ts`:
```typescript
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-project.vercel.app';
```

## Шаг 6: Перезапустите бота

### 6.1 Перезапустите локальный бот
```bash
npm run dev:bot
```

### 6.2 Или деплойте бота на сервер
```bash
npm run build:bot
npm run start:bot
```

## Важные моменты

### ✅ HTTPS обязателен
- Никаких `http://` в продакшене
- Только `https://` для Telegram WebApp

### ✅ Стабильный URL
- Используйте `https://your-project.vercel.app`
- НЕ используйте превью-деплой `https://project-git-main-username.vercel.app`

### ✅ Проверьте DNS
- Если используете свой домен, проверьте CNAME
- Подождите 5-30 минут для обновления DNS

### ✅ Очистите кеш Telegram
- Отправьте `/start` после обновления URL
- Или измените текст кнопки на секунду и верните обратно

## Устранение неполадок

### Проблема: 404 на Vercel
**Решение:**
1. Проверьте, что деплой завершился успешно
2. Убедитесь, что используется стабильный URL, а не превью
3. Проверьте, что есть страница `/` в Next.js

### Проблема: CORS ошибки
**Решение:**
1. Проверьте `CORS_ORIGIN` в backend
2. Убедитесь, что URL точно совпадает

### Проблема: Бот не открывает WebApp
**Решение:**
1. Проверьте HTTPS URL
2. Убедитесь, что домен добавлен в Vercel
3. Подождите обновления DNS

## Проверка работоспособности

После всех настроек:
1. Отправьте `/start` боту
2. Нажмите "🎲 Играть в кости"
3. WebApp должен открыться без ошибок
4. Попробуйте сыграть в кости

Если всё работает - поздравляем! 🎉
