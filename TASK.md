# 🚀 Завдання: Міграція з Node.js HTTP на Express.js

**Складність:** Середня

**Мета:** Виконати повну міграцію існуючого Node.js HTTP сервера на Express.js фреймворк з розширенням функціональності та заміною сутностей.

---

## 📋 **Базовий проект**

У вас є готовий Node.js HTTP сервер з наступною функціональністю:

### **Поточна реалізація:**

- ✅ Вбудований `http` модуль Node.js
- ✅ Система `todos` (id, title, userId, completed)
- ✅ Базова маршрутизація: `GET /`, `/text`, `/json`, `/todos`, `/form`, `POST /todos`
- ✅ HTML шаблони, логування, парсинг body
- ✅ MVC архітектура

### **Поточні ендпоінти:**

- `GET /` - головна сторінка
- `GET /text` - текстова відповідь
- `GET /json` - JSON відповідь з todos
- `GET /todos` - сторінка зі списком todos
- `GET /form` - форма для додавання todo
- `POST /todos` - додавання нового todo

---

## 🎯 **ЗАВДАННЯ НА МІГРАЦІЮ**

### **Мета міграції:**

Повна міграція з Node.js HTTP модуля на Express.js з розширенням функціональності

### **Основні зміни:**

#### **1. Технологічна міграція:**

- ❌ **Видалити:** Вбудований модуль `http` Node.js
- ✅ **Додати:** Express.js фреймворк
- ✅ **Додати:** EJS template engine (замість статичного HTML)
- ✅ **Додати:** Method Override middleware для PUT/DELETE

#### **2. Зміна сутностей:**

- ❌ **Видалити:** Todos система (id, title, userId, completed)
- ✅ **Створити:** Products система з полями:
  - `id` (number) - унікальний ідентифікатор
  - `name` (string) - назва продукту
  - `price` (number) - ціна в доларах
  - `description` (string) - опис продукту

#### **3. RESTful API ендпоінти:**

**HTML Web Interface:**

- `GET /` - Головна сторінка
- `GET /products` - Список товарів (HTML)
- `GET /products/new` - Форма додавання товару
- `GET /products/:id` - Деталі товару
- `GET /products/:id/edit` - Форма редагування товару
- `POST /products` - Створення товару
- `PUT /products/:id` - Оновлення товару
- `DELETE /products/:id` - Видалення товару

**JSON API:**

- `GET /api/products` - Список товарів (JSON)
- `GET /api/products/:id` - Один товар (JSON)
- `POST /api/products` - Створення товару (JSON)
- `PUT /api/products/:id` - Оновлення товару (JSON)
- `DELETE /api/products/:id` - Видалення товару (JSON)

#### **4. CRUD операції (Create, Read, Update, Delete):**

- ✅ **CREATE** - Додавання нових продуктів
- ✅ **READ** - Перегляд списку та деталей продуктів
- ✅ **UPDATE** - Редагування існуючих продуктів
- ✅ **DELETE** - Видалення продуктів

#### **5. HTTP статус коди:**

- `200` - OK (успішні запити)
- `201` - Created (створення ресурсів)
- `400` - Bad Request (помилки валідації)
- `404` - Not Found (ресурс не знайдено)
- `409` - Conflict (дублікат ресурсу)
- `500` - Internal Server Error

#### **6. Валідація даних:**

- Перевірка типів даних
- Перевірка обов'язкових полів
- Перевірка унікальності ID
- Валідація цін (> 0)

---

## 🎓 **Критерії успішного виконання:**

### **✅ Обов'язкові вимоги:**

1. **Технологічна міграція** - повний перехід на Express.js
2. **Зміна сутностей** - заміна todos на products
3. **CRUD операції** - повна реалізація Create, Read, Update, Delete
4. **RESTful API** - дотримання REST принципів
5. **Dual Interface** - HTML веб-інтерфейс + JSON API
6. **HTTP статус коди** - правильне використання 200, 201, 400, 404, 409, 500
7. **Валідація даних** - перевірка вхідних даних

### **✅ Технічні вимоги:**

- Код працює без помилок
- Всі ендпоінти функціонують
- Дотримано MVC архітектуру
- Використано Express middleware
- Реалізовано обробку помилок

---

## 🧪 **Тестування результату:**

### **Запуск проекту:**

```bash
# Встановити залежності
yarn install

# Запустити в режимі розробки
yarn dev

# Сервер повинен працювати на http://localhost:3000
```

### **Перевірка ендпоінтів:**

```bash
# Тестування JSON API
curl -X GET http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Test","price":99.99,"description":"Test product"}'
curl -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d '{"name":"Updated","price":199.99,"description":"Updated product"}'
curl -X DELETE http://localhost:3000/api/products/6

# Тестування Web Interface
# Відкрити в браузері: http://localhost:3000/products
```

---

## 💡 **Поради для виконання:**

### **🔧 Технічні поради:**

- Почніть з встановлення Express.js: `yarn add express ejs method-override`
- Замініть `http.createServer()` на `express()`
- Використовуйте `app.set('view engine', 'ejs')` для шаблонів
- Додайте `express.urlencoded()` та `express.json()` для парсингу body
- Використовуйте `method-override` для PUT/DELETE в HTML формах

### **📊 Робота з даними:**

- Створіть новий файл `src/models/products.mjs`
- Видаліть старий `src/models/todos.mjs`
- Реалізуйте функції: `getProductById`, `addProduct`, `updateProduct`, `deleteProduct`
- Додайте валідацію для полів продукту

### **🛣️ Маршрутизація:**

- Замініть manual routing на Express router
- Створіть окремі маршрути для HTML та JSON API
- Використовуйте Express параметри `:id` для динамічних маршрутів

### **🎨 Шаблони:**

- Замініть статичний HTML на EJS шаблони
- Створіть шаблони для списку продуктів, форми створення/редагування
- Використовуйте `res.render()` замість `res.end()`

---

## 📁 **Очікувана структура після міграції:**

```
node-http-server/
├── docs/                   # 📚 Документація
├── src/
│   ├── config/            # ⚙️ Конфігурація  
│   ├── controllers/
│   │   ├── pageController.mjs      # HTML сторінки
│   │   └── productController.mjs   # CRUD для products
│   ├── models/
│   │   └── products.mjs           # Модель продуктів
│   ├── routes/            # 🛣️ Модульна маршрутизація
│   │   ├── api/
│   │   │   └── products.mjs       # JSON API роутер
│   │   ├── web/
│   │   │   ├── products.mjs       # Web інтерфейс роутер
│   │   │   └── pages.mjs          # Статичні сторінки
│   │   └── index.mjs              # Головний роутер
│   ├── middleware/
│   │   └── errorHandlers.mjs      # Обробка помилок
│   ├── utils/
│   │   └── logger.mjs             # Логування
│   ├── views/                     # EJS шаблони
│   │   ├── products.ejs
│   │   ├── product-form.ejs
│   │   └── ...
│   └── server.mjs                 # Express сервер
├── index.mjs
├── package.json
└── README.md
```
