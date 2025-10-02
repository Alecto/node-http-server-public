import { ProductModel } from '../models/products.mjs'

export const initialProducts = [
  {
    name: 'Laptop Pro 16',
    price: 2599.99,
    description: 'Високопродуктивний ноутбук для професіоналів з 16-дюймовим дисплеєм'
  },
  {
    name: 'Wireless Headphones',
    price: 299.99,
    description: 'Бездротові навушники з активним шумозаглушенням'
  },
  {
    name: 'Smart Watch',
    price: 399.99,
    description: "Розумний годинник з моніторингом здоров'я та фітнес-трекером"
  }
]

export const seedProducts = async () => {
  const existingCount = await ProductModel.estimatedDocumentCount()

  if (existingCount === 0) {
    await ProductModel.insertMany(initialProducts)
  }
}
