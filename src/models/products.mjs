import { cloneInitialProducts } from '../data/products.mjs'

// Внутрішній стан продуктів (інMemory сторедж)
let products = cloneInitialProducts()

// Функція для отримання продукту за ID
export const getProductById = (id) => {
  return products.find((product) => product.id === parseInt(id))
}

// Функція для отримання всіх продуктів
export const getAllProducts = () => {
  return [...products]
}

// Функція для додавання нового продукту
export const addProduct = (product) => {
  products.push(product)
  return product
}

// Функція для оновлення продукту
export const updateProduct = (id, updatedProduct) => {
  const index = products.findIndex((product) => product.id === parseInt(id))
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct }
    return products[index]
  }
  return null
}

// Функція для повної заміни продукту (PUT)
export const replaceProduct = (id, newProductData) => {
  const index = products.findIndex((product) => product.id === parseInt(id))
  if (index !== -1) {
    products[index] = { ...newProductData, id: products[index].id }
    return products[index]
  }
  return null
}

// Функція для часткового оновлення продукту (PATCH)
export const patchProduct = (id, partialProductData) => {
  const index = products.findIndex((product) => product.id === parseInt(id))
  if (index !== -1) {
    products[index] = { ...products[index], ...partialProductData }
    return products[index]
  }
  return null
}

// Функція для видалення продукту
export const deleteProduct = (id) => {
  const index = products.findIndex((product) => product.id === parseInt(id))
  if (index !== -1) {
    return products.splice(index, 1)[0]
  }
  return null
}

// Функція для перевірки чи існує продукт з таким ID
export const productExists = (id) => {
  return products.some((product) => product.id === parseInt(id))
}

// Функція для генерації наступного ID
export const getNextId = () => {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
}

// Функція для валідації продукту
export const validateProduct = (product) => {
  if (!product) return false

  if (!Number.isInteger(product.id) || Number.isNaN(product.id)) return false
  if (typeof product.name !== 'string' || product.name.trim() === '') return false
  if (!Number.isFinite(product.price) || product.price <= 0) return false
  if (typeof product.description !== 'string' || product.description.trim() === '') return false

  return true
}

// Функція для валідації PATCH оновлень
export const validatePatchProduct = (updates) => {
  if (!updates || typeof updates !== 'object') return false

  if (updates.name === undefined && updates.price === undefined && updates.description === undefined) {
    return false
  }

  if (updates.name !== undefined) {
    if (typeof updates.name !== 'string' || updates.name.trim() === '') return false
  }

  if (updates.price !== undefined) {
    if (!Number.isFinite(updates.price) || updates.price <= 0) return false
  }

  if (updates.description !== undefined) {
    if (typeof updates.description !== 'string' || updates.description.trim() === '') return false
  }

  return true
}

// Функція для валідації PUT оновлень (повна заміна)
export const validatePutProduct = (product) => {
  if (!product) return false

  if (typeof product.name !== 'string' || product.name.trim() === '') return false
  if (!Number.isFinite(product.price) || product.price <= 0) return false
  if (typeof product.description !== 'string' || product.description.trim() === '') return false

  return true
}

// Перезапуск продуктів з початковими даними (для тестів)
export const resetProducts = () => {
  products = cloneInitialProducts()
}
