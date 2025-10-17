# 🏗️ Architecture Documentation

## Project Structure (mongoose-migration)

```
node-http-server/
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── CONFIG.md
│   ├── DEPLOYMENT.md
│   ├── MIGRATION.md
│   └── TESTING.md
├── scripts/
│   ├── checkServer.mjs          # Інтеграційний прогін без ручних кроків
│   └── seedProducts.mjs         # Імпорт початкових даних у MongoDB
├── seeds/
│   └── products.json            # Джерело первинних продуктів
├── src/
│   ├── config/
│   │   ├── http.mjs
│   │   └── index.mjs
│   ├── controllers/
│   │   ├── pageController.mjs
│   │   └── productController.mjs
│   ├── database/
│   │   └── connection.mjs       # Підключення Mongoose + життєвий цикл
│   ├── middleware/
│   │   ├── errorHandlers.mjs
│   │   └── validation.mjs
│   ├── models/
│   │   └── products.mjs         # Mongoose схема та індекси
│   ├── routes/
│   │   ├── api/
│   │   │   ├── index.mjs
│   │   │   └── products.mjs
│   │   └── web/
│   │       ├── index.mjs
│   │       ├── pages.mjs
│   │       └── products.mjs
│   ├── utils/
│   │   └── logger.mjs
│   ├── views/
│   │   ├── partials/
│   │   │   ├── auth-sidebar.ejs
│   │   │   ├── head.ejs
│   │   │   ├── navigation.ejs
│   │   │   └── styles.ejs
│   │   ├── pages/
│   │   │   └── index.ejs
│   │   ├── products/
│   │   │   ├── detail.ejs
│   │   │   ├── form.ejs
│   │   │   └── list.ejs
│   │   ├── auth/
│   │   │   ├── disabled.ejs
│   │   │   └── profile.ejs
│   │   └── errors/
│   │       ├── 404.ejs
│   │       └── 500.ejs
│   └── server.mjs
├── tests/
│   └── runTests.mjs
├── env.example
├── index.mjs
├── package.json
└── README.md
```

## Architecture Pattern: Express + Mongoose MVC

### Model (Mongoose)

- `src/models/products.mjs` — Mongoose `Schema` + `model`
  - Валідація полів на рівні схеми
  - Унікальний індекс `name` із колацією для case-insensitive пошуку
  - Вторинний індекс `createdAt` для сортування
  - Трансформація `toJSON` для повернення `id` та приховування `_id`
- Вся робота з колекцією відбувається через Mongoose, без прямих звернень до драйвера

### View (EJS + JSON)

- EJS шаблони для HTML інтерфейсу (сторінки списку, деталей, форм, 404/500)
- JSON відповіді з `ProductModel` (`lean()` для читань) для REST API

### Controller

- `productController.mjs`
  - REST методи використовують `ProductModel`/`lean()`/`runValidators`
  - HTML методи також працюють через Mongoose, без in-memory стану
- `pageController.mjs` — статичні сторінки

## Data Flow

```
HTTP Request → Express Router → Controller → Mongoose Model → MongoDB Atlas
                                   ↑
                                   └── Validation middleware (API/Web)
```

1. **Request** — клієнт надсилає HTTP запит
2. **Router** — Express маршрутизатор спрямовує до контролера (API або Web)
3. **Validation** — middleware перевіряє payload, ObjectId тощо
4. **Controller** — викликає методи Mongoose моделі
5. **Model** — взаємодіє з MongoDB (CRUD, індекси)
6. **Response** — контролер формує JSON або HTML відповідь

## Technology Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **ODM:** Mongoose 8
- **Database:** MongoDB Atlas (або локальна MongoDB)
- **Template Engine:** EJS
- **Testing:** `node:test` + Supertest + живе підключення до тестової БД

## Key Design Principles

1. **Single Source of Truth** — всі дані зберігаються в MongoDB, seed виконується окремим скриптом
2. **Config Driven** — `src/config/index.mjs` формує URI, керує `autoIndex`, `maxPoolSize`
3. **Graceful Lifecycle** — `connectToDatabase`/`disconnectFromDatabase` з обробкою подій та повторним використанням з’єднання
4. **Observability** — logger фіксує запити, підключення MongoDB, помилки
5. **Test Isolation** — тести підключаються до ізольованої БД, очищають колекції після виконання

## Router Architecture

Структура роутерів не змінилася, але всі емісії звертаються до Mongoose моделей. Валідація `ObjectId` гарантує коректні 400 помилки для API та HTML 404 для веб.

## Deployment Considerations

### Традиційний сервер (Railway, Render, VPS)

- Індекси синхронізуються при старті (`ProductModel.syncIndexes()`)
- Можна контролювати `autoIndex` через `MONGOOSE_AUTO_INDEX`
- `maxPoolSize` читається з env (`MONGOOSE_MAX_POOL_SIZE`) — для Atlas рекомендується налаштовувати відповідно до тарифу
- Підключення до MongoDB встановлюється один раз при запуску через `startServer()`

### Serverless (Vercel, AWS Lambda)

- Використовується **lazy initialization** стратегія
- MongoDB підключається при першому HTTP запиті через middleware
- Middleware в `src/server.mjs` автоматично викликає `initializeForVercel()`
- Синхронізація індексів відбувається при ініціалізації
- Connection pooling зберігається між запитами в межах "теплого" контейнера
- Environment variable `VERCEL=1` автоматично встановлюється Vercel

**Переваги для serverless:**

- ✅ Швидший холодний старт (ініціалізація відкладена до першого запиту)
- ✅ Стабільність при тимчасових проблемах з MongoDB
- ✅ Graceful degradation (помилки не падають весь застосунок)

Докладніший опис процесу перенесення з мокованих даних у MongoDB див. в `docs/MIGRATION.md`.
Інструкція по deploy на Vercel — `docs/VERCEL.md`.
