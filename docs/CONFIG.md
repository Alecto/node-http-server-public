# Конфігурація середовища (mongoose-migration)

## Основні змінні

```ini
# Сервер
APP_PORT=3000
APP_HOST=0.0.0.0
NODE_ENV=development

# Логування
LOG_LEVEL=info                     # error, warn, info, debug

# Технічні шляхи для фільтрації логів (опціонально, розділені комами)
# За замовчуванням фільтруються: /.well-known/, /favicon.ico, /robots.txt та інші
# TECHNICAL_PATHS=/.well-known/,/favicon.ico,/custom-path

# MongoDB Atlas / локальна MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/
DB_NAME=atlas-products
MONGOOSE_AUTO_INDEX=true           # Вимикайте у production
MONGOOSE_MAX_POOL_SIZE=20          # Налаштуйте під тариф Atlas

# Альтернативні змінні
MAIN_DB_ROOT_USER=<user>
MAIN_DB_ROOT_PASS=<pass>
MONGODB_AUTH_SOURCE=admin
```

> ⚠️ Замініть `<user>`/`<pass>` на власні креденшали та увімкніть SSL, якщо це вимагає кластер.

## Рівні логування

Система підтримує 4 рівні логування (від найменшого до найбільшого деталізації):

| Рівень  | Опис                      | Коли використовувати           |
| ------- | ------------------------- | ------------------------------ |
| `error` | Тільки критичні помилки   | Production (мінімум логів)     |
| `warn`  | Помилки + попередження    | Production (стандарт)          |
| `info`  | Інформаційні повідомлення | Development (за замовчуванням) |
| `debug` | Детальна діагностика      | Налагодження (всі логи)        |

**Приклади:**

```bash
# Production - тільки попередження та помилки
LOG_LEVEL=warn

# Development - всі важливі події
LOG_LEVEL=info

# Debug - детальна діагностика (включно з технічними 404)
LOG_LEVEL=debug
```

**Що приховується на різних рівнях:**

- `LOG_LEVEL=info` (за замовчуванням) - приховує debug повідомлення (технічні запити браузера до `/.well-known/`, тощо)
- `LOG_LEVEL=warn` - приховує debug та info (запити до сторінок, операції з БД)
- `LOG_LEVEL=error` - показує тільки критичні помилки

## Поради

- Для production встановіть `MONGOOSE_AUTO_INDEX=false` та керуйте індексами через `ProductModel.syncIndexes()`/`db.createIndex`
- Використовуйте окремі `.env` для dev/test/prod середовищ
- Для локального запуску можна використовувати `mongodb://127.0.0.1:27017/`
- Встановіть `LOG_LEVEL=warn` або `LOG_LEVEL=error` у production для зменшення кількості логів
