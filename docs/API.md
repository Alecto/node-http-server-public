# 🚀 Products API Documentation

## Express.js HTTP Server + MongoDB Atlas (Mongoose)

### 🌐 Base URL

```
http://localhost:3000
```

## 📱 JSON API Routes

**Base URL for API:** `/api/`

### Authentication

Немає (навчальний проект). Atlas URI зберігається в `.env`.

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

Створити новий продукт.

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

Повністю замінити продукт (всі поля обовʼязкові).

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

Частково оновити продукт.

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

Видалити продукт за ObjectId.

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
| 404  | Not Found                                  |
| 409  | Conflict (дублікат за унікальним індексом) |
| 500  | Internal Server Error                      |

---

## 🧪 Testing Examples

```bash
# Отримати всі продукти (MongoDB Atlas)
yarn node scripts/checkServer.mjs   # комплексна перевірка

# Або базові cURL
curl -X GET http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"description":"desc"}'
```

> Повний сценарій тестування описано в `docs/TESTING.md`.
