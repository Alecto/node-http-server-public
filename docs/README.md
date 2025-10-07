# 📚 Documentation Index

Ласкаво просимо до документації Node.js Express Products Server!

## 📋 Документи

### 🔐 [Authentication](AUTHENTICATION.md)

Документація автентифікації та авторизації:

- **[Архітектура Hybrid Auth](AUTH_ARCHITECTURE.md)** - швидкий огляд моделі автентифікації 🆕
- Налаштування Auth0 ([швидкий старт](AUTH_SETUP.md))
- OAuth 2.0 провайдери (Google, GitHub)
- Session-based автентифікація для веб
- JWT токени для API (власні, не Auth0)
- Захист роутів
- Профіль користувача

### 🚀 [API Documentation](API.md)

Повна документація REST API з прикладами запитів та відповідей:

- Ендпоінти для CRUD операцій
- HTTP статус коди
- JSON структури
- cURL приклади для тестування
- Автентифікація API запитів

### 🏗️ [Architecture](ARCHITECTURE.md)

Архітектура та структура проекту:

- MVC патерн
- Структура каталогів
- Потік даних
- Технічний стек
- Принципи дизайну
- Автентифікація та авторизація

### 📝 [Logging](LOGGING.md)

Система логування та діагностики:

- Рівні логування (error, warn, info, debug)
- Налаштування через змінні оточення
- Фільтрація технічних запитів
- Що логується на різних рівнях
- Рекомендації для development/production

### ⚙️ [Configuration](CONFIG.md)

Налаштування змінних оточення:

- Конфігурація сервера
- MongoDB підключення
- Рівні логування

### 🚀 Deployment

Керівництва з розгортання в продакшн:

#### [Vercel + GitLab](VERCEL.md)

Повна інструкція деплою через GitLab на Vercel:

- Підключення GitLab до Vercel
- Налаштування Environment Variables
- Конфігурація Auth0 для production
- Auto-deploy при push
- Custom domains
- Troubleshooting та моніторинг

#### [Загальні інструкції](DEPLOYMENT.md)

- Docker контейнеризація
- PM2 process manager
- Nginx reverse proxy
- Security considerations

### 🧪 [Testing](TESTING.md)

### 🔄 [Migration](MIGRATION.md)

Керівництво з тестування:

- Manual testing інструкції
- cURL команди для API
- Чеклісти для тестування
- Automated testing приклади

## 🔗 Швидкі посилання

- 🏠 [Головна документація](../README.md)
- 🚀 [Швидке налаштування Auth0](AUTH_SETUP.md) - покрокові інструкції
- 📚 [Навчальне завдання](../TASK.md)
- 📦 [package.json](../package.json)
- 💻 [Вихідний код](../src/)

## 📝 Примітки

Ця документація створена для навчальних цілей та демонстрації кращих практик документування проектів.
