# Linkly

Сокращатель ссылок + счётчик кликов.

**Стек:** PHP 8 REST + SQLite, React + TypeScript + Vite

## Функции

- сократить URL (рандомный или свой код)
- список ссылок, клики, удаление
- редирект `GET /api/r/{code}`

## Прокси

`frontend/vite.config.ts`:

```ts
proxy: { '/api': 'http://127.0.0.1:8080' }
```

`/api/*` → PHP на `:8080`.

## Запуск

```bash
# backend
cd api
php -S 127.0.0.1:8080 router.php

# frontend (второй терминал)
cd frontend
npm install
npm run dev
```

Открыть URL из вывода Vite (`Local:`), обычно `http://127.0.0.1:5173`.

## API

| Метод | Путь |
|-------|------|
| GET | `/api/links` |
| POST | `/api/links` |
| DELETE | `/api/links/{id}` |
| GET | `/api/r/{code}` |
