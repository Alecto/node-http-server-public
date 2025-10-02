# 📦 Migration Guide: express-migration → mongoose-migration

## Огляд

Ця гілка переносить проєкт із in-memory моків до MongoDB Atlas з використанням Mongoose. Нижче описано ключові зміни, міграційні скрипти та кроки для повторення процесу на новому середовищі.

## 1. Зміни у структурі даних

- Видалено `src/data/products.mjs` із масивом моків.
- Додано `seeds/products.json` — джерело початкових документів (9 продуктів).
- Створено `scripts/seedProducts.mjs` для імпорту JSON у колекцію `products`.
- Усі контролери працюють напряму з `ProductModel` (Mongoose).

## 2. Налаштування підключення

- `src/config/index.mjs` тепер формує URI MongoDB (Atlas або локальний) і надає параметри `autoIndex`, `maxPoolSize`.
- `src/database/connection.mjs` керує життєвим циклом Mongoose, логує події й повертає існуюче з’єднання.
- `src/server.mjs` викликає `ProductModel.syncIndexes()` при старті.
- Валідація ObjectId додана через middleware `validateObjectIdParam` (API та Web).

## 3. Seed та тести

- `yarn node scripts/seedProducts.mjs` — очищує колекцію і завантажує JSON у MongoDB.
- `yarn node scripts/checkServer.mjs` — інтеграційна перевірка, що охоплює API + HTML маршрути.
- `yarn test` — інтеграційні тести (`node:test` + Supertest) на базі `atlas-products-test`; після виконання колекції тестової БД дропаються.

## 4. Вказівки для міграції

1. **Оновіть `.env`**:
   ```ini
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
   DB_NAME=atlas-products
   MONGOOSE_AUTO_INDEX=false        # prod рекомендовано вимкнути
   MONGOOSE_MAX_POOL_SIZE=20        # налаштуйте за потреби
   ```
2. **Запустіть seed** (тільки один раз на середовище):
   ```bash
   yarn node scripts/seedProducts.mjs
   ```
3. **Перевірте сервіс**:
   ```bash
   yarn node scripts/checkServer.mjs
   ```
4. **Запустіть тести**:
   ```bash
   yarn test
   ```

## 5. Що змінилося

| Раніше (`express-migration`) | Тепер (`mongoose-migration`)                         |
| ---------------------------- | ---------------------------------------------------- |
| Дані зберігались у масиві    | Дані в MongoDB Atlas                                 |
| Логіка CRUD у моделі         | CRUD через Mongoose `ProductModel`                   |
| Seed через імпорт модуля     | Seed через JSON + Mongoose скрипт                    |
| Тести працювали з in-memory  | Тести використовують окрему БД `atlas-products-test` |
| Документація для моків       | Документація описує Atlas + Mongoose                 |

## 6. Рекомендації

- Для production вимкніть `autoIndex` і використовуйте `ProductModel.syncIndexes()` при деплої.
- Зберігайте seed JSON актуальним і версіонуйте його.
- Створіть окремого користувача Atlas для тестової БД із правами `dbOwner` (якщо потрібен `dropDatabase`).
- Ведіть журнал змін у `docs/MIGRATION.md` для майбутніх міграцій.
