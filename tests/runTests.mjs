import assert from 'node:assert/strict'
import { test, before, beforeEach, after } from 'node:test'
import request from 'supertest'
import mongoose from 'mongoose'
import { startServer, stopServer } from '../src/server.mjs'
import { DATABASE_CONFIG, buildMongoConnectionString } from '../src/config/index.mjs'
import { ProductModel } from '../src/models/products.mjs'
import { initialProducts } from '../src/data/products.mjs'

const TEST_DB_NAME = `${DATABASE_CONFIG.NAME || 'learning-products'}-test`
const baseConnectionString = buildMongoConnectionString()
const TEST_DB_URI = baseConnectionString.replace(DATABASE_CONFIG.NAME, TEST_DB_NAME)

let serverInstance
let mongoAvailable = false

const ensureMongoAvailable = async () => {
  try {
    const connection = await mongoose.createConnection(TEST_DB_URI).asPromise()
    await connection.close()
    mongoAvailable = true
  } catch (error) {
    mongoAvailable = false
  }
}

await ensureMongoAvailable()

if (!mongoAvailable) {
  console.warn('\n⚠️  MongoDB недоступна. Тести пропущено. Переконайтеся, що MongoDB Atlas або локальна БД запущені.\n')
  test.skip('Пропуск усіх тестів, доки MongoDB недоступна', () => {})
} else {
  before(async () => {
    await mongoose.connect(TEST_DB_URI)
    serverInstance = await startServer({ connectionString: TEST_DB_URI, seed: false })
  })

  beforeEach(async () => {
    await ProductModel.deleteMany({})
    await ProductModel.insertMany(initialProducts)
  })

  after(async () => {
    await ProductModel.deleteMany({})
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
    if (serverInstance) {
      await stopServer()
    }
  })

  test('GET /api/products повертає список продуктів', async () => {
    const response = await request(serverInstance).get('/api/products').expect(200)

    assert.equal(response.body.success, true)
    assert.ok(Array.isArray(response.body.data))
    assert.equal(response.body.data.length, initialProducts.length)
  })

  test('POST /api/products створює продукт', async () => {
    const payload = {
      name: 'Integration Product',
      price: 123.45,
      description: 'Created via automated test'
    }

    const response = await request(serverInstance).post('/api/products').send(payload).expect(201)

    assert.equal(response.body.success, true)
    assert.equal(response.body.data.name, payload.name)

    const productInDb = await ProductModel.findOne({ name: payload.name })
    assert.ok(productInDb)
  })

  test('PATCH /api/products/:id частково оновлює продукт', async () => {
    const product = await ProductModel.findOne()
    const updatedPrice = 777.77

    const response = await request(serverInstance)
      .patch(`/api/products/${product.id}`)
      .send({ price: updatedPrice })
      .expect(200)

    assert.equal(response.body.success, true)
    assert.equal(response.body.data.price, updatedPrice)

    const productInDb = await ProductModel.findById(product.id)
    assert.equal(productInDb.price, updatedPrice)
  })

  test('DELETE /api/products/:id видаляє продукт', async () => {
    const product = await ProductModel.findOne()

    const response = await request(serverInstance).delete(`/api/products/${product.id}`).expect(200)

    assert.equal(response.body.success, true)
    assert.equal(response.body.data._id, product.id)

    const exists = await ProductModel.exists({ _id: product.id })
    assert.equal(Boolean(exists), false)
  })
}
