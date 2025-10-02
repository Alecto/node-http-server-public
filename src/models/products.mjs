export const products = [
  { id: 1, name: 'Ноутбук', price: 2599.99, description: 'Потужний ноутбук для роботи' },
  { id: 2, name: 'Навушники', price: 299.99, description: 'Бездротові навушники з шумозаглушенням' }
]

let currentId = products.length

export const getProductById = (id) => {
  return products.find((product) => product.id === Number(id))
}

export const addProduct = ({ name, price, description }) => {
  currentId += 1
  const product = { id: currentId, name, price, description }
  products.push(product)
  return product
}
