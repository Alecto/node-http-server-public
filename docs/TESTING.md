# 🧪 Testing Guide

## Manual Testing

### Web Interface Testing

1. **Головна сторінка**

   ```
   GET http://localhost:3000/
   Expected: HTML сторінка з навігацією
   ```

2. **Список продуктів**

   ```
   GET http://localhost:3000/products
   Expected: HTML список з 5 продуктами
   ```

3. **Форма додавання**

   ```
   GET http://localhost:3000/products/new
   Expected: HTML форма з полями
   ```

4. **Створення продукту**
   ```
   POST http://localhost:3000/products
   Body: form data
   Expected: Redirect to /products
   ```

### API Testing

#### GET Requests

```bash
# Отримати всі продукти
curl -i -X GET http://localhost:3000/api/products

# Отримати продукт за ID
curl -i -X GET http://localhost:3000/api/products/1

# Неіснуючий продукт (404)
curl -i -X GET http://localhost:3000/api/products/999
```

#### POST Requests

```bash
# Створити новий продукт (ID генерується автоматично)
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "description": "Test description"
  }'

# Невалідні дані (400)
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "invalid",
    "name": "",
    "price": -10
  }'

# Невалідні дані (400) - від'ємна ціна
curl -i -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Product",
    "price": -10,
    "description": "Negative price should fail"
  }'
```

#### PUT Requests

```bash
# Оновити продукт
curl -i -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product",
    "price": 199.99,
    "description": "Updated description"
  }'

# Неіснуючий продукт (404)
curl -i -X PUT http://localhost:3000/api/products/999 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Should Fail",
    "price": 99.99,
    "description": "Product not found"
  }'
```

#### DELETE Requests

```bash
# Видалити продукт (використовуйте ID з попереднього створення)
curl -i -X DELETE http://localhost:3000/api/products/6

# Неіснуючий продукт (404)
curl -i -X DELETE http://localhost:3000/api/products/999
```

## Expected HTTP Status Codes

| Operation | Endpoint                 | Success | Error Cases   |
| --------- | ------------------------ | ------- | ------------- |
| Get All   | GET /api/products        | 200     | 500           |
| Get One   | GET /api/products/:id    | 200     | 404, 500      |
| Create    | POST /api/products       | 201     | 400, 409, 500 |
| Update    | PUT /api/products/:id    | 200     | 400, 404, 500 |
| Delete    | DELETE /api/products/:id | 200     | 404, 500      |

## Testing Checklist

### ✅ Functionality

- [ ] All CRUD operations work
- [ ] Data validation works
- [ ] Error handling works
- [ ] JSON responses are correct
- [ ] HTML pages render properly

### ✅ HTTP Compliance

- [ ] Correct status codes
- [ ] Proper HTTP methods
- [ ] Content-Type headers
- [ ] RESTful URL structure

### ✅ Edge Cases

- [ ] Invalid input data
- [ ] Non-existent resources
- [ ] Duplicate IDs
- [ ] Empty requests
- [ ] Large payloads

### ✅ Performance

- [ ] Response times < 100ms
- [ ] Memory usage stable
- [ ] No memory leaks
- [ ] Graceful shutdown works

## Automated Testing (Future)

```javascript
// Example with Jest + Supertest
describe('Products API', () => {
  test('GET /api/products returns all products', async () => {
    const response = await request(app).get('/api/products').expect(200).expect('Content-Type', /json/)

    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data)).toBe(true)
  })
})
```
