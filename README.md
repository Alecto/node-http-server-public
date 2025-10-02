# Express.js Products (Basic)

Простий Express.js сервер з базовими сторінками для перегляду та додавання продуктів.

## Особливості

- Express.js як HTTP сервер
- EJS шаблони для HTML сторінок
- CRUD (Create + Read) для продуктів у памʼяті
- Простий роутинг та мінімальна структура

## Структура проекту

```
node-http-server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── views/
│   └── server.mjs
├── index.mjs
├── package.json
└── README.md
```

## Встановлення

```bash
# Клонувати репозиторій
git clone <url-репозиторію>
cd node-http-server

# Встановити залежності
yarn install
# або
npm install

# (Опціонально) створити .env для PORT та HOST
```

## Запуск

```bash
# Запуск в режимі розробки (з автоматичним перезавантаженням)
yarn dev
# або
npm run dev

# Запуск в звичайному режимі
yarn start
# або
npm start
```

## Доступні ендпоінти

- `GET /` - Головна сторінка
- `GET /products` - Список продуктів
- `GET /products/new` - Форма додавання продукту
- `GET /products/:id` - Деталі продукту
- `POST /products` - Створення продукту через форму
