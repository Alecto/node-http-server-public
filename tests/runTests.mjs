import assert from 'node:assert/strict'
import { test } from 'node:test'
import request from 'supertest'
import { app } from '../src/server.mjs'
import { resetProducts, getAllProducts } from '../src/models/products.mjs'

// Глобальний хук для очищення стану між тестами
test.beforeEach(() => {
  resetProducts()
})

test('GET /api/products повертає список продуктів', async () => {
  const response = await request(app).get('/api/products').expect(200)

  assert.equal(response.body.success, true)
  assert.ok(Array.isArray(response.body.data))
  assert.equal(typeof response.body.count, 'number')
  assert.ok(response.body.data.length >= 1)
})

test('POST /api/products створює продукт', async () => {
  const payload = {
    name: 'Integration Product',
    price: 123.45,
    description: 'Created via automated test'
  }

  const response = await request(app).post('/api/products').send(payload).expect(201)

  assert.equal(response.body.success, true)
  assert.equal(response.body.data.name, payload.name)
  assert.equal(response.body.data.price, payload.price)
  assert.equal(response.body.data.description, payload.description)
})

test('PATCH /api/products/:id частково оновлює продукт', async () => {
  const response = await request(app).patch('/api/products/1').send({ price: 777.77 }).expect(200)

  assert.equal(response.body.success, true)
  assert.equal(response.body.data.price, 777.77)
})

test('DELETE /api/products/:id видаляє продукт', async () => {
  const response = await request(app).delete('/api/products/1').expect(200)

  assert.equal(response.body.success, true)
  assert.equal(response.body.data.id, 1)

  const listAfterDelete = getAllProducts()
  assert.equal(
    listAfterDelete.some((product) => product.id === 1),
    false
  )
})
