# Linkly

Сокращатель ссылок: длинный URL → короткий код, счётчик кликов, редирект. Pet-project на React + PHP.

## Стек

| Слой | Технологии |
|------|------------|
| Backend | PHP 8, REST API, SQLite |
| Frontend | React, TypeScript, Vite |
| Хранение | SQLite в `api/storage/` |

## Что умеет

- сократить URL (случайный или свой код)
- список ссылок с числом кликов
- копирование короткой ссылки
- редирект `GET /api/r/{code}` с инкрементом кликов
- удаление ссылок

## Как устроен прокси

Vite проксирует `/api` на PHP:

```
браузер → http://127.0.0.1:5173/api/...
              ↓ (vite proxy)
         http://127.0.0.1:8080/api/...
```

Настройка в `frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8080' }
```

Backend поднимай на **порту 8080**.

Короткая ссылка в UI строится относительно текущего origin фронта, например  
`http://127.0.0.1:5173/api/r/abc123` — Vite проксирует её на PHP.

## Запуск

Нужны: PHP 8+, Node.js 18+.

**1. Backend** (из корня репозитория):

```bash
cd api
php -S 127.0.0.1:8080 router.php
```

API: `http://127.0.0.1:8080`

**2. Frontend** (второй терминал):

```bash
cd frontend
npm install
npm run dev
```

**3. Открыть в браузере**

URL из терминала Vite. Обычно:

```
http://127.0.0.1:5173/
```

Если `5173` занят — открой порт, который Vite напечатал в `Local:`.

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/links` | список |
| POST | `/api/links` | создать `{ url, code? }` |
| DELETE | `/api/links/{id}` | удалить |
| GET | `/api/r/{code}` | редирект + +1 клик |

## Структура

```
linkly/
  api/
    public/index.php
    router.php
    src/              # Database, LinkRepository
    storage/
  frontend/
```
