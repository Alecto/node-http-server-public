# 🚀 Node.js HTTP Server - Learning Path

Навчальний проект, що демонструє поетапну розробку веб-сервера від базового HTTP сервера до повноцінного застосунку з автентифікацією та базою даних.

## 📖 Про проект

Цей репозиторій містить покрокову міграцію проекту через різні технології та підходи. Кожна гілка представляє окремий етап розробки з власною документацією та функціональністю.

**🌐 Демо:** [https://node-http-server.vercel.app/](https://node-http-server.vercel.app/)

## 🎯 Фінальний результат

Фінальна версія (гілка `feature/auth0-authentication`) - це Express.js застосунок з:

- 🔐 **Автентифікацією через Auth0** (Google, GitHub)
- 📊 **MongoDB Atlas** для зберігання даних
- 🔄 **Повними CRUD операціями** для продуктів
- 🎨 **Сучасним веб-інтерфейсом** на EJS шаблонах
- 🔌 **RESTful API** з JWT токенами
- 🛡️ **Гібридною автентифікацією** (Session для веб, JWT для API)

## 📚 Карта розробки

### Етап 1: `legacy-node-http` - Чистий Node.js

**Що містить:**

- Базовий HTTP сервер на вбудованому модулі `http`
- MVC архітектура
- Обробка GET/POST запитів
- Відправка HTML, JSON, текстових відповідей
- Обробка форм та асинхронних операцій
- Глобальна обробка помилок

**Навчальні цілі:**

- Розуміння основ HTTP протоколу
- Робота з вбудованими модулями Node.js
- Базова маршрутизація та обробка запитів
- Структурування коду за MVC патерном

```bash
git checkout legacy-node-http
yarn install
yarn dev
```

### Етап 2: `express-basic-migration` - Перехід на Express.js

**Що змінилось:**

- Міграція з `http` на **Express.js**
- Підключення **EJS** для шаблонів
- Спрощена маршрутизація через Express Router
- Базові CRUD операції (Create + Read) для продуктів у пам'яті
- Мінімальна структура проекту

**Навчальні цілі:**

- Основи роботи з Express.js
- Використання шаблонізатора EJS
- Express middleware та routing
- Перехід від нативного Node.js до фреймворку

```bash
git checkout express-basic-migration
yarn install
yarn dev
```

### Етап 3: `express-migration` - Розвиток Express застосунку

**Що додано:**

- **Повні CRUD операції** (Create, Read, Update, Delete)
- **RESTful API** з JSON відповідями
- **HTTP статус коди** (200, 201, 400, 404, 409, 500)
- **Валідація даних** через middleware
- **Структуроване логування**
- **Method Override** для PUT/DELETE через HTML форми
- **Розширена документація** (API, Architecture, Testing, Deployment)
- **Автоматизоване тестування** (node:test + supertest)

**Навчальні цілі:**

- Побудова RESTful API
- Валідація та обробка помилок
- Організація middleware
- Тестування API запитів
- Документування проекту

```bash
git checkout express-migration
yarn install
yarn dev
yarn test  # запуск тестів
```

### Етап 4: `mongoose-migration` - Інтеграція MongoDB

**Що додано:**

- **MongoDB Atlas** / локальна MongoDB через **Mongoose ODM**
- Моделі даних з валідацією на рівні схем
- З'єднання та від'єднання від БД
- Seed скрипти для початкових даних (`seeds/products.json`)
- Оновлена конфігурація через змінні оточення
- Інтеграційні тести з реальною БД

**Навчальні цілі:**

- Робота з NoSQL базами даних
- Mongoose схеми та моделі
- Валідація даних на рівні БД
- Підключення до MongoDB Atlas
- Міграція з даних у пам'яті на персистентне сховище

```bash
git checkout mongoose-migration
yarn install
# Налаштуйте .env з MongoDB URI (див. env.example)
yarn dev
```

### Етап 5: `feature/auth0-authentication` - Автентифікація (Фінал)

**Що додано:**

- **Auth0** автентифікація з OAuth 2.0
- Провайдери: Google, GitHub
- **Гібридна автентифікація:**
  - Session-based для веб-інтерфейсу
  - JWT токени для API (власні, не Auth0)
- Модель користувача в MongoDB
- Захист роутів (публічний перегляд, редагування тільки для авторизованих)
- Профіль користувача
- **Deployment на Vercel** з GitLab

**Навчальні цілі:**

- Реалізація OAuth 2.0 автентифікації
- Розуміння Session vs JWT
- Захист роутів та API
- Інтеграція сторонніх сервісів (Auth0)
- Деплой full-stack застосунку

```bash
git checkout feature/auth0-authentication
yarn install
# Налаштуйте .env з Auth0 credentials (див. env.example та docs/AUTH_SETUP.md)
yarn dev
```

**📖 Детальна документація фінальної версії:**

- [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) - автентифікація та JWT
- [docs/API.md](docs/API.md) - REST API документація
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - архітектура проекту
- [docs/VERCEL.md](docs/VERCEL.md) - деплой на Vercel

## 🛠️ Технології по етапах

| Етап                             | Основні технології                        |
| -------------------------------- | ----------------------------------------- |
| **legacy-node-http**             | Node.js, HTTP module                      |
| **express-basic-migration**      | Express.js, EJS                           |
| **express-migration**            | Express.js, EJS, Method Override, Testing |
| **mongoose-migration**           | Express.js, MongoDB, Mongoose             |
| **feature/auth0-authentication** | Express.js, MongoDB, Mongoose, Auth0, JWT |

## 🚀 Швидкий старт

### Встановлення

```bash
# Клонувати репозиторій
git clone <repository-url>
cd node-http-server

# Перейти на потрібну гілку (наприклад, фінальну версію)
git checkout feature/auth0-authentication

# Встановити залежності
yarn install
# або
npm install

# Створити .env файл на основі env.example
# Налаштувати змінні середовища (MongoDB URI, Auth0 credentials тощо)
```

### Запуск

```bash
# Режим розробки
yarn dev
# або
npm run dev

# Продакшн
yarn start
# або
npm start
```

## 📋 Послідовність вивчення

Рекомендований порядок роботи з проектом:

1. **Почніть з `legacy-node-http`** - зрозумійте основи HTTP та Node.js
2. **Перейдіть на `express-basic-migration`** - познайомтесь з Express.js
3. **Розгорніть `express-migration`** - вивчіть RESTful API та MVC
4. **Освойте `mongoose-migration`** - інтегруйте базу даних
5. **Завершіть на `feature/auth0-authentication`** - додайте автентифікацію

Кожна гілка містить власний README з детальними інструкціями та поясненнями.

## 💡 Для початківців

Цей проект створений спеціально для навчання. Ось що варто знати:

- ✅ Кожна гілка - це окремий робочий проект
- ✅ Можна вивчати гілки незалежно або послідовно
- ✅ Детальна документація в кожній гілці
- ✅ Коментарі в коді пояснюють складні моменти
- ✅ Приклади використання API (cURL команди)
- ✅ Автоматизовані тести для перевірки функціональності

## 🔗 Корисні посилання

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Auth0 Documentation](https://auth0.com/docs)
- [EJS Template Engine](https://ejs.co/)

## 📝 Примітки

- Для роботи з `mongoose-migration` та `feature/auth0-authentication` потрібен MongoDB Atlas акаунт (безкоштовний)
- Для роботи з `feature/auth0-authentication` потрібен Auth0 акаунт (безкоштовний)
- Всі налаштування через файл `.env` (приклади в `env.example`)
- Демо версія розгорнута на Vercel: [https://node-http-server.vercel.app/](https://node-http-server.vercel.app/)

---

## 👨‍💻 Автор

**Andrii Fomenko** - Full-Stack Developer, Senior IT Professional and Educator

- 🎓 Head Coach of the Full-Stack JS Course, Hillel IT School
- 🏫 Senior Lecturer, Department of Information Systems, National Technical University "KhPI"
- 💼 Architect and Project Manager at LLC Astravel
- 🔗 GitHub: [@Alecto](https://github.com/Alecto)
- 💼 LinkedIn: [andrii-fomenko](https://www.linkedin.com/in/andrii-fomenko/)
- 💳 eVizitka: [andrii-fomenko](https://evizitka.cc/id/andrii-fomenko)
- 📧 Email: fomenkoandrey1978@gmail.com

## 📄 Ліцензія

Цей проект розповсюджується під ліцензією **MIT** - однією з найбільш дозвільних open-source ліцензій.

**Що це означає:**

- ✅ Ви можете вільно використовувати цей код у своїх проектах
- ✅ Ви можете модифікувати код під свої потреби
- ✅ Ви можете розповсюджувати як оригінальний, так і змінений код
- ✅ Ви можете використовувати код у комерційних проектах
- ℹ️ Єдина вимога - збереження оригінального copyright notice

MIT ліцензія ідеально підходить для навчальних проектів, оскільки дозволяє студентам вільно експериментувати та використовувати код.
