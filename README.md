# Linkly

URL shortener (pet project).

**Stack:** React + TypeScript + Vite · PHP 8 REST API · SQLite

## Features

- shorten URLs
- optional custom short codes
- click counter
- redirect endpoint `/api/r/{code}`

## Run

```bash
# API
cd api
php -S 127.0.0.1:8081 router.php

# Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5176
