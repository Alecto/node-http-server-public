# 🏗️ Architecture Documentation

## Project Structure

```
node-http-server/
├── docs/                   # Документація
│   ├── API.md             # API документація
│   ├── ARCHITECTURE.md    # Архітектура
│   └── DEPLOYMENT.md      # Розгортання
├── src/                   # Код програми
│   ├── config/            # Конфігурація
│   │   ├── http.mjs      # HTTP константи
│   │   └── index.mjs     # Основна конфігурація
│   ├── controllers/       # Контролери (бізнес логіка)
│   │   ├── pageController.mjs     # HTML сторінки
│   │   └── productController.mjs  # CRUD операції
│   ├── middleware/        # Middleware функції
│   │   └── errorHandlers.mjs     # Обробка помилок
│   ├── models/           # Моделі даних
│   │   └── products.mjs  # Модель продуктів
│   ├── routes/           # Маршрутизація
│   │   └── router.mjs    # Express routes
│   ├── utils/            # Утиліти
│   │   └── logger.mjs    # Логування
│   ├── views/            # EJS шаблони
│   │   ├── 404.ejs
│   │   ├── index.ejs
│   │   ├── navigation.ejs
│   │   ├── product-detail.ejs
│   │   ├── product-form.ejs
│   │   ├── products.ejs
│   │   └── styles.ejs
│   └── server.mjs        # Express сервер
├── index.mjs             # Точка входу
├── package.json          # Залежності
└── README.md            # Основна документація
```

## Architecture Pattern: MVC

### Model (Моделі)

- `products.mjs` - управління даними продуктів
- Валідація даних
- CRUD операції над масивом

### View (Представлення)

- EJS шаблони для HTML сторінок
- JSON відповіді для API
- Стилізація через embedded CSS

### Controller (Контролери)

- `productController.mjs` - логіка роботи з продуктами
- `pageController.mjs` - відображення статичних сторінок
- Обробка HTTP запитів та відповідей

## Data Flow

```
HTTP Request → Express Router → Controller → Model → Controller → HTTP Response
```

1. **Request** - клієнт надсилає HTTP запит
2. **Router** - Express маршрутизатор направляє запит до контролера
3. **Controller** - обробляє запит, викликає моделі
4. **Model** - виконує операції з даними
5. **Response** - контролер формує і надсилає відповідь

## Technology Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.1.0
- **Template Engine:** EJS
- **HTTP Methods:** GET, POST, PUT, DELETE (method-override)
- **Data Storage:** In-memory array (for learning)
- **Logging:** Custom logger utility
- **Error Handling:** Global error handlers

## Design Principles

1. **Separation of Concerns** - кожен модуль має одну відповідальність
2. **DRY (Don't Repeat Yourself)** - уникнення дублювання коду
3. **RESTful API** - стандартні HTTP методи та статус коди
4. **Error Handling** - централізована обробка помилок
5. **Modularity** - код розділений на логічні модулі
