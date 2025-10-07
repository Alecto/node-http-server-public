# 🚀 Node.js Express Products Server

Express.js HTTP сервер з повними CRUD операціями для управління продуктами. Дані зберігаються в MongoDB (Atlas або локальна інстанція) через Mongoose, а HTML інтерфейс побудований на EJS.

## ✨ Особливості

- 🎯 **RESTful API** (Mongoose + MongoDB Atlas)
- 🌐 **Web Interface** (EJS шаблони)
- ⚡ **Express.js 5.1.0**
- 🔄 **CRUD** (Create/Read/Update/Delete) для продуктів
- 🔐 **Автентифікація** (Auth0 + JWT для API)
- 👤 **OAuth 2.0** (Google, GitHub)
- 🛡️ **Валідація**: middleware на рівні Express + Mongoose
- 📝 **Документація** в `docs/`

## 📦 Вимоги

- Node.js 18+
- MongoDB Atlas (рекомендовано) або локальна MongoDB
- Auth0 акаунт (для автентифікації)

## ⚙️ Конфігурація середовища

Створіть файл `.env` (або `.env.local`) на основі `env.example`:

```ini
# Сервер
APP_PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=atlas-products

# Auth0 (отримайте на auth0.com)
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=generate_random_secret_32_characters_min

# JWT
JWT_SECRET=another_random_secret_for_jwt_tokens
JWT_EXPIRES_IN=7d
```

> **Налаштування Auth0:** Детальні інструкції в [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)

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
├── scripts/
│   ├── checkServer.mjs   # інтеграційний прогін
│   └── seedProducts.mjs  # імпорт JSON у MongoDB
├── seeds/
│   └── products.json     # початкові дані
├── src/
│   ├── config/
│   ├── controllers/
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

### 🔐 Автентифікація

- `GET /auth/login` - Вхід через Auth0
- `GET /auth/logout` - Вихід
- `GET /auth/profile` - Профіль користувача 🔒
- `GET /auth/api/token` - Отримати JWT токен 🔒

### 🌐 HTML (публічний перегляд, редагування - тільки авторизовані)

- `GET /` - Головна сторінка
- `GET /products` - Список продуктів
- `GET /products/new` - Форма створення 🔒
- `GET /products/:id` - Деталі продукту
- `GET /products/:id/edit` - Форма редагування 🔒

### 🔌 API (CRUD операції вимагають JWT токен)

- `GET /api/products` - Список продуктів
- `GET /api/products/:id` - Отримати продукт
- `POST /api/products` - Створити продукт 🔒
- `PUT /api/products/:id` - Оновити продукт 🔒
- `PATCH /api/products/:id` - Частково оновити 🔒
- `DELETE /api/products/:id` - Видалити продукт 🔒

🔒 - вимагає автентифікації

## 📚 Документація

- [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) — 🔐 Автентифікація та JWT
- [docs/API.md](docs/API.md) — REST API + приклади cURL
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Архітектура проекту
- [docs/CONFIG.md](docs/CONFIG.md) — Конфігурація
- [docs/TESTING.md](docs/TESTING.md) — Тестування
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Розгортання

## 📝 Завдання

Подробиці міграції та додаткових етапів описані в [TASK.md](TASK.md).

## 🔐 Швидкий старт з автентифікацією

> **Детальні інструкції:** [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md)

```bash
# 1. Налаштуйте Auth0 (детальніше в docs/AUTH_SETUP.md)
# 2. Додайте Auth0 credentials в .env
# 3. Запустіть сервер
yarn dev

# 4. Відкрийте браузер
http://localhost:3000

# 5. Натисніть "Увійти" та оберіть провайдера (Google/GitHub)
# 6. Після входу можете створювати/редагувати продукти
```

### API з JWT токеном

```bash
# 1. Увійдіть через веб-інтерфейс
# 2. Отримайте JWT токен
curl http://localhost:3000/auth/api/token

# 3. Використовуйте токен для API запитів
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","price":99.99,"description":"Description"}'
```

## 🙏 Подяки

- [Mongoose](https://mongoosejs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Auth0](https://auth0.com/)
- [Express.js](https://expressjs.com/)

> Будь ласка, завжди перевіряйте змінні оточення перед запуском на продакшн.
