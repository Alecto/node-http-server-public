import { startServer, stopServer } from '../src/server.mjs'
import { SERVER_CONFIG } from '../src/config/index.mjs'

const hostForFetch = SERVER_CONFIG.HOST === '0.0.0.0' ? '127.0.0.1' : SERVER_CONFIG.HOST
const baseUrl = `http://${hostForFetch}:${SERVER_CONFIG.PORT}`
const apiBase = `${baseUrl}/api/products`

const step = (name, detail) => {
  const payload = typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2)
  console.log(`\n=== ${name} ===\n${payload}`)
}

const expectJson = async (response, expectedStatus) => {
  if (response.status !== expectedStatus) {
    const body = await response.text()
    throw new Error(`Очікував статус ${expectedStatus}, але отримав ${response.status}. Тіло: ${body}`)
  }

  return response.json()
}

const expectText = async (response, expectedStatus) => {
  if (response.status !== expectedStatus) {
    const body = await response.text()
    throw new Error(`Очікував статус ${expectedStatus}, але отримав ${response.status}. Тіло: ${body}`)
  }

  return response.text()
}

const runChecks = async () => {
  const { server } = await startServer()

  if (!server) {
    throw new Error('Сервер не запустився')
  }

  try {
    // 1. GET список продуктів
    const listJson = await expectJson(await fetch(apiBase), 200)
    step('GET /api/products', { count: listJson.count, first: listJson.data[0] })

    if (!Array.isArray(listJson.data) || listJson.data.length === 0) {
      throw new Error('Список продуктів порожній або невалідний')
    }

    const sampleProductId = listJson.data[0].id || listJson.data[0]._id

    // 2. POST створення продукту
    const newProduct = {
      name: `Integration Product ${Date.now()}`,
      price: 321.45,
      description: 'Created via automated integration check'
    }

    const createdJson = await expectJson(
      await fetch(apiBase, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newProduct)
      }),
      201
    )

    const createdId = createdJson.data.id || createdJson.data._id
    step('POST /api/products', createdJson)

    // 3. GET конкретного продукту
    const singleJson = await expectJson(await fetch(`${apiBase}/${createdId}`), 200)
    step(`GET /api/products/${createdId}`, singleJson)

    // 4. PATCH часткове оновлення
    const updatedPrice = newProduct.price + 10
    const patchJson = await expectJson(
      await fetch(`${apiBase}/${createdId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ price: updatedPrice })
      }),
      200
    )
    step(`PATCH /api/products/${createdId}`, patchJson)

    if (patchJson.data.price !== updatedPrice) {
      throw new Error('PATCH не оновив ціну продукту')
    }

    // 5. PUT повна заміна
    const replacementPayload = {
      name: `${newProduct.name} Replaced`,
      price: updatedPrice,
      description: 'Replaced via integration test'
    }

    const putJson = await expectJson(
      await fetch(`${apiBase}/${createdId}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(replacementPayload)
      }),
      200
    )
    step(`PUT /api/products/${createdId}`, putJson)

    // 6. DELETE продукт
    const deleteJson = await expectJson(await fetch(`${apiBase}/${createdId}`, { method: 'DELETE' }), 200)
    step(`DELETE /api/products/${createdId}`, deleteJson)

    // 7. Перевірка 404 після видалення
    await expectJson(await fetch(`${apiBase}/${createdId}`), 404)
    step(`GET /api/products/${createdId} після видалення`, 'Отримано 404 як очікувалося')

    // 8. Перевірка некоректного ObjectId
    const invalidIdResponse = await fetch(`${apiBase}/invalid-object-id`)
    step('GET /api/products/invalid-object-id', {
      status: invalidIdResponse.status,
      body: await invalidIdResponse.json()
    })

    // 9. Перевірка HTML-сторінок
    const productsPageHtml = await expectText(await fetch(`${baseUrl}/products`), 200)
    step('GET /products', { containsTitle: productsPageHtml.includes('<title>'), length: productsPageHtml.length })

    const singlePageHtml = await expectText(await fetch(`${baseUrl}/products/${sampleProductId}`), 200)
    step(`GET /products/${sampleProductId}`, {
      containsName: singlePageHtml.includes(listJson.data[0].name),
      length: singlePageHtml.length
    })

    const newFormHtml = await expectText(await fetch(`${baseUrl}/products/new`), 200)
    step('GET /products/new', { containsForm: newFormHtml.includes('<form'), length: newFormHtml.length })

    const notFoundHtml = await expectText(await fetch(`${baseUrl}/non-existent-page`), 404)
    step('GET /non-existent-page', { contains404: notFoundHtml.includes('404'), length: notFoundHtml.length })

    console.log('\n✅ Усі основні маршрути працюють коректно')
  } finally {
    await stopServer()
  }
}

runChecks().catch((error) => {
  console.error('\n❌ Інтеграційна перевірка завершилася помилкою:\n', error)
  process.exit(1)
})
