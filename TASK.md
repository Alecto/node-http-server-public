# 🚀 Завдання: Розширення Express застосунку до повного REST проєкту

**Складність:** Середня

**Мета:**

- Розширити мінімальну версію `express-basic-migration` до повноцінного навчального проєкту з REST API та HTML інтерфейсом для керування продуктами.
- Впровадити CRUD (Create, Read, Update, Delete) операції для продуктів через REST ендпоінти та веб-форми.
- Організувати код за кращими практиками Express: модульні роутери, middleware, валідація, обробка помилок, документування.

## Ключові результати

- Веб-інтерфейс (EJS) для перегляду, додавання, редагування та видалення продуктів.
- RESTful API `/api/products` з методами GET/POST/PUT/PATCH/DELETE.
- In-memory модель продуктів із валідацією та службовими утилітами.
- Middleware для логування, валідації запитів, обробки помилок (404/500, JSON vs HTML).
- Оновлена документація та базові інтеграційні тести.

## Структура проєкту

### Після `express-basic-migration`

```
node-http-server/
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── pageController.mjs
│   │   └── productController.mjs
│   ├── models/
│   │   └── products.mjs
│   ├── routes/
│   │   └── router.mjs
│   ├── views/
│   │   ├── index.ejs
│   │   ├── products.ejs
│   │   ├── product-form.ejs
│   │   └── product-detail.ejs
│   └── server.mjs
├── index.mjs
├── package.json
└── README.md
```

### Мета `express-migration`

```
node-http-server/
├── docs/                 # API, Architecture, Testing, Deployment
├── src/
│   ├── config/
│   │   ├── index.mjs
│   │   └── http.mjs
│   ├── data/
│   │   └── products.mjs    # початкові продукти
│   ├── controllers/
│   │   ├── pageController.mjs
│   │   └── productController.mjs (HTML + API)
│   ├── middleware/
│   │   ├── errorHandlers.mjs
│   │   └── validation.mjs
│   ├── models/
│   │   └── products.mjs     # CRUD, валідація, reset
│   ├── routes/
│   │   ├── api/
│   │   │   ├── index.mjs
│   │   │   └── products.mjs
│   │   └── web/
│   │       ├── index.mjs
│   │       ├── pages.mjs
│   │       └── products.mjs
│   ├── server.mjs
│   └── views/
│       ├── 404.ejs
│       ├── 500.ejs
│       ├── index.ejs
│       ├── navigation.ejs
│       ├── products.ejs
│       ├── product-form.ejs
│       └── product-detail.ejs
├── tests/
│   └── runTests.mjs
├── index.mjs
├── package.json
└── README.md
```

---

## Етап 1. express-basic-migration (базова Express версія)

> Цей етап виконується у гілці `express-basic-migration` і базується на результатах `express-basic-migration`. Мета — розширити просту Express-версію до повноцінного навчального проєкту з HTML інтерфейсом та RESTful API для продуктів.

### Кроки

1. **Розширення залежностей та структури**

   - Переконайтесь, що в проєкті встановлено `express`, `ejs`, `method-override`, `dotenv` (як у попередній гілці).
   - Додайте за потреби `supertest`/`cross-env` (для майбутніх тестів) та оновіть `package.json`.
   - Розбій структуру `routes/` на `routes/api` та `routes/web`, створіть агрегатор `routes/api/index.mjs` та `routes/web/index.mjs`.

2. **Модель даних**

   - Винесіть початкові продукти в окремий модуль (`src/data/products.mjs`).
   - У `src/models/products.mjs` реалізуйте in-memory CRUD:
     - `getAllProducts`, `getProductById`.
     - `addProduct` (генерує наступний `id`).
     - `replaceProduct` (PUT), `patchProduct` (PATCH), `deleteProduct`.
     - Валідації: `validateProduct`, `validatePutProduct`, `validatePatchProduct`, `resetProducts` (для тестів).

3. **Контролери**

   - Розділіть контролери на HTML (`pageController`, `productController` для веб) та API (`productController` з REST методами).
   - Реалізуйте JSON ендпоінти для `/api/products`:
     - `GET /api/products` — список продуктів.
     - `GET /api/products/:id` — деталі.
     - `POST` — створення (генерація `id` сервером).
     - `PUT` — повна заміна.
     - `PATCH` — часткове оновлення.
     - `DELETE` — видалення.
   - Веб-частина повинна підтримувати перегляд списку, деталей, створення, редиректи після успішних дій.

4. **Middleware та обробка помилок**

   - Додайте middleware для логування кожного запиту (для веб і API).
   - Створіть `src/middleware/validation.mjs` з перевірками запитів (create, put, patch) та підключіть їх у API роутері.
   - Розширіть `errorHandlers.mjs`:
     - Глобальні `process` обробники (`uncaughtException`, `unhandledRejection`).
     - Express error middleware, який повертає JSON для API та рендерить сторінку 500 для веб.
   - Реалізуйте окремий 404 для API (JSON) і для веб (EJS сторінка).

5. **Маршрутизація**

   - У `routes/api/products.mjs` використайте ланцюгові виклики `.route()` для кожного набору методів.
   - `routes/web/products.mjs` теж структуризуйте з `.route()` та методами для форм.
   - Підключіть у `server.mjs` агреговані роутери: `app.use('/api', apiRouter)`, `app.use('/', webRouter)`.
   - Забезпечте статичний контент (за потреби), middleware для `express.urlencoded`, `express.json`, `methodOverride('_method')`.

