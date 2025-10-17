# Deployment на Vercel

Повна інструкція з deploy Node.js HTTP сервера з Auth0 на Vercel.

---

## 📋 Передумови

- GitLab репозиторій з проектом
- Обліковий запис Vercel (https://vercel.com)
- Обліковий запис Auth0 (https://auth0.com)
- MongoDB Atlas кластер

---

## 🚀 Крок 1: Підготовка проекту

### 1.1 Створіть serverless function wrapper

Створіть файл `api/index.mjs`:

```javascript
// Vercel Serverless Function wrapper
export { default } from '../index.mjs'
```

### 1.2 Оновіть `index.mjs`

```javascript
/*
 ? Головний файл для запуску сервера
*/

import { app, startServer } from './src/server.mjs'

// Для локального запуску
if (process.env.VERCEL !== '1') {
  startServer()
}

// Для Vercel serverless - експортуємо app
// Ініціалізація відбувається автоматично через middleware при першому запиті
export default app
```

**💡 Як це працює на Vercel:**

Для serverless environment на Vercel проект використовує **lazy initialization** стратегію:

- MongoDB підключення ініціалізується автоматично при першому HTTP запиті
- Middleware в `src/server.mjs` перевіряє чи застосунок ініціалізований
- Якщо ні - підключається до MongoDB, синхронізує індекси та валідує Auth0
- Наступні запити використовують вже існуюче підключення

**Оптимізації для serverless:**

- ⚡ **Збільшені timeout** - 15 секунд замість 10 для підключення до MongoDB
- 🔄 **Автоматичний retry** - повторна спроба при невдалому підключенні
- 🛡️ **Graceful degradation** - сайт працює навіть при тимчасових проблемах з БД
- 📊 **Менший connection pool** - максимум 5 з'єднань для serverless
- 🔍 **М'яка валідація** - warning замість error для non-critical проблем
- ✅ **Перевірка стану** - очікування завершення підключення якщо воно в процесі

Це забезпечує:

- ✅ Швидший холодний старт serverless function
- ✅ Стабільність при проблемах з підключенням
- ✅ Правильну роботу з MongoDB connection pooling
- ✅ Відсутність false-positive помилок у логах

### 1.3 Створіть `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.mjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.mjs"
    }
  ]
}
```

---

## 🔗 Крок 2: Підключення GitLab до Vercel

### 2.1 Імпорт проекту

1. Відкрийте https://vercel.com/new
2. Виберіть **"Import Git Repository"**
3. Якщо GitLab не підключений:
   - Клікніть **"Add GitLab Account"**
   - Авторизуйтесь у GitLab
   - Надайте доступ Vercel
4. Виберіть ваш репозиторій зі списку
5. Клікніть **"Import"**

### 2.2 Налаштування проекту

1. **Project Name**: залиште за замовчуванням або змініть
2. **Framework Preset**: Other (автоматично визначиться)
3. **Root Directory**: `./` (корінь проекту)
4. **Build Command**: залиште порожнім
5. **Output Directory**: залиште порожнім

⚠️ **НЕ натискайте Deploy!** Спочатку налаштуйте Environment Variables.

---

## ⚙️ Крок 3: Налаштування Environment Variables

### 3.1 У Vercel Dashboard

Перейдіть: **Settings** → **Environment Variables**

Додайте такі змінні (для **All Environments**):

#### MongoDB:

```
MONGODB_URI=mongodb+srv://ваш_URI
DB_NAME=ваша_база
MAIN_DB_ROOT_USER=ваш_користувач
MAIN_DB_ROOT_PASS=ваш_пароль
MONGO_PORT=27017
MONGOOSE_AUTO_INDEX=true
MONGOOSE_MAX_POOL_SIZE=10
MONGODB_AUTH_SOURCE=admin
```

#### Auth0:

```
AUTH0_ENABLED=true
AUTH0_ISSUER_BASE_URL=https://ваш_домен.auth0.com
AUTH0_CLIENT_ID=ваш_client_id
AUTH0_CLIENT_SECRET=ваш_secret
AUTH0_BASE_URL=https://node-http-server.vercel.app
AUTH0_SECRET=випадковий_рядок_32+_символи
```

💡 **Згенеруйте Auth0 Secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### JWT & Session:

```
JWT_SECRET=випадковий_рядок_32+_символи
JWT_EXPIRES_IN=7d
SESSION_SECRET=випадковий_рядок_32+_символи
SESSION_MAX_AGE=86400000
```

#### Інше:

```
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
APP_PORT=3000
APP_HOST=0.0.0.0
```

### 3.2 Отримайте Production Domain

Після додавання змінних:

1. Перейдіть: **Settings** → **Domains**
2. Скопіюйте ваш production domain (наприклад, `https://node-http-server.vercel.app`)

