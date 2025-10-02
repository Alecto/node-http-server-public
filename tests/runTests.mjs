import assert from 'node:assert/strict'
import { test, before, beforeEach, after } from 'node:test'
import request from 'supertest'
import mongoose from 'mongoose'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startServer, stopServer } from '../src/server.mjs'
import { DATABASE_CONFIG, buildMongoConnectionString } from '../src/config/index.mjs'
import { ProductModel } from '../src/models/products.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const seedProductsPath = path.resolve(__dirname, '../seeds/products.json')

const loadSeedProducts = async () => {
  const fileContents = await readFile(seedProductsPath, 'utf8')
  const data = JSON.parse(fileContents)

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Файл seeds/products.json має містити щонайменше один продукт')
  }

  return data
}

const TEST_DB_NAME = `${DATABASE_CONFIG.NAME || 'learning-products'}-test`
const baseConnectionString = buildMongoConnectionString()
const TEST_DB_URI = baseConnectionString.replace(DATABASE_CONFIG.NAME, TEST_DB_NAME)

let serverHandle
let mongoAvailable = false
let initialProducts = []

const ensureMongoAvailable = async () => {
  try {
    const connection = await mongoose.createConnection(TEST_DB_URI).asPromise()
    await connection.close()
    mongoAvailable = true
  } catch (error) {
    mongoAvailable = false
  }
}

initialProducts = await loadSeedProducts()
await ensureMongoAvailable()

if (!mongoAvailable) {
  console.warn('\n⚠️  MongoDB недоступна. Тести пропущено. Переконайтеся, що MongoDB Atlas або локальна БД запущені.\n')
  test.skip('Пропуск усіх тестів, доки MongoDB недоступна', () => {})
} else {
  before(async () => {
    await mongoose.connect(TEST_DB_URI)
    const { server } = await startServer({ uri: TEST_DB_URI })
    serverHandle = server
  })

  beforeEach(async () => {
    await ProductModel.deleteMany({})
    await ProductModel.insertMany(initialProducts)
  })

  after(async () => {
    await ProductModel.deleteMany({})
    await stopServer()

    await mongoose.connect(TEST_DB_URI)
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()

    for (const { name } of collections) {
      try {
        await db.dropCollection(name)
      } catch (error) {
        if (error.code !== 26 && error.codeName !== 'NamespaceNotFound') {
          throw error
        }
      }
    }

    await mongoose.disconnect()
  })

  test('GET /api/products повертає список продуктів', async () => {
    const response = await request(serverHandle).get('/api/products').expect(200)

    assert.equal(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
    assert.equal(response.body.data.length, initialProducts.length)
  })

  test('POST /api/products створює продукт', async () => {
    const payload = {
      name: `Integration Product ${Date.now()}`,
      price: 123.45,
      description: 'Created via automated test'
    }

    const response = await request(serverHandle).post('/api/products').send(payload).expect(201)

    assert.equal(response.body.success, true)
    assert.equal(response.body.data.name, payload.name)

    const productInDb = await ProductModel.findOne({ name: payload.name })
    assert.ok(productInDb)
  })

  test('PATCH /api/products/:id частково оновлює продукт', async () => {
    const product = await ProductModel.findOne().lean()
    const updatedPrice = 777.77

    const response = await request(serverHandle)
      .patch(`/api/products/${product._id}`)
      .send({ price: updatedPrice })
      .expect(200)

    assert.equal(response.body.success, true)
    assert.equal(response.body.data.price, updatedPrice)

    const productInDb = await ProductModel.findById(product._id).lean()
    assert.equal(productInDb.price, updatedPrice)
  })

  test('DELETE /api/products/:id видаляє продукт', async () => {
    const product = await ProductModel.findOne().lean()

    const response = await request(serverHandle).delete(`/api/products/${product._id}`).expect(200)

    assert.equal(response.body.success, true)
    assert.equal(response.body.data._id, String(product._id))

    const exists = await ProductModel.exists({ _id: product._id })
    assert.equal(Boolean(exists), false)
  })
}
