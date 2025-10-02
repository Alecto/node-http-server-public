import assert from 'node:assert/strict'
import { test } from 'node:test'
import request from 'supertest'
import { app } from '../src/server.mjs'
import { resetProducts } from '../src/models/products.mjs'

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