⚠️ **Це важливо для наступного кроку!**

---

## 🔐 Крок 4: Налаштування Auth0

### 4.1 Відкрийте Auth0 Dashboard

1. Перейдіть: https://manage.auth0.com
2. **Applications** → ваш Application → **Settings**

### 4.2 Додайте Vercel URLs

**Application Login URI:**

```
https://node-http-server.vercel.app
```

**Allowed Callback URLs:**

```
http://localhost:3000/auth/callback,
https://node-http-server.vercel.app/auth/callback
```

**Allowed Logout URLs:**

```
http://localhost:3000,
https://node-http-server.vercel.app
```

**Allowed Web Origins:**

```
http://localhost:3000,
https://node-http-server.vercel.app
```

### 4.3 Збережіть зміни

Прокрутіть вниз і клікніть **"Save Changes"**.

---

## 🚀 Крок 5: Deploy

### 5.1 Встановіть Vercel CLI (опціонально)

```bash
# Yarn (рекомендовано)
yarn global add vercel

# Або npm
npm install -g vercel
```

### 5.2 Залогіньтесь

```bash
vercel login
```

### 5.3 Deploy

#### Через CLI (рекомендовано):

```bash
# Переконайтесь що ви на правильній гілці
git checkout feature/auth0-authentication

# Deploy на production
vercel --prod
```

#### Через Dashboard:

1. Vercel Dashboard → ваш проект → **Deployments**
2. Клікніть **"Deploy"** → виберіть гілку
3. Або зробіть `git push` і Vercel автоматично задеплоїть

---

## ✅ Крок 6: Перевірка

### 6.1 Відкрийте Production URL

```
https://node-http-server.vercel.app
```

### 6.2 Перевірте функціональність

- ✅ Головна сторінка завантажується
- ✅ Кнопка "Увійти через Auth0" працює
- ✅ Після логіну показується профіль користувача
- ✅ CRUD операції з продуктами працюють
- ✅ MongoDB підключення успішне

### 6.3 Перегляд логів

```bash
# Через CLI
vercel logs https://node-http-server.vercel.app

# Або у Dashboard
vercel.com → проект → Deployments → клік на deployment → Runtime Logs
```

---

## 🔄 Автоматичний Deploy

### Git Push Deploy

Після першого deploy, Vercel автоматично створює deployment при кожному push:

```bash
git add .
git commit -m "Feat: оновлення функціоналу"
git push origin feature/auth0-authentication
```

Vercel автоматично:

1. Отримає webhook від GitLab
2. Створить новий deployment
3. Після успішної збірки оновить production

---

## 📊 Моніторинг

### Vercel Dashboard

- **Analytics**: статистика відвідувачів
- **Speed Insights**: метрики швидкості
- **Logs**: runtime та build логи
- **Deployments**: історія всіх deploy

### Корисні команди CLI

```bash
# Інспектувати deployment
vercel inspect node-http-server.vercel.app

# Переглянути логи в реальному часі
vercel logs node-http-server.vercel.app --follow

# Список всіх deployments
vercel list

# Видалити deployment
vercel remove [deployment-url]
```

---

## 🌐 Custom Domain (опціонально)

### Додавання власного домену

1. Vercel Dashboard → **Settings** → **Domains**
2. Клікніть **"Add"**
3. Введіть ваш домен (наприклад, `myshop.com`)
4. Налаштуйте DNS записи у вашого domain provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Після верифікації оновіть Auth0 URLs з новим доменом

