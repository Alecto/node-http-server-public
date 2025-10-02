# 🚀 Node.js Express Products Server

Express.js HTTP сервер з повними CRUD операціями для управління продуктами. Дані зберігаються в MongoDB (Atlas або локальна інстанція) через Mongoose, а HTML інтерфейс побудований на EJS.

## ✨ Особливості

- 🎯 **RESTful API** (Mongoose + MongoDB Atlas)
- 🌐 **Web Interface** (EJS шаблони)
- ⚡ **Express.js 5.1.0**
- 🔄 **CRUD** (Create/Read/Update/Delete) для продуктів
- 🛡️ **Валідація**: middleware на рівні Express + Mongoose
- 📝 **Документація** в `docs/`

## 📦 Вимоги

- Node.js 18+
- MongoDB Atlas (рекомендовано) або локальна MongoDB

## ⚙️ Конфігурація середовища

Створіть файл `.env` (або `.env.local`) на основі `env.example`:

```ini
MAIN_DB_ROOT_USER=root
MAIN_DB_ROOT_PASS=example
DB_NAME=mainDB
APP_PORT=3000
MONGO_PORT=27017
MONGODB_URI=mongodb://${MAIN_DB_ROOT_USER}:${MAIN_DB_ROOT_PASS}@mongo_main:${MONGO_PORT}/admin
DB_SEED=true
```

> Замість `mongo_main` вкажіть реальний хост Atlas (`cluster0.xxxxx.mongodb.net`). Для локальної БД використайте `mongodb://127.0.0.1:27017/`.

## 📁 Структура проєкту

```
node-http-server/
├── env.example           # Приклад налаштувань
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── CONFIG.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── src/
│   ├── config/           # dotenv + buildMongoConnectionString
│   ├── controllers/
│   ├── data/             # seed дані для MongoDB
│   ├── database/         # connect/disconnect helpers
│   ├── middleware/
│   ├── models/           # Mongoose схеми/моделі
│   ├── routes/           # api + web роутери (з .route())
│   ├── views/            # EJS шаблони
│   └── server.mjs        # startServer/stopServer
├── tests/                # node:test + supertest
├── package.json
└── README.md
```

## 🚀 Швидкий старт

```bash
# Клонувати репозиторій
git clone <repository-url>
cd node-http-server

# Встановити залежності
yarn install

# Заповнити .env (див. env.example)
```

```bash
# Запуск у dev-режимі (без сидування)
yarn dev

# Продакшн запуск
yarn start
```

## 🧪 Тестування

Тести очікують доступну MongoDB.

```bash
yarn test
```

Якщо тестової БД немає, раннер пропустить сценарії та виведе попередження.

## 📍 Основні ендпоінти

### HTML

- `GET /`
- `GET /products`
- `GET /products/new`
- `GET /products/:id`
- `GET /products/:id/edit`

### API

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

## 📚 Документація

- [docs/API.md](docs/API.md) — REST API + приклади cURL
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/CONFIG.md](docs/CONFIG.md)
- [docs/TESTING.md](docs/TESTING.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## 📝 Завдання

Подробиці міграції та додаткових етапів описані в [TASK.md](TASK.md).

## 🙏 Подяки

- [Mongoose](https://mongoosejs.com/)
- MongoDB Atlas

> Будь ласка, завжди перевіряйте змінні оточення перед запуском на продакшн.
