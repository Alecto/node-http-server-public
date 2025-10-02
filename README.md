# 🚀 Node.js Express Products Server

Express.js HTTP сервер з повними CRUD операціями для управління продуктами. Навчальний проект, що демонструє сучасні практики розробки RESTful API.

## ✨ Особливості

- 🎯 **RESTful API** з JSON відповідями
- 🌐 **Web Interface** з HTML сторінками
- ⚡ **Express.js 5.1.0** фреймворк
- 🎨 **EJS** template engine
- 🔄 **Повні CRUD операції** (Create, Read, Update, Delete)
- 📊 **HTTP статус коди** (200, 201, 400, 404, 409, 500)
- 🛡️ **Валідація даних** на всіх рівнях
- 📝 **Структуроване логування**
- 🏗️ **MVC архітектура**
- 🚦 **Method Override** для PUT/DELETE через форми

## 📁 Структура проекту

```
node-http-server/
├── docs/                   # 📚 Документація
│   ├── API.md             # API документація
│   ├── ARCHITECTURE.md    # Архітектура проекту
│   ├── DEPLOYMENT.md      # Розгортання
│   └── TESTING.md         # Тестування
├── src/data/              # 📦 Початкові дані (fixtures)
│   └── products.mjs       # Початковий список продуктів
├── src/                   # 💻 Код програми
│   ├── config/            # ⚙️ Конфігурація
│   ├── controllers/       # 🎮 Контролери (бізнес логіка)
│   ├── middleware/        # 🛡️ Middleware і валідація
│   ├── models/           # 📊 Моделі даних
│   ├── routes/           # 🛣️ Маршрутизація (api + web)
│   ├── utils/            # 🛠️ Утиліти
│   ├── views/            # 👁️ EJS шаблони
│   └── server.mjs        # 🖥️ Express сервер (експортує app/start/stop)
├── tests/                # 🧪 Автотести (node:test + supertest)
├── .env.example          # 🔐 Приклад змінних середовища
├── index.mjs             # 🚪 Точка входу
├── package.json          # 📦 Залежності та скрипти
└── README.md            # 📖 Основна документація
```

## 🚀 Швидкий старт

### Встановлення

```bash
# Клонувати репозиторій
git clone <repository-url>
cd node-http-server

# Встановити залежності
yarn install
# або npm install
```

### Запуск

```bash
# Режим розробки (з автоматичним перезавантаженням)
yarn dev

# Звичайний режим
yarn start

# Запустити тести (node:test + supertest)
yarn test
```

Сервер буде доступний на `http://localhost:3000`

## 📍 Основні ендпоінти

### 🌐 Web Interface (HTML)

- `GET /` - Головна сторінка
- `GET /products` - Список продуктів
- `GET /products/new` - Форма додавання
- `GET /products/:id` - Деталі продукту
- `GET /products/:id/edit` - Форма редагування

### 📱 JSON API

- `GET /api/products` - Отримати всі продукти
- `GET /api/products/:id` - Отримати продукт за ID
- `POST /api/products` - Створити новий продукт
- `PUT /api/products/:id` - Повністю оновити продукт
- `PATCH /api/products/:id` - Частково оновити продукт
- `DELETE /api/products/:id` - Видалити продукт

## 🛠️ Технології

- **Framework:** Express.js 5.1.0
- **Template Engine:** EJS
- **Method Override:** method-override
- **Body Parsing:** express.urlencoded, express.json
- **Logging:** Custom logger
- **Error Handling:** Global error handlers + Express middleware
- **Validation:** Custom middleware для API запитів
- **Testing:** Node test runner + Supertest

## 📚 Документація

Детальна документація знаходиться в папці `/docs`:

- 📋 [API Documentation](docs/API.md) - REST API ендпоінти
- 🏗️ [Architecture](docs/ARCHITECTURE.md) - Архітектура проекту
- 🚀 [Deployment](docs/DEPLOYMENT.md) - Розгортання в продакшн
- 🧪 [Testing](docs/TESTING.md) - Керівництво з тестування

## 📝 Навчальні матеріали

- 📚 [TASK.md](TASK.md) - Оригінальне завдання та вимоги до міграції

## 🤝 Для розробників

Цей проект створений для навчання та демонстрації:

- Express.js фреймворку
- RESTful API принципів
- MVC архітектури
- CRUD операцій
- HTTP протоколу
