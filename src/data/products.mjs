export const initialProducts = [
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

export const cloneInitialProducts = () => initialProducts.map((product) => ({ ...product }))