---

## ❌ Troubleshooting

### Помилка: "Serverless Function has crashed"

**Причина:** MongoDB не підключився або відсутні Environment Variables

**Рішення:**

1. Перевірте логи: `vercel logs [url]`
2. Переконайтесь що `MONGODB_URI` правильний
3. Перевірте чи всі Environment Variables додані
4. Redeploy: `vercel --prod`

### Помилка: Auth0 "Callback URL mismatch"

**Причина:** URL не додано в Auth0 Settings

**Рішення:**

1. Auth0 Dashboard → Application → Settings
2. Додайте production URL до Allowed Callback URLs
3. Save Changes
4. Зачекайте 1-2 хвилини

### Показується вихідний код замість сторінки

**Причина:** Неправильна конфігурація `vercel.json` або помилка при ініціалізації

**Рішення:**

1. Переконайтесь що `api/index.mjs` існує
2. Перевірте `vercel.json` конфігурацію
3. `index.mjs` має експортувати `export default app`
4. Перевірте логи: `vercel logs [url]` - шукайте помилки підключення до MongoDB
5. Переконайтесь, що всі Environment Variables правильно налаштовані
6. Redeploy: `vercel --prod`

**💡 Примітка:** Якщо MongoDB не підключається, serverless function все одно повинна запуститися та показати сторінку помилки (не вихідний код). Lazy initialization middleware перехоплює помилки підключення.

### Build успішний, але сайт не працює

**Причина:** Environment Variables не застосувались

**Рішення:**

1. Settings → Environment Variables → перевірте чи всі є
2. Виберіть "Production" environment
3. Save
4. Redeploy: `vercel --prod`

### Попередження про MongoDB у логах

**Приклад логів:**

```
[warn] MongoDB підключення в стані 2, але продовжуємо ініціалізацію
[warn] Не вдалося синхронізувати індекси: connection timed out
```

**Це нормально?** ✅ Так! Такі попередження (warnings) не є критичними помилками:

- `readyState 2` означає "connecting" - підключення в процесі
- Сайт продовжує працювати навіть без повного підключення до БД
- Auth0 автентифікація працює незалежно від MongoDB
- При наступному запиті підключення може встановитися

**Коли треба діяти:**

❌ Якщо бачите **error** (не warning) постійно:

1. Перевірте `MONGODB_URI` в Environment Variables
2. Переконайтесь що IP адреса Vercel дозволена в MongoDB Atlas Network Access
3. Перевірте що MongoDB кластер активний (не в стані paused)

💡 **Порада:** MongoDB Atlas автоматично призупиняє безкоштовні кластери після періоду неактивності. Перший запит після паузи може бути повільним.

---

## 💰 Ціноутворення

### Hobby (Free)

- ✅ 100 GB bandwidth/місяць
- ✅ Необмежена кількість deployments
- ✅ Serverless Functions (100 GB-Hrs)
- ✅ 1 concurrent build
- ❌ Team collaboration
- ❌ Advanced analytics

### Pro ($20/місяць)

- ✅ 1 TB bandwidth
- ✅ Serverless Functions (1,000 GB-Hrs)
- ✅ 12 concurrent builds
- ✅ Team collaboration
- ✅ Advanced analytics
- ✅ Password protection

**Для навчання та демо Hobby плану достатньо!**

---

## 📚 Корисні посилання

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Node.js on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/node-js)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/projects/domains)

---

## ✅ Чеклист для Deploy

- [ ] Створено `api/index.mjs`
- [ ] Оновлено `index.mjs` з export
- [ ] Створено `vercel.json`
- [ ] GitLab підключено до Vercel
- [ ] Додано всі Environment Variables
- [ ] Отримано Production Domain
- [ ] Налаштовано Auth0 URLs
- [ ] Зроблено перший deploy
- [ ] Перевірено функціональність
- [ ] Налаштовано автоматичний deploy

---

**Готово! Ваш Node.js сервер працює на Vercel! 🎉**
