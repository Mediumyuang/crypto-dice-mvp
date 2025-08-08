# 🎲 Crypto Dice - Telegram Mini App MVP

Полный MVP для Telegram Mini App "Crypto Dice" с игрой в кости на TON тестнете.

## 📁 Структура проекта

```
crypto-dice-mvp/
├── bot/                 # Telegram бот (Telegraf)
├── backend/             # API сервер (Express + SQLite)
├── frontend/            # WebApp (Next.js + React)
├── package.json         # Корневой package.json для монополии
└── README.md           # Этот файл
```

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- npm или yarn
- Telegram Bot Token (уже настроен для быстрого старта)

### Локальная установка

1. **Клонируйте репозиторий и установите зависимости:**

```bash
git clone <your-repo>
cd crypto-dice-mvp
npm run install:all
```

2. **Запустите все сервисы в режиме разработки:**

```bash
npm run dev
```

Это запустит:
- Bot на порту 3000 (если не занят)
- Backend на порту 3001
- Frontend на порту 3000

3. **Настройте Telegram Bot:**

Откройте [@BotFather](https://t.me/BotFather) в Telegram и выполните:

```
/newapp
```

Выберите вашего бота и укажите:
- **App Title:** Crypto Dice
- **Short Description:** Игра в кости на TON тестнете
- **Web App URL:** `http://localhost:3000` (для разработки)

4. **Протестируйте приложение:**

Откройте бота в Telegram, отправьте `/start` и нажмите "🎲 Играть в кости".

## 🔧 Конфигурация

### Переменные окружения

#### Bot (`bot/env.example`)
```env
BOT_TOKEN=8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y
BACKEND_URL=https://your-backend.onrender.com
WEBAPP_URL=https://your-frontend.vercel.app
```

#### Backend (`backend/env.example`)
```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
DB_PATH=./data/crypto_dice.db
BOT_TOKEN=8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y
```

#### Frontend (`frontend/env.example`)
```env
BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## 📡 API Endpoints

### Backend API

#### `POST /register`
Регистрирует пользователя и создает TON кошелек.

**Request:**
```json
{
  "telegram_id": 123456789,
  "init_data": "optional_telegram_init_data"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "telegram_id": 123456789,
    "wallet_address": "EQ...",
    "balance": 10.0
  }
}
```

#### `GET /balance`
Получает баланс пользователя.

**Request:**
```
GET /balance?telegram_id=123456789
```

**Response:**
```json
{
  "success": true,
  "balance": 10.0,
  "wallet_address": "EQ..."
}
```

#### `POST /play`
Играет в кости.

**Request:**
```json
{
  "telegram_id": 123456789
}
```

**Response:**
```json
{
  "success": true,
  "roll": 5,
  "isWin": true,
  "winAmount": 2.0,
  "newBalance": 12.0,
  "message": "🎉 Победа! Выпало 5 (больше 3). Выигрыш: +2 TON"
}
```

#### `GET /history`
Получает историю игр.

**Request:**
```
GET /history?telegram_id=123456789
```

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "roll_result": 5,
      "bet_amount": 1.0,
      "win_amount": 2.0,
      "is_win": true,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### Примеры curl

```bash
# Регистрация пользователя
curl -X POST http://localhost:3001/register \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456789}'

# Получение баланса
curl "http://localhost:3001/balance?telegram_id=123456789"

# Игра в кости
curl -X POST http://localhost:3001/play \
  -H "Content-Type: application/json" \
  -d '{"telegram_id": 123456789}'

# История игр
curl "http://localhost:3001/history?telegram_id=123456789"
```

## 🚀 Деплой

### Backend (Render)

1. **Создайте аккаунт на [Render](https://render.com)**

2. **Подключите репозиторий**

3. **Создайте новый Web Service:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     PORT=10000
     CORS_ORIGIN=https://your-frontend.vercel.app
     DB_PATH=./data/crypto_dice.db
     BOT_TOKEN=8239590265:AAG0KqRXiv4h8ezDVXNZOVDBQ2nXPBDPH7Y
     ```

4. **Деплой автоматически запустится**

### Frontend (Vercel)

1. **Создайте аккаунт на [Vercel](https://vercel.com)**

2. **Подключите репозиторий**

3. **Настройте переменные окружения:**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   ```

4. **Деплой автоматически запустится**

### Bot

Бот может работать на том же сервере, что и backend, или отдельно:

1. **На том же сервере (рекомендуется):**
   - Добавьте в `render.yaml` или настройте отдельный процесс
   - Установите переменные окружения для бота

2. **Отдельно:**
   - Используйте Railway, Heroku или любой другой хостинг
   - Установите переменные окружения

### Обновление URL в BotFather

После деплоя обновите Web App URL в BotFather:

```
/setmenubutton
```

Выберите бота и укажите новый URL: `https://your-frontend.vercel.app`

## 🎮 Игровая механика

- **Ставка:** 1 TON (фиксированная)
- **Правила:** Бросаем кости (1-6)
  - Выпало 4-6: **Победа** (+2 TON)
  - Выпало 1-3: **Проигрыш** (-1 TON)
- **Начальный баланс:** 10 TON для новых пользователей
- **История:** Последние 10 игр

## 🔒 Безопасность

### Текущие меры (MVP):
- Rate limiting (100 запросов за 15 минут)
- Валидация входных данных
- CORS настройки

### TODO для продакшена:
- [ ] Верификация Telegram initData
- [ ] JWT токены
- [ ] Более строгие rate limits
- [ ] HTTPS только
- [ ] Валидация кошельков TON

## 🛠️ Разработка

### Скрипты

```bash
# Установка всех зависимостей
npm run install:all

# Разработка (все сервисы)
npm run dev

# Разработка отдельных сервисов
npm run dev:bot
npm run dev:backend
npm run dev:frontend

# Сборка
npm run build

# Продакшен
npm run start
```

### Структура кода

- **Bot:** TypeScript + Telegraf
- **Backend:** TypeScript + Express + SQLite
- **Frontend:** TypeScript + Next.js + Tailwind CSS

### База данных

SQLite с таблицами:
- `users` - пользователи и балансы
- `game_history` - история игр

## 📱 Telegram WebApp

Приложение оптимизировано для Telegram WebApp:
- Адаптивный дизайн
- Темная тема
- Анимации костей
- Интеграция с Telegram API

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Commit изменения
4. Push в branch
5. Создайте Pull Request

## 📄 Лицензия

MIT License

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:
1. Проверьте логи серверов
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что бот добавлен в BotFather
4. Создайте issue в репозитории

---

**Примечание:** Это MVP версия. Для продакшена рекомендуется добавить дополнительные меры безопасности и оптимизации.
