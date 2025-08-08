# 🚀 Быстрый старт Crypto Dice MVP

## Для Windows (PowerShell)

```powershell
# Запустите PowerShell от имени администратора и выполните:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start-dev.ps1
```

## Для Linux/Mac (Bash)

```bash
# Сделайте скрипт исполняемым и запустите:
chmod +x start-dev.sh
./start-dev.sh
```

## Ручной запуск

Если скрипты не работают, выполните вручную:

```bash
# 1. Установите зависимости
npm run install:all

# 2. Скопируйте .env файлы
cp bot/env.example bot/.env
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# 3. Запустите все сервисы
npm run dev
```

## Настройка Telegram Bot

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newapp`
3. Выберите вашего бота
4. Укажите:
   - **App Title:** Crypto Dice
   - **Short Description:** Игра в кости на TON тестнете
   - **Web App URL:** `http://localhost:3000`

## Тестирование

1. Откройте бота в Telegram
2. Отправьте `/start`
3. Нажмите "🎲 Играть в кости"
4. Играйте!

## Порты

- **Bot:** 3000 (если не занят)
- **Backend:** 3001
- **Frontend:** 3000

## Устранение проблем

### Ошибка "Node.js не найден"
Установите Node.js 18+ с [официального сайта](https://nodejs.org/)

### Ошибка "Порт занят"
Измените порты в .env файлах или остановите другие сервисы

### Ошибка "Модуль не найден"
Выполните `npm run install:all` заново

### Бот не отвечает
Проверьте, что токен в `bot/.env` правильный

## Следующие шаги

После успешного локального запуска:

1. **Деплой на продакшен:**
   - Backend → Render
   - Frontend → Vercel
   - Bot → тот же сервер что и backend

2. **Обновите URL в BotFather:**
   - Замените `http://localhost:3000` на ваш продакшен URL

3. **Настройте мониторинг:**
   - Логи
   - Метрики
   - Алерты

---

**Готово!** 🎉 Ваш Crypto Dice MVP запущен и готов к использованию.
