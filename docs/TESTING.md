# 🧪 Testing Guide

## Manual Testing (MongoDB + Express)

### Web Interface

1. **Головна сторінка**
   ```
   GET http://localhost:3000/
   Expected: HTML сторінка з навігацією
   ```
2. **Список продуктів**
   ```
   GET http://localhost:3000/products
   Expected: HTML список із даними з MongoDB
   ```
3. **Форма створення**
   ```
   GET http://localhost:3000/products/new
   Expected: Форма з полями name/price/description
   ```
4. **Створення продукту**
   ```
   POST http://localhost:3000/products (form-urlencoded)
   Expected: Redirect на /products, новий продукт у списку
   ```

### API Testing (ObjectId)

```bash
# Отримати всі продукти
curl -i -X GET http://localhost:3000/api/products

# Отримати продукт за ObjectId
curl -i -X GET http://localhost:3000/api/products/<ObjectId>

# Створити (повертає новий ObjectId)
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"description":"Test description"}'

# PUT / PATCH / DELETE працюють аналогічно, використовуйте валідний ObjectId
```

## Automation Toolkit

- `yarn node scripts/checkServer.mjs` — запускає сервер, проходить усі ключові API та HTML маршрути, зупиняє сервер
- `yarn node scripts/seedProducts.mjs` — очищає колекцію `products`, імпортує `seeds/products.json`
- `yarn test` — інтеграційні тести (`node:test` + Supertest) на окремій БД `atlas-products-test`

> Після `yarn test` колекції тестової БД дропаються, щоб не залишалося слідів.

## Expected Status Codes

| Operation | Endpoint                 | Success | Errors             |
| --------- | ------------------------ | ------- | ------------------ |
| Get All   | GET /api/products        | 200     | 500                |
| Get One   | GET /api/products/:id    | 200     | 400, 404, 500      |
| Create    | POST /api/products       | 201     | 400, 409, 500      |
| Update    | PUT /api/products/:id    | 200     | 400, 404, 409, 500 |
| Patch     | PATCH /api/products/:id  | 200     | 400, 404, 500      |
| Delete    | DELETE /api/products/:id | 200     | 404, 500           |

## Checklist

- [ ] MongoDB Atlas доступний, `MONGODB_URI` коректний
- [ ] `seedProducts.mjs` виконано (опціонально) перед інтеграційними тестами
- [ ] `yarn node scripts/checkServer.mjs` завершується без помилок
- [ ] `yarn test` проходить і очищує тестову БД
- [ ] Некоректні ObjectId повертають 400
- [ ] Валідація цін, довжини рядків та унікальності імен працює

## Notes

- Для валідації ObjectId використовується middleware `validateObjectIdParam`
- `ProductModel.syncIndexes()` виконується при старті сервера, тому повторні запуски не блокують Atlas
- У production рекомендується вимкнути `autoIndex` (керувати через змінні оточення)
