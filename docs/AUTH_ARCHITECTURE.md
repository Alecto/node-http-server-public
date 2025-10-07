# 🏗️ Архітектура автентифікації (Hybrid Auth)

> **TL;DR:** Auth0 для входу → Власні JWT токени для API

---

## Швидкий огляд

```
┌─────────────┐
│  Користувач │
└──────┬──────┘
       │
       │ 1️⃣ Натискає "Увійти"
       ▼
┌─────────────┐
│   Auth0     │ ◄── OAuth 2.0 (Google, GitHub)
└──────┬──────┘
       │
       │ 2️⃣ Повертає дані користувача
       ▼
┌──────────────────────┐
│  Express Server      │
│  - Зберігає user в   │
│    MongoDB           │
│  - Генерує ВЛАСНИЙ   │
│    JWT токен         │
└──────┬───────────────┘
       │
       │ 3️⃣ Повертає токен клієнту
       ▼
┌─────────────┐
│  API Запити │ ◄── Authorization: Bearer TOKEN
└─────────────┘
```

---

## Чому власні токени?

| Критерій           | Auth0 токени        | Власні токени ✅     |
| ------------------ | ------------------- | -------------------- |
| **API limits**     | Витрачається квота  | Без обмежень         |
| **Залежність**     | Auth0 API           | Локальна верифікація |
| **Гнучкість**      | Фіксована структура | Повний контроль      |
| **Продуктивність** | Додаткові запити    | Швидка верифікація   |
| **Вартість**       | Може бути дорого    | Безкоштовно          |

---

## Як це працює

### Крок 1: Вхід через Auth0

```javascript
// Користувач натискає "Увійти"
GET / auth / login

// Auth0 обробляє OAuth
// Повертає на callback з даними користувача
GET / auth / callback
```

### Крок 2: Збереження в MongoDB

```javascript
// src/server.mjs - middleware
if (req.oidc.isAuthenticated()) {
  const user = await UserModel.findOneAndUpdate(
    { auth0Id: auth0User.sub },
    { email, name, picture, lastLogin: new Date() },
    { upsert: true, new: true }
  )
}
```

### Крок 3: Генерація власного JWT

```javascript
// src/middleware/auth.mjs
export const generateJWT = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      auth0Id: user.auth0Id
    },
    JWT_SECRET, // НАШ секрет, не Auth0!
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'node-products-server',
      audience: 'node-products-api'
    }
  )
}
```

### Крок 4: Використання токена

```bash
# Отримати токен
GET /auth/api/token

# Використати для API
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/products
```

---

## Файли з реалізацією

| Файл                                 | Що робить                             |
| ------------------------------------ | ------------------------------------- |
| `src/config/auth.mjs`                | Конфігурація Auth0 та JWT             |
| `src/middleware/auth.mjs`            | Верифікація та генерація токенів      |
| `src/controllers/authController.mjs` | Ендпоінти для токенів                 |
| `src/server.mjs`                     | Middleware синхронізації користувачів |

---

## FAQ

### Чи безпечно це?

✅ **Так!** Токени підписані секретним ключем і мають термін дії. Стандартна практика для багатьох додатків.

### Чи можна використовувати токени Auth0?

✅ **Так**, але для цього потрібно:

- Встановити `jwks-rsa`
- Змінити верифікацію на перевірку через Auth0 JWKS endpoint
- Витрачати квоту Auth0 на кожен запит

Для більшості випадків власні токени - краще рішення.

### Як оновити токен?

Просто зробіть новий запит до `/auth/api/token` (якщо сесія ще активна).

### Як скасувати всі токени?

Змініть `JWT_SECRET` у `.env` - всі старі токени стануть недійсними.

---

## Посилання

- 📖 [Повна документація](AUTHENTICATION.md)
- 🚀 [Швидке налаштування](AUTH_SETUP.md)
- 🔧 [Конфігурація](CONFIG.md)

---

**Створено:** Для навчального проекту Node.js Express Products Server  
**Модель:** Hybrid Authentication (Auth0 + Custom JWT)
