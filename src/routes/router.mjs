import { getHomePage } from '../controllers/pageController.mjs'
import {
  // HTML Web endpoints
  getProducts,
  getProduct,
  getNewProductForm,
  getEditProductForm,
  createProduct,
  updateProductHandler,
  deleteProductHandler,
  // JSON API endpoints
  getProductsAPI,
  getProductAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI
} from '../controllers/productController.mjs'
import * as logger from '../utils/logger.mjs'

// Налаштування маршрутів для Express
export const setupRoutes = (app) => {
  // Логування запитів
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`)
    next()
  })

  // Головна сторінка
  app.get('/', getHomePage)

  // ============ JSON API ROUTES (/api) ============
  // RESTful API з правильними HTTP методами та JSON відповідями

  // GET /api/products - отримати всі продукти
  app.get('/api/products', getProductsAPI)

  // GET /api/products/:id - отримати продукт за ID
  app.get('/api/products/:id', getProductAPI)

  // POST /api/products - створити новий продукт
  app.post('/api/products', createProductAPI)

  // PUT /api/products/:id - оновити продукт
  app.put('/api/products/:id', updateProductAPI)

  // DELETE /api/products/:id - видалити продукт
  app.delete('/api/products/:id', deleteProductAPI)

  // ============ HTML WEB ROUTES ============
  // Web інтерфейс з HTML сторінками

  // READ - список всіх продуктів
  app.get('/products', getProducts)

  // CREATE - форма для нового продукту (повинна бути ПЕРЕД :id маршрутом)
  app.get('/products/new', getNewProductForm)

  // READ - один продукт за ID
  app.get('/products/:id', getProduct)

  // CREATE - створення нового продукту
  app.post('/products', createProduct)

  // UPDATE - форма редагування продукту
  app.get('/products/:id/edit', getEditProductForm)

  // UPDATE - оновлення продукту
  app.put('/products/:id', updateProductHandler)

  // DELETE - видалення продукту
  app.delete('/products/:id', deleteProductHandler)

  // Підтримка старих маршрутів для сумісності
  app.get('/form', (req, res) => res.redirect('/products/new'))

  // 404 middleware для всіх інших маршрутів
  app.use((req, res) => {
    logger.log(`Сторінку не знайдено: ${req.originalUrl}`)
    res.status(404).render('404')
  })
}
