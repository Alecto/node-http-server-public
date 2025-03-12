# 1. Створення базової структури директорій
git add src/
git commit -m "Feat(structure): create basic project structure with MVC pattern"

# 2. Перенесення конфігурації
git add src/config/
git commit -m "Feat(config): move configuration to separate directory"

# 3. Перенесення моделей
git add src/models/
git commit -m "Feat(models): move todos model from data.mjs to models directory"

# 4. Перенесення утиліт
git add src/utils/
git commit -m "Feat(utils): create utility modules for templates, logging and request handling"

# 5. Перенесення контролерів
git add src/controllers/
git commit -m "Feat(controllers): move API logic from api.mjs to separate controllers"

# 6. Додавання маршрутизації
git add src/routes/
git commit -m "Feat(routes): create router for handling request routing"

# 7. Додавання middleware
git add src/middleware/
git commit -m "Feat(middleware): add error handling middleware"

# 8. Перенесення шаблонів
git add src/views/
git commit -m "Feat(views): move HTML templates to views directory"

# 9. Створення головного файлу сервера
git add src/server.mjs
git commit -m "Feat(server): create main server file with proper error handling"

# 10. Оновлення головного файлу
git add index.mjs
git commit -m "Refactor(index): update entry point to use new structure"

# 11. Оновлення конфігураційних файлів
git add package.json .env
git commit -m "Chore(config): update package.json and environment variables"

# 12. Оновлення документації
git add README.md
git commit -m "Docs(readme): update documentation with new project structure"

# 13. Видалення старих файлів
git rm api.mjs data.mjs
git commit -m "Refactor(cleanup): remove old files after restructuring"

# 14. Виправлення кодування
git add src/controllers/
git commit -m "Fix(encoding): add UTF-8 charset to Content-Type headers"

Write-Host "All commits completed successfully!" 
