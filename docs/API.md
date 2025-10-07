# 🚀 Products API Documentation

## Express.js HTTP Server + MongoDB Atlas (Mongoose)

### 🌐 Base URL

```
http://localhost:3000
```

## 📱 JSON API Routes

**Base URL for API:** `/api/`

### 🔐 Authentication

API використовує **JWT токени** для автентифікації захищених ендпоінтів.

**Отримання токена:**

1. Авторизуйтесь через веб-інтерфейс: `GET /auth/login`
2. Отримайте JWT токен: `GET /auth/api/token`

**Використання токена:**

```bash
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Публічні ендпоінти** (без токена):

- `GET /api/products` - список продуктів
- `GET /api/products/:id` - деталі продукту

**Захищені ендпоінти** (потрібен JWT):

- `POST /api/products` - створення
- `PUT /api/products/:id` - повне оновлення
- `PATCH /api/products/:id` - часткове оновлення
- `DELETE /api/products/:id` - видалення

Детальніше: [AUTHENTICATION.md](AUTHENTICATION.md)

### Content-Type

- **Request:** `application/json`
- **Response:** `application/json`

---

## 🔗 API Endpoints

### 📋 GET /api/products

Отримати список всіх продуктів (відсортовані за `createdAt` ↓).

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "68de36b18798562deaa309d2",
      "name": "Wireless Headphones",
      "price": 299.99,
      "description": "Бездротові навушники з активним шумозаглушенням",
      "createdAt": "2025-10-02T08:24:17.954Z",
      "updatedAt": "2025-10-02T08:24:17.954Z"
    }
  ],
  "count": 9
}
```

### 🔍 GET /api/products/:id

Отримати продукт за MongoDB ObjectId.

```json
{
  "success": true,
  "data": {
    "_id": "68de36b18798562deaa309d2",
    "name": "Wireless Headphones",
    "price": 299.99,
    "description": "Бездротові навушники з активним шумозаглушенням",
    "createdAt": "2025-10-02T08:24:17.954Z",
    "updatedAt": "2025-10-02T08:24:17.954Z"
  }
}
```

**Response 400 (некоректний ObjectId):**

```json
{
  "success": false,
  "error": "Некоректний ідентифікатор ресурсу"
}
```

**Response 404 (не знайдено):**

```json
{
  "success": false,
  "error": "Продукт не знайдено"
}
```

### ➕ POST /api/products

Створити новий продукт. **🔒 Потрібен JWT токен**

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "New Product",
  "price": 199.99,
  "description": "Опис нового продукту"
}
```

**Response 201:**

```json
{
  "success": true,
  "data": {
    "_id": "68de3781380836c2a6895c3c",
    "name": "New Product",
    "price": 199.99,
    "description": "Опис нового продукту",
    "createdAt": "2025-10-02T08:27:45.124Z",
    "updatedAt": "2025-10-02T08:27:45.124Z"
  },
  "message": "Продукт успішно створено"
}
```

### ✏️ PUT /api/products/:id

Повністю замінити продукт (всі поля обовʼязкові). **🔒 Потрібен JWT токен**

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "_id": "68de3781380836c2a6895c3c",
    "name": "New Product Replaced",
    "price": 199.99,
    "description": "Оновлений опис",
    "createdAt": "2025-10-02T08:27:45.124Z",
    "updatedAt": "2025-10-02T08:27:45.517Z"
  },
  "message": "Продукт успішно оновлено"
}
```

### ♻️ PATCH /api/products/:id

Частково оновити продукт. **🔒 Потрібен JWT токен**

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "_id": "68de3781380836c2a6895c3c",
    "name": "New Product",
    "price": 209.99,
    "description": "Опис нового продукту",
    "createdAt": "2025-10-02T08:27:45.124Z",
    "updatedAt": "2025-10-02T08:27:45.385Z"
  },
  "message": "Продукт успішно оновлено"
}
```

### 🗑️ DELETE /api/products/:id

Видалити продукт за ObjectId. **🔒 Потрібен JWT токен**

**Headers:**

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "_id": "68de3781380836c2a6895c3c",
    "name": "New Product Replaced",
    "price": 209.99,
    "description": "Опис нового продукту",
    "createdAt": "2025-10-02T08:27:45.124Z",
    "updatedAt": "2025-10-02T08:27:45.517Z"
  },
  "message": "Продукт успішно видалено"
}
```

---

## 📊 HTTP Status Codes

| Code | Description                                |
| ---- | ------------------------------------------ |
| 200  | OK                                         |
| 201  | Created                                    |
| 400  | Bad Request (валидація / ObjectId)         |
| 401  | Unauthorized (відсутній/невірний токен)    |
| 404  | Not Found                                  |
| 409  | Conflict (дублікат за унікальним індексом) |
| 500  | Internal Server Error                      |

---

## 🧪 Testing Examples

### Публічні запити (без автентифікації)

```bash
# Отримати всі продукти
curl -X GET http://localhost:3000/api/products

# Отримати продукт за ID
curl -X GET http://localhost:3000/api/products/PRODUCT_ID
```

### Захищені запити (з JWT токеном)

```bash
# 1. Спочатку отримайте JWT токен через веб-інтерфейс
# Відкрийте http://localhost:3000/auth/login та увійдіть
# Потім отримайте токен:
curl -X GET http://localhost:3000/auth/api/token

# 2. Використовуйте токен для API запитів
export JWT_TOKEN="your_jwt_token_here"

# Створити продукт
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"description":"Test description"}'

# Оновити продукт
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Product","price":149.99,"description":"Updated description"}'

# Частково оновити продукт
curl -X PATCH http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":199.99}'

# Видалити продукт
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### Помилки автентифікації

```bash
# Спроба створити продукт без токена
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"description":"desc"}'

# Response 401:
# {
#   "success": false,
#   "error": "Токен відсутній",
#   "message": "Необхідно надати JWT токен в Authorization header"
# }
```

> Повний сценарій тестування описано в `docs/TESTING.md` та `docs/AUTHENTICATION.md`.
