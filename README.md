# GREEN-API Telegram Chat

Веб-чат на React для отправки и приёма текстовых сообщений через [GREEN-API Telegram API](https://green-api.com/en/telegram/docs/api/sending/SendMessage/).

Тестовое задание: Frontend React Developer (мессенджер — **Telegram**, не MAX).

## Возможности

1. Вход по `idInstance` и `apiTokenInstance`
2. Старт чата по номеру телефона собеседника
3. Отправка текстовых сообщений (`SendMessage`)
4. Приём ответов через long-polling (`ReceiveNotification` + `DeleteNotification`)

## Стек

- Vite + React + TypeScript
- Прокси `/green-api` → `https://api.green-api.com` (обход CORS в dev)

## Локальный запуск

```bash
cd green-api-telegram-chat
npm install
npm run dev
```

Откройте адрес из терминала (обычно `http://localhost:5173`).

Сборка production:

```bash
npm run build
npm run preview
```

## Demo (GitHub Pages)

После пуша в `main` GitHub Actions публикует сборку на:

**https://batyrbekwebdev.github.io/green-api-telegram-chat/**

Локально Vite проксирует `/green-api` (обход CORS). На Pages запросы идут напрямую на `https://api.green-api.com`.

## Настройка GREEN-API (Telegram)

1. Зарегистрируйтесь в [кабинете GREEN-API](https://green-api.com/)
2. Создайте / выберите инстанс для **Telegram**
3. Авторизуйте инстанс (подключите Telegram-аккаунт по инструкции кабинета)
4. Скопируйте `idInstance` и `apiTokenInstance`
5. В настройках инстанса оставьте **`webhookUrl` пустым** — иначе метод `receiveNotification` не работает
6. Включите получение уведомлений о входящих сообщениях

Документация:

- [SendMessage](https://green-api.com/en/telegram/docs/api/sending/SendMessage/)
- [HTTP API receiving](https://green-api.com/en/telegram/docs/api/receiving/technology-http-api/)
- [chatId](https://green-api.com/en/telegram/docs/api/chat-id/)

## Как проверить сценарий

1. Запустите приложение и войдите с credentials инстанса
2. Введите номер собеседника в международном формате без `+` (например `79001234567`)
3. Отправьте текстовое сообщение из веб-UI
4. Ответьте с телефона собеседника в Telegram
5. Ответ должен появиться в веб-чате

## Структура

```
src/
  api/greenApi.ts
  hooks/useMessagePolling.ts
  components/
    LoginForm.tsx
    NewChatForm.tsx
    ChatView.tsx
    MessageList.tsx
    MessageInput.tsx
  App.tsx
```
