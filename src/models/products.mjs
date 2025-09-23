// Модель для products
export const products = [
  {
    id: 1,
    name: 'Laptop Pro 16',
    price: 2599.99,
    description: 'Високопродуктивний ноутбук для професіоналів з 16-дюймовим дисплеєм'
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    price: 299.99,
    description: 'Бездротові навушники з активним шумозаглушенням'
  },
  {
    id: 3,
    name: 'Smart Watch',
    price: 399.99,
    description: "Розумний годинник з моніторингом здоров'я та фітнес-трекером"
  },
  {
    id: 4,
    name: 'Gaming Mouse',
    price: 79.99,
    description: 'Ігрова миша з високою точністю та RGB підсвічуванням'
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    price: 159.99,
    description: 'Механічна клавіатура з тактильними перемикачами'
  }
]

// Функція для отримання продукту за ID
export const getProductById = (id) => {
  return products.find((product) => product.id === parseInt(id))
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

  // Перевірка ID: має бути цілим числом і не NaN
  if (!Number.isInteger(product.id) || Number.isNaN(product.id)) return false

  // Перевірка name: має бути непорожнім рядком
  if (typeof product.name !== 'string' || product.name.trim() === '') return false

  // Перевірка price: має бути скінченним числом більше 0
  if (!Number.isFinite(product.price) || product.price <= 0) return false

  // Перевірка description: має бути непорожнім рядком
  if (typeof product.description !== 'string' || product.description.trim() === '') return false

  return true
}

// Функція для валідації часткових оновлень (для PUT запитів)
export const validatePartialProduct = (updates) => {
  if (!updates || typeof updates !== 'object') return false

  // Якщо передано name, перевіряємо його
  if (updates.name !== undefined) {
    if (typeof updates.name !== 'string' || updates.name.trim() === '') return false
  }

  // Якщо передано price, перевіряємо його
  if (updates.price !== undefined) {
    if (!Number.isFinite(updates.price) || updates.price <= 0) return false
  }

  // Якщо передано description, перевіряємо його
  if (updates.description !== undefined) {
    if (typeof updates.description !== 'string' || updates.description.trim() === '') return false
  }

  return true
}
