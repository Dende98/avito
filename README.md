# Дельта

## Запуск с Docker Postgres

Docker Postgres поднимается на порту `5433`, чтобы не конфликтовать с обычным локальным PostgreSQL на `5432`.

```bash
docker compose up -d
```

Скопируйте настройки:

```bash
copy server\.env.docker.example server\.env
```

Установите зависимости и подготовьте базу:

```bash
cd server
npm i
npx prisma db push
npm run prisma:generate
npm run prisma:seed
npm run dev
```

Во втором терминале:

```bash
cd client
npm i
npm run dev
```

## Если PostgreSQL установлен локально

Можно не использовать Docker. Тогда в `server/.env` оставьте порт `5432` и свои логин/пароль:

```env
DATABASE_URL=postgresql://postgres:123@localhost:5432/arkhem
```

Docker Compose не мешает локальному PostgreSQL, потому что использует внешний порт `5433`.