6. **Види (views)**

   - Розширіть EJS шаблони: список, форма, детальна сторінка, 404, 500, навігація та стилі.
   - Продумайте UX повідомлення (наприклад, помилки валідації у формах).

7. **Документація**

   - Оновіть `README.md`, додайте інформацію про REST API, HTML маршрути та швидкий старт.
   - Підготуйте окремі документи у `docs/` (`API.md`, `ARCHITECTURE.md`, `TESTING.md`, `DEPLOYMENT.md`), що описують:
     - Ендпоінти і приклади запитів (cURL, статуси).
     - Архітектуру (MVC, модульні роутери, middleware).
     - Рекомендації з тестування (мануальні та автоматизовані сценарії).
     - Поради щодо деплою (Docker, PM2, Nginx, env).

8. **Тести (базовий приклад)**

   - Підготуйте мінімальний інтеграційний тест `tests/runTests.mjs` з `node:test` + `supertest` (наприклад, перевірка `GET /api/products`, `POST`, `PATCH`, `DELETE`).
   - Додайте скрипт `"test": "cross-env NODE_ENV=test node --experimental-vm-modules ./tests/runTests.mjs"`.

9. **Перевірка**
   - Запустіть `yarn dev`, вручну протестуйте HTML форми та API (cURL або Postman).
   - Запустіть `yarn test` для автоматичних перевірок.
   - Переконайтесь, що додано/видалено продукти коректно, валідація працює (наприклад, ціна > 0, назва не порожня).

### Критерії успіху

- Веб-інтерфейс (сторінки + форми) працює, відображає список продуктів та дозволяє їх CRUD через форми.
- REST API `/api/products` реалізований з методами GET/POST/PUT/PATCH/DELETE, повертає коректні статуси й повідомлення.
- Дані зберігаються in-memory, але реалізовані утиліти для валідації та оновлень (`products.mjs`).
- Маршрути структуровані, middleware використовуються для логування, валідації та обробки помилок.
- Документація та тести відповідають поточному функціоналу гілки `express-migration`.

---

## Етап 2. express-migration (поточна гілка)

> В цій гілці ви розширюєте вже готову базову Express-версію до широкого навчального прикладу. Орієнтуйтеся на документи `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/DEPLOYMENT.md`.

### 1. Оновлення залежностей та структури

- Переконайтесь, що встановлені `express`, `ejs`, `method-override`, `dotenv`. За потреби додайте `supertest`, `cross-env` для тестів.
- Винесіть початкові продукти в `src/data/products.mjs`, а логіку доступу/валідації — в `src/models/products.mjs`.
- Створіть окремі директорії для API та веб роутерів (`src/routes/api`, `src/routes/web`) з агрегаторами (`index.mjs`).
- Розділіть контролери на HTML (`pageController`, `productController` для веб) та JSON API (у `productController` залиште REST функції).

### 2. RESTful API

- Реалізуйте `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PUT /api/products/:id`, `PATCH /api/products/:id`, `DELETE /api/products/:id`.
- Гарантуйте коректні статус-коди (200, 201, 400, 404, 409, 500) та повідомлення у форматі JSON.
- Додайте middleware для валідації запитів (`src/middleware/validation.mjs`) перед викликом контролерів.
- В API роутері використовуйте ланцюгові виклики `.route()` для групування методів.

### 3. HTML інтерфейс

- Створіть EJS шаблони: список продуктів, форма створення/редагування, детальна сторінка, 404 та 500.
- Забезпечте навігацію та відображення повідомлень про помилки (наприклад, при валідації форм).
- Веб маршрути повинні підтримувати повний цикл CRUD через форми (з використанням method-override для PUT/DELETE).

### 4. Middleware та обробка помилок

- Додайте логування запитів (проста middleware з `logger`).
- Реалізуйте Express error middleware, який повертає JSON для API та рендерить сторінку для веб.
- Налаштуйте окремі 404-хендлери: JSON для `/api/*`, HTML для решти.
- Збережіть глобальні процесні обробники (`uncaughtException`, `unhandledRejection`).

### 5. Тестування

- Додайте інтеграційні тести (`tests/runTests.mjs`) з використанням `node:test` та `supertest` для основних REST сценаріїв (GET/POST/PATCH/DELETE).
- Передбачте утиліту `resetProducts()` в моделі для скидання стану між тестами.
- Запускайте `yarn test` перед здачею.

### 6. Документація

- Оновіть `README.md`, відобразіть HTML маршрути, REST API, інструкції з запуску.
- Підготуйте або оновіть документи в `docs/` (API, Architecture, Testing, Deployment) згідно з реальним функціоналом поточної гілки.

### 7. Перевірка та критерії

- Ручно протестуйте HTML та REST API (через браузер, cURL або Postman).
- Переконайтесь, що дані в памʼяті оновлюються коректно, валідація працює.
- Код відповідає кращим практикам: модульність, розділення відповідальності, читабельність, охоплення тестами.

---

## Додаткові ідеї (для подальшого розвитку)

- Оновіть README під Express реалізацію.
- Опишіть у README базові ендпоінти та як запустити проект.
