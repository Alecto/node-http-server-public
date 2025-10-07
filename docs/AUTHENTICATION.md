# 🔐 Authentication Documentation

> **Швидкий старт:** Якщо потрібні покрокові інструкції налаштування, див. [AUTH_SETUP.md](AUTH_SETUP.md)

## Огляд

Проект використовує **Auth0** для автентифікації користувачів з підтримкою OAuth 2.0 провайдерів (Google, GitHub тощо). Реалізовано два типи автентифікації:

- **Session-based** (Cookie) - для веб-інтерфейсу
- **JWT tokens** - для REST API

## Технологічний стек

- **Auth0** - OAuth 2.0 провайдер
- **express-openid-connect** - Auth0 SDK для Express
- **jsonwebtoken** - JWT токени для API
- **MongoDB** - зберігання профілів користувачів

---

## 🚀 Налаштування Auth0

### 1. Створення Auth0 додатку

1. Зареєструйтесь на [Auth0](https://auth0.com/)
2. Створіть новий Application (Regular Web Application)
3. Налаштуйте Social Connections (Google, GitHub)
4. Скопіюйте credentials

### 2. Налаштування Callback URLs

У налаштуваннях Auth0 додатку:

**Allowed Callback URLs:**

```
http://localhost:3000/auth/callback
```

**Allowed Logout URLs:**

```
http://localhost:3000
```

**Allowed Web Origins:**

```
http://localhost:3000
```

### 3. Змінні оточення

Додайте в `.env` файл:

```ini
# Auth0 конфігурація
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=generate_random_secret_32_characters_min

# JWT конфігурація
JWT_SECRET=another_random_secret_for_jwt_tokens
JWT_EXPIRES_IN=7d

# Session конфігурація
SESSION_SECRET=session_secret_random_string
SESSION_MAX_AGE=86400000
```

**Генерація секретів:**

```bash
# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Linux/Mac
openssl rand -base64 32
```

---

## 📋 Модель користувача

Користувачі зберігаються в MongoDB:

```javascript
{
  auth0Id: String,      // Унікальний ID від Auth0 (provider|id)
  email: String,        // Email користувача
  name: String,         // Ім'я користувача
  picture: String,      // URL аватара
  provider: String,     // Провайдер (google-oauth2, github, auth0, etc.)
  lastLogin: Date,      // Час останнього входу
  isActive: Boolean,    // Статус активності
  createdAt: Date,      // Дата реєстрації
  updatedAt: Date       // Дата останнього оновлення
}
```

---

## 🌐 Веб-автентифікація (Session-based)

### Роути автентифікації

| Роут                 | Опис                                |
| -------------------- | ----------------------------------- |
| `GET /auth/login`    | Редирект на Auth0 для входу         |
| `GET /auth/logout`   | Вихід з системи                     |
| `GET /auth/callback` | Callback після автентифікації       |
| `GET /auth/profile`  | Профіль користувача (потрібна auth) |

### Використання в контролерах

```javascript
import { requireAuth } from '../middleware/auth.mjs'

// Захищений роут
router.get('/protected', requireAuth, (req, res) => {
  // req.oidc.user містить інформацію про користувача
  const user = req.oidc.user
  res.render('protected', { user })
})
```

### Використання в EJS шаблонах

```ejs
<% if (isAuthenticated) { %>
  <p>Вітаємо, <%= user.name %>!</p>
  <a href='/auth/logout'>Вийти</a>
<% } else { %>
  <a href='/auth/login'>Увійти</a>
<% } %>
```

---

## 🔌 API автентифікація (JWT)

### Отримання JWT токена

**1. Авторизуйтесь через веб-інтерфейс:**

```
http://localhost:3000/auth/login
```

**2. Отримайте JWT токен:**

```bash
curl -X GET http://localhost:3000/auth/api/token \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

**Відповідь:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d",
    "tokenType": "Bearer"
  },
  "message": "JWT токен успішно згенеровано"
}
```

### Використання JWT токена

**Приклад запиту з токеном:**

```bash
# GET запит
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# POST запит
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "price": 99.99,
    "description": "Product description"
  }'

# PUT запит
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Product",
    "price": 149.99,
    "description": "Updated description"
  }'

# DELETE запит
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JWT Middleware

```javascript
import { verifyJWT, optionalJWT } from '../middleware/auth.mjs'

// Обов'язкова автентифікація
router.post('/api/products', verifyJWT, createProduct)

// Опціональна автентифікація
router.get('/api/products', optionalJWT, getProducts)
```

---

## 🛡️ Захист роутів

### Веб-роути (захищені session)

- `GET /products/new` - форма створення (потрібна auth)
- `POST /products` - створення продукту (потрібна auth)
- `GET /products/:id/edit` - форма редагування (потрібна auth)
- `PUT /products/:id` - оновлення продукту (потрібна auth)
- `DELETE /products/:id` - видалення продукту (потрібна auth)

### API роути (захищені JWT)

- `POST /api/products` - створення продукту (потрібен JWT)
- `PUT /api/products/:id` - повне оновлення (потрібен JWT)
- `PATCH /api/products/:id` - часткове оновлення (потрібен JWT)
- `DELETE /api/products/:id` - видалення (потрібен JWT)

### Публічні роути (без auth)

- `GET /` - головна сторінка
- `GET /products` - список продуктів
- `GET /products/:id` - деталі продукту
- `GET /api/products` - API список продуктів
- `GET /api/products/:id` - API деталі продукту

---

## 👤 Профіль користувача

### Доступ до профілю

**Веб-інтерфейс:**

```
http://localhost:3000/auth/profile
```

**API:**

```bash
# З session
curl -X GET http://localhost:3000/auth/api/me \
  -H "Cookie: YOUR_SESSION_COOKIE"

# З JWT
curl -X GET http://localhost:3000/auth/api/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔧 Налаштування провайдерів

### Google OAuth

1. Перейдіть до [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проект
3. Увімкніть Google+ API
4. Створіть OAuth 2.0 credentials
5. Додайте в Auth0 Dashboard:
   - `Connections` → `Social` → `Google`
   - Вставте Client ID та Client Secret

### GitHub OAuth

1. Перейдіть до [GitHub Developer Settings](https://github.com/settings/developers)
2. Створіть новий OAuth App
3. Налаштуйте Callback URL: `https://YOUR_DOMAIN.auth0.com/login/callback`
4. Додайте в Auth0 Dashboard:
   - `Connections` → `Social` → `GitHub`
   - Вставте Client ID та Client Secret

---

## 🚨 Обробка помилок

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Необхідна автентифікація",
  "message": "Для доступу до цього ресурсу потрібно авторизуватися"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Доступ заборонено",
  "message": "У вас немає прав для виконання цієї дії"
}
```

### Token Expired

```json
{
  "success": false,
  "error": "Токен прострочений",
  "message": "JWT токен більше не дійсний. Будь ласка, отримайте новий токен"
}
```

---

## 🔒 Безпека

### Рекомендації

1. **Ніколи не комітьте `.env` файл** в Git
2. **Використовуйте сильні секрети** (мінімум 32 символи)
3. **HTTPS в продакшні** - обов'язково
4. **Регулярно оновлюйте токени** - встановіть короткий термін дії
5. **Rate limiting** - обмежте кількість запитів
6. **Валідація даних** - завжди валідуйте вхідні дані

### Реалізовані заходи безпеки

✅ **JWT токени з строгою валідацією:**

- Перевірка `issuer` та `audience`
- Валідація обов'язкових полів (`userId`, `email`)
- Максимальна довжина токена (2048 символів)
- Clock tolerance для синхронізації часу

✅ **Захист сесій:**

- `express-openid-connect` автоматично налаштовує безпечні cookies
- `httpOnly: true` (недоступні через JavaScript)
- `sameSite: 'Lax'` (захист від CSRF атак)
- `secure: true` для HTTPS в продакшні (автоматично)

✅ **Валідація конфігурації:**

- Перевірка довжини секретів (мінімум 32 символи)
- Обов'язковий HTTPS в продакшні
- Попередження про дефолтні значення

✅ **Захист від атак:**

- Bearer token regex валідація
- Обмеження довжини токенів
- Безпечне логування (без токенів)

### Змінні для продакшну

```ini
# Продакшн URL (HTTPS!)
AUTH0_BASE_URL=https://your-domain.com

# Термін дії токенів (короткий для безпеки)
JWT_EXPIRES_IN=1h

# Термін дії session (1 година)
SESSION_MAX_AGE=3600000

# Сильні секрети (генеруйте нові!)
AUTH0_SECRET=your_strong_32_char_secret_here
JWT_SECRET=another_strong_32_char_secret
SESSION_SECRET=session_strong_32_char_secret

# Середовище
NODE_ENV=production
```

---

## 📊 Моніторинг

### Логи автентифікації

Всі спроби входу логуються:

```javascript
logger.info('Auth0 callback отримано', {
  auth0Id: user.sub,
  email: user.email
})

logger.info('JWT токен згенеровано', {
  userId: user._id,
  email: user.email
})
```

### Перегляд користувачів

```bash
# Отримати список всіх користувачів (потрібен JWT)
curl -X GET http://localhost:3000/auth/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🧪 Тестування

### Тестування веб-автентифікації

1. Відкрийте `http://localhost:3000`
2. Натисніть "Увійти"
3. Виберіть провайдера (Google/GitHub)
4. Після входу перевірте профіль `/auth/profile`

### Тестування API з JWT

```bash
# 1. Отримайте токен через веб-інтерфейс
# 2. Використовуйте токен в API запитах

export JWT_TOKEN="your_token_here"

# Тестуємо створення продукту
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "description": "Test description"
  }'
```

---

## 📚 Корисні посилання

- [Auth0 Documentation](https://auth0.com/docs)
- [express-openid-connect](https://github.com/auth0/express-openid-connect)
- [JWT.io](https://jwt.io/)
- [OAuth 2.0](https://oauth.net/2/)
