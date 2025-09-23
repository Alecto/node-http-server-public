import {
  products,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  productExists,
  getNextId,
  validateProduct
} from '../models/products.mjs'
import * as logger from '../utils/logger.mjs'

// ============ JSON API ENDPOINTS ============

// API: Отримання списку продуктів (JSON)
export const getProductsAPI = (req, res) => {
  try {
    logger.log('API: Отримання списку продуктів')
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error) {
    logger.error('API: Помилка при отриманні списку продуктів:', error)
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    })
  }
}

// API: Отримання одного продукту за ID (JSON)
export const getProductAPI = (req, res) => {
  try {
    const { id } = req.params
    const product = getProductById(id)

    if (!product) {
      logger.log(`API: Продукт з ID ${id} не знайдено`)
      return res.status(404).json({
        success: false,
        error: 'Продукт не знайдено'
      })
    }

    logger.log(`API: Отримання продукту з ID ${id}`)
    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    logger.error('API: Помилка при отриманні продукту:', error)
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    })
  }
}

// API: Створення нового продукту (JSON)
export const createProductAPI = (req, res) => {
  try {
    logger.log('API: Створення нового продукту')

    const { id, name, price, description } = req.body

    const product = {
      id: Number(id),
      name: String(name).trim(),
      price: Number(price),
      description: String(description).trim()
    }

    if (productExists(product.id)) {
      logger.log(`API: Продукт з ID ${product.id} вже існує`)
      return res.status(409).json({
        success: false,
        error: `Продукт з ID ${product.id} вже існує`
      })
    }

    if (!validateProduct(product)) {
      logger.log('API: Невірні дані продукту', product)
      return res.status(400).json({
        success: false,
        error: 'Невірні дані продукту'
      })
    }

    addProduct(product)
    logger.log('API: Продукт успішно створено', product)
    res.status(201).json({
      success: true,
      data: product,
      message: 'Продукт успішно створено'
    })
  } catch (error) {
    logger.error('API: Помилка при створенні продукту:', error)
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    })
  }
}

// API: Оновлення продукту (JSON)
export const updateProductAPI = (req, res) => {
  try {
    const { id } = req.params
    const { name, price, description } = req.body

    logger.log(`API: Оновлення продукту з ID ${id}`)

    const updatedData = {
      name: String(name).trim(),
      price: Number(price),
      description: String(description).trim()
    }

    const tempProduct = { id: Number(id), ...updatedData }
    if (!validateProduct(tempProduct)) {
      logger.log('API: Невірні дані для оновлення продукту', updatedData)
      return res.status(400).json({
        success: false,
        error: 'Невірні дані продукту'
      })
    }

    const updatedProduct = updateProduct(id, updatedData)

    if (!updatedProduct) {
      logger.log(`API: Продукт з ID ${id} не знайдено для оновлення`)
      return res.status(404).json({
        success: false,
        error: 'Продукт не знайдено'
      })
    }

    logger.log('API: Продукт успішно оновлено', updatedProduct)
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Продукт успішно оновлено'
    })
  } catch (error) {
    logger.error('API: Помилка при оновленні продукту:', error)
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    })
  }
}

// API: Видалення продукту (JSON)
export const deleteProductAPI = (req, res) => {
  try {
    const { id } = req.params
    logger.log(`API: Видалення продукту з ID ${id}`)

    const deletedProduct = deleteProduct(id)

    if (!deletedProduct) {
      logger.log(`API: Продукт з ID ${id} не знайдено для видалення`)
      return res.status(404).json({
        success: false,
        error: 'Продукт не знайдено'
      })
    }

    logger.log('API: Продукт успішно видалено', deletedProduct)
    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: 'Продукт успішно видалено'
    })
  } catch (error) {
    logger.error('API: Помилка при видаленні продукту:', error)
    res.status(500).json({
      success: false,
      error: 'Внутрішня помилка сервера'
    })
  }
}

// ============ HTML WEB ENDPOINTS ============

