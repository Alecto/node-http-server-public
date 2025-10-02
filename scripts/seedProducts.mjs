import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { connectToDatabase, disconnectFromDatabase } from '../src/database/connection.mjs'
import { ProductModel } from '../src/models/products.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const productsJsonPath = path.resolve(__dirname, '../seeds/products.json')

const loadProducts = async () => {
  const fileContents = await readFile(productsJsonPath, 'utf8')
  const data = JSON.parse(fileContents)

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Файл seeds/products.json не містить валідних продуктів')
  }

  return data
}

const seedProducts = async () => {
  const products = await loadProducts()
  const { connection } = await connectToDatabase()

  if (!connection || connection.readyState !== 1) {
    throw new Error('Не вдалося встановити підключення до MongoDB')
  }

  await ProductModel.syncIndexes()
  await ProductModel.deleteMany({})
  await ProductModel.insertMany(products, { ordered: true })
}

try {
  await seedProducts()
  console.log('✅ Продукти успішно імпортовано з seeds/products.json')
} catch (error) {
  console.error('❌ Помилка імпорту продуктів:', error)
  process.exitCode = 1
} finally {
  await disconnectFromDatabase()
}
