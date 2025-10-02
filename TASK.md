# 🚀 Завдання: Міграція Express-проєкту на MongoDB Atlas через Mongoose

**Гілка:** `mongoose-migration`

**Складність:** Середня → Висока

## Мета

- Перенести код з in-memory моків (гілка `express-migration`) на повноцінний MongoDB Atlas
- Використати Mongoose як ODM: схеми, валідація, індекси, робота з ObjectId
- Налаштувати повторюваний процес сидування даних і тестування з живою БД
- Оновити документацію та автоматизацію відповідно до нової архітектури

## Ключові результати

- `ProductModel` (Mongoose схема + індекси) з унікальним `name` (case-insensitive) та `createdAt` сортуванням
- `connectToDatabase`/`disconnectFromDatabase` з логуванням, `autoIndex`, `maxPoolSize` з конфігурації
- Всі контролери (API + HTML) працюють через Mongoose (`lean()`, `runValidators`, `findByIdAndUpdate` тощо)
- Middleware `validateObjectIdParam` повертає 400/404 для некоректних ObjectId
- `scripts/seedProducts.mjs` + `seeds/products.json` — перенесення початкових даних у MongoDB
- `scripts/checkServer.mjs` — автоматизована інтеграційна перевірка
- `tests/runTests.mjs` — інтеграційні тести на окремій БД `atlas-products-test`, очищення колекцій після запуску
- Оновлена документація (`docs/API.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/MIGRATION.md`)

## Структура проєкту (після міграції)

```
node-http-server/
├── scripts/                # Службові скрипти (seed, інтеграційні перевірки)
├── seeds/                  # JSON дані для імпорту
├── src/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── views/
├── tests/
├── docs/
│   └── MIGRATION.md        # Новий документ
├── index.mjs
├── package.json
└── README.md
```

## Кроки виконання

1. **Підключення до MongoDB**

   - Оновити `src/config/index.mjs` для роботи з URI/autoIndex/maxPoolSize
   - Розширити `src/database/connection.mjs` подіями Mongoose та керуванням пулом

2. **Модель Mongoose**

   - Реалізувати схему `Product` з валідаторами (довжини, trim, min) та індексами
   - `toJSON` має повертати `id` замість `_id`

3. **Контролери та маршрути**

   - Замінити in-memory CRUD на виклики `ProductModel`
   - Використовувати `lean()` для читання, `runValidators` для оновлень
   - Додати middleware `validateObjectIdParam` у API та Web маршрути

4. **Seed та автоматизація**

   - Винести дані у `seeds/products.json`
   - Створити `scripts/seedProducts.mjs` для імпорту (очищення + `insertMany`)
   - Створити `scripts/checkServer.mjs` для сценарію (GET/POST/PATCH/PUT/DELETE + HTML)

5. **Тестування**

   - Оновити `tests/runTests.mjs` для роботи з тестовою БД, імпорту даних із JSON, очищення колекцій
   - Забезпечити запуск через `yarn test`

6. **Документація**
   - Оновити `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, додати `docs/MIGRATION.md`
   - Оновити `README.md` і цей файл із новими вимогами

## Критерії успіху

- Сервер стартує на MongoDB Atlas (або локальному MongoDB), `ProductModel.syncIndexes()` відпрацьовує без помилок
- Контролери охоплюють усі CRUD сценарії; валідації працюють на рівні middleware + Mongoose
- `seedProducts.mjs` успішно переносить дані без конфліктів індексів
- `scripts/checkServer.mjs` завершується без помилок
- `yarn test` проходить та очищує тестову БД
- Документація описує новий стек, інструкції з міграції та тестування

## Подальші кроки (необовʼязково)

- Додати авторизацію/аутентифікацію
- Винести налаштування у Kubernetes Secrets/ConfigMaps
- Додати observability (metrics, health checks)