// Отримання списку продуктів
export const getProducts = (req, res) => {
  try {
    logger.log('Отримання списку продуктів')
    res.render('products', { products })
  } catch (error) {
    logger.error('Помилка при отриманні списку продуктів:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}

// Отримання одного продукту за ID
export const getProduct = (req, res) => {
  try {
    const { id } = req.params
    const product = getProductById(id)

    if (!product) {
      logger.log(`Продукт з ID ${id} не знайдено`)
      return res.status(404).render('404')
    }

    logger.log(`Отримання продукту з ID ${id}`)
    res.render('product-detail', { product })
  } catch (error) {
    logger.error('Помилка при отриманні продукту:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}

// Відображення форми для нового продукту
export const getNewProductForm = (req, res) => {
  try {
    logger.log('Відображення форми нового продукту')
    res.render('product-form', {
      product: { id: getNextId() },
      isEdit: false
    })
  } catch (error) {
    logger.error('Помилка при відображенні форми:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}

// Відображення форми редагування продукту
export const getEditProductForm = (req, res) => {
  try {
    const { id } = req.params
    const product = getProductById(id)

    if (!product) {
      logger.log(`Продукт з ID ${id} не знайдено для редагування`)
      return res.status(404).render('404')
    }

    logger.log(`Відображення форми редагування продукту з ID ${id}`)
    res.render('product-form', { product, isEdit: true })
  } catch (error) {
    logger.error('Помилка при відображенні форми редагування:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}

// Створення нового продукту
export const createProduct = (req, res) => {
  try {
    logger.log('Створення нового продукту')

    const { id, name, price, description } = req.body

    const product = {
      id: Number(id),
      name: String(name).trim(),
      price: Number(price),
      description: String(description).trim()
    }

    // Перевірка чи існує продукт з таким ID
    if (productExists(product.id)) {
      logger.log(`Продукт з ID ${product.id} вже існує`)
      return res.status(409).render('product-form', {
        product,
        isEdit: false,
        error: `Продукт з ID ${product.id} вже існує. Виберіть інший ID.`
      })
    }

    if (!validateProduct(product)) {
      logger.log('Невірні дані продукту', product)
      return res.status(400).render('product-form', {
        product,
        isEdit: false,
        error: 'Невірні дані продукту: перевірте всі поля'
      })
    }

    addProduct(product)
    logger.log('Продукт успішно створено', product)
    res.status(201).redirect('/products')
  } catch (error) {
    logger.error('Помилка при створенні продукту:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}

// Оновлення продукту
export const updateProductHandler = (req, res) => {
  try {
    const { id } = req.params
    const { name, price, description } = req.body

    logger.log(`Оновлення продукту з ID ${id}`)

    const updatedData = {
      name: String(name).trim(),
      price: Number(price),
      description: String(description).trim()
    }

    // Валідація оновлених даних
    const tempProduct = { id: Number(id), ...updatedData }
    if (!validateProduct(tempProduct)) {
      const product = getProductById(id)
      logger.log('Невірні дані для оновлення продукту', updatedData)
      return res.status(400).render('product-form', {
        product: { ...product, ...updatedData },
        isEdit: true,
        error: 'Невірні дані продукту: перевірте всі поля'
      })
    }

    const updatedProduct = updateProduct(id, updatedData)

    if (!updatedProduct) {
      logger.log(`Продукт з ID ${id} не знайдено для оновлення`)
      return res.status(404).render('404')
    }

    logger.log('Продукт успішно оновлено', updatedProduct)
    res.redirect('/products')
  } catch (error) {
    logger.error('Помилка при оновленні продукту:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}

// Видалення продукту
export const deleteProductHandler = (req, res) => {
  try {
    const { id } = req.params
    logger.log(`Видалення продукту з ID ${id}`)

    const deletedProduct = deleteProduct(id)

    if (!deletedProduct) {
      logger.log(`Продукт з ID ${id} не знайдено для видалення`)
      return res.status(404).render('404')
    }

    logger.log('Продукт успішно видалено', deletedProduct)
    res.redirect('/products')
  } catch (error) {
    logger.error('Помилка при видаленні продукту:', error)
    res.status(500).send('Внутрішня помилка сервера')
  }
}
