import { Router } from 'express'
import {
  getProducts,
  getProduct,
  getNewProductForm,
  getEditProductForm,
  createProduct,
  updateProductHandler,
  deleteProductHandler
} from '../../controllers/productController.mjs'

const router = Router()

// /products - колекція продуктів
router
  .route('/')
  .get(getProducts) // GET /products - список продуктів
  .post(createProduct) // POST /products - створення продукту

// /products/new - форма створення (має бути ПЕРЕД /:id)
router.get('/new', getNewProductForm)

// /products/:id - конкретний продукт
router
  .route('/:id')
  .get(getProduct) // GET /products/:id - деталі продукту
  .put(updateProductHandler) // PUT /products/:id - оновлення продукту
  .delete(deleteProductHandler) // DELETE /products/:id - видалення продукту

// /products/:id/edit - форма редагування
router.get('/:id/edit', getEditProductForm)

export default router
