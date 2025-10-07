# 🚀 Швидке налаштування Auth0

> **Швидкий старт:** Покрокові інструкції для налаштування автентифікації Auth0 в проекті.
>
> Для детальної технічної документації див. [AUTHENTICATION.md](AUTHENTICATION.md)

## 📝 Крок 1: Створення Auth0 акаунту

1. Перейдіть на [auth0.com](https://auth0.com/)
2. Натисніть **"Sign Up"**
3. Виберіть **"Personal"** для безкоштовного плану
4. Підтвердіть email

## 🔧 Крок 2: Створення додатку

1. В Auth0 Dashboard перейдіть до **Applications → Applications**
2. Натисніть **"Create Application"**
3. Введіть назву: `Node Products Server`
4. Виберіть **"Regular Web Applications"**
5. Натисніть **"Create"**

## ⚙️ Крок 3: Налаштування додатку

### Settings

В розділі **Settings** знайдіть та скопіюйте:

- **Domain** - ваш Auth0 домен (наприклад: `dev-xxxxx.auth0.com`)
- **Client ID** - унікальний ідентифікатор клієнта
- **Client Secret** - секретний ключ (натисніть "Show" щоб побачити)

### Application URIs

Прокрутіть вниз до **Application URIs** та додайте:

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

**Allowed Origins (CORS):**

```
http://localhost:3000
```

Натисніть **"Save Changes"** внизу сторінки!

## 👥 Крок 4: Налаштування соціальних провайдерів

### Google OAuth

1. Перейдіть до **Authentication → Social**
2. Знайдіть **Google** та натисніть на нього
3. Увімкніть перемикач (toggle)
4. Натисніть **"Save"**

> Auth0 надає тестові Google credentials для розробки

### GitHub OAuth

1. В розділі **Authentication → Social**
2. Знайдіть **GitHub** та натисніть на нього
3. Увімкніть перемикач (toggle)
4. Натисніть **"Save"**

> Auth0 надає тестові GitHub credentials для розробки

## 🔐 Крок 5: Налаштування змінних оточення

Створіть файл `.env` в корені проекту (якщо його ще немає):

```ini
# Сервер
APP_PORT=3000
APP_HOST=0.0.0.0
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=atlas-products

# Auth0 (замініть на свої значення)
AUTH0_ISSUER_BASE_URL=https://YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=your_client_id_here
AUTH0_CLIENT_SECRET=your_client_secret_here
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=використайте_команду_нижче_для_генерації

# JWT
JWT_SECRET=використайте_команду_нижче_для_генерації
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=використайте_команду_нижче_для_генерації
SESSION_MAX_AGE=86400000

# Mongoose
MONGOOSE_AUTO_INDEX=true
MONGOOSE_MAX_POOL_SIZE=20
```

## 🔑 Крок 6: Генерація секретів

### Windows (PowerShell)

```powershell
# Генерація одного секрету
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Або базовий варіант
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Linux/Mac (Terminal)

```bash
# Генерація одного секрету
openssl rand -base64 32

# Або альтернатива
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Згенеруйте 3 різні секрети для:**

- `AUTH0_SECRET`
- `JWT_SECRET`
- `SESSION_SECRET`

## ✅ Крок 7: Встановлення залежностей

```bash
# Якщо ще не встановлені
yarn install
```

## 🚀 Крок 8: Запуск сервера

```bash
# Запустіть сервер
yarn dev

# Або в продакшн режимі
yarn start
```

## 🧪 Крок 9: Тестування

1. Відкрийте браузер: `http://localhost:3000`
2. Натисніть кнопку **"Увійти"**
3. Виберіть провайдера (Google або GitHub)
4. Дозвольте доступ до вашого акаунту
5. Після успішного входу ви побачите свій профіль в навігації

## 📱 Тестування API з JWT

```bash
# 1. Увійдіть через веб-інтерфейс (крок 9)

# 2. Отримайте JWT токен (у браузері або через curl з cookies)
# Відкрийте в браузері:
http://localhost:3000/auth/api/token

# Або через curl (замініть YOUR_SESSION_COOKIE на реальне значення з браузера)
curl -X GET http://localhost:3000/auth/api/token \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"

# 3. Збережіть отриманий токен
export JWT_TOKEN="ваш_токен_тут"

# 4. Використовуйте токен для API запитів
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "description": "Created via API with JWT"
  }'
```

## ❓ Поширені проблеми

### Помилка: "Callback URL mismatch"

**Рішення:** Переконайтеся, що в Auth0 налаштуваннях додано правильний callback URL:

```
http://localhost:3000/auth/callback
```

### Помилка: "Invalid state"

**Рішення:**

1. Очистіть cookies браузера
2. Перезапустіть сервер
3. Спробуйте увійти знову

### Помилка: "unauthorized_client"

**Рішення:**

1. Перевірте що `AUTH0_CLIENT_ID` та `AUTH0_CLIENT_SECRET` правильні
2. Переконайтеся що немає зайвих пробілів в `.env`
3. Перезапустіть сервер після зміни `.env`

### Помилка підключення до MongoDB

**Рішення:**

1. Перевірте `MONGODB_URI` в `.env`
2. Переконайтеся що ваш IP додано в MongoDB Atlas Network Access
3. Перевірте що пароль не містить спеціальних символів (або закодуйте їх)

## 📚 Додаткова інформація

- Повна документація: [AUTHENTICATION.md](AUTHENTICATION.md)
- API документація: [API.md](API.md)
- Архітектура: [ARCHITECTURE.md](ARCHITECTURE.md)

## 🎉 Готово!

Тепер ваш сервер працює з повноцінною автентифікацією через Auth0!

**Що тепер можна робити:**

- ✅ Входити через Google або GitHub
- ✅ Переглядати свій профіль
- ✅ Створювати/редагувати/видаляти продукти (тільки авторизовані користувачі)
- ✅ Використовувати API з JWT токенами
- ✅ Гості можуть переглядати продукти без входу

---

**Потрібна допомога?** Перегляньте детальну документацію в папці `docs/`
