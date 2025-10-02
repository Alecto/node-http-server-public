# 🚀 Products API Documentation

## Express.js HTTP Server з повними CRUD операціями

### 🌐 Base URL

```
http://localhost:3000
```

## 📱 JSON API Routes

**Base URL for API:** `/api/`

### Authentication

Немає (навчальний проект)

### Content-Type

- **Request:** `application/json`
- **Response:** `application/json`

---

## 🔗 API Endpoints

### 📋 GET /api/products

Отримати список всіх продуктів

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop Pro 16",
      "price": 2599.99,
      "description": "Високопродуктивний ноутбук для професіоналів"
    }
  ],
  "count": 5
}
```

### 🔍 GET /api/products/:id

Отримати один продукт за ID

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro 16",
    "price": 2599.99,
    "description": "Високопродуктивний ноутбук для професіоналів"
  }
}
```

**Response 404:**

```json
{
  "success": false,
  "error": "Продукт не знайдено"
}
```

### ➕ POST /api/products

Створити новий продукт (ID генерується автоматично на сервері)

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
    "id": 6,
    "name": "New Product",
    "price": 199.99,
    "description": "Опис нового продукту"
  },
  "message": "Продукт успішно створено"
}
```

**Response 400:**

```json
{
  "success": false,
  "error": "Невірні дані продукту: перевірте name, price та description"
}
```

### ✏️ PUT /api/products/:id

Повністю замінити продукт (усі поля обов'язкові)

**Request Body:**

```json
{
  "name": "Updated Product",
  "price": 299.99,
  "description": "Оновлений опис"
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Product",
    "price": 299.99,
    "description": "Оновлений опис"
  },
  "message": "Продукт успішно оновлено"
}
```

### ♻️ PATCH /api/products/:id

Частково оновити продукт (оновлюються лише передані поля)

**Request Body:**

```json
{
  "price": 279.99
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop Pro 16",
    "price": 279.99,
    "description": "Високопродуктивний ноутбук для професіоналів"
  },
  "message": "Продукт успішно оновлено"
}
```

### 🗑️ DELETE /api/products/:id

Видалити продукт

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Deleted Product",
    "price": 199.99,
    "description": "Видалений продукт"
  },
  "message": "Продукт успішно видалено"
}
```

---

## 📊 HTTP Status Codes

| Code | Description                     |
| ---- | ------------------------------- |
| 200  | OK - Успішний запит             |
| 201  | Created - Ресурс створено       |
| 400  | Bad Request - Помилка валідації |
| 404  | Not Found - Ресурс не знайдено  |
| 409  | Conflict - Дублікат ресурсу     |
| 500  | Internal Server Error           |

---

## 🧪 Testing Examples

### cURL Examples

```bash
# Отримати всі продукти
curl -X GET http://localhost:3000/api/products

# Отримати продукт за ID
curl -X GET http://localhost:3000/api/products/1

# Створити новий продукт (ID генерується автоматично)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"description":"Test description"}'

# Повністю оновити продукт (PUT)
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","price":199.99,"description":"Updated description"}'

# Частково оновити продукт (PATCH)
curl -X PATCH http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price":149.99}'

# Видалити продукт
curl -X DELETE http://localhost:3000/api/products/1
```
