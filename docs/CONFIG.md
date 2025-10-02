# Конфігурація середовища (mongoose-migration)

## Основні змінні

```ini
# Сервер
APP_PORT=3000
APP_HOST=0.0.0.0
NODE_ENV=development

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

## Поради

- Для production встановіть `MONGOOSE_AUTO_INDEX=false` та керуйте індексами через `ProductModel.syncIndexes()`/`db.createIndex`
- Використовуйте окремі `.env` для dev/test/prod середовищ
- Для локального запуску можна використовувати `mongodb://127.0.0.1:27017/`
