'use client'

import { useState } from 'react'
import { ShoppingCart, Phone, CreditCard, Truck } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  imageUrl?: string
}

interface CartItem extends Product {
  quantity: number
}

const initialProducts: Product[] = [
  { id: 1, name: 'Banana', price: 120, category: 'Fruit', stock: 10, imageUrl: '/placeholder.svg?height=100&width=100' },
  { id: 2, name: 'Oil', price: 2450, category: 'Grocery', stock: 5, imageUrl: '/placeholder.svg?height=100&width=100' },
  { id: 3, name: 'Milk', price: 2280, category: 'Grocery', stock: 8, imageUrl: '/placeholder.svg?height=100&width=100' },
  { id: 4, name: 'Chicken', price: 799, category: 'Meat', stock: 6, imageUrl: '/placeholder.svg?height=100&width=100' },
  { id: 5, name: 'Beef', price: 799, category: 'Meat', stock: 6, imageUrl: '/placeholder.svg?height=100&width=100' },
]

export default function GroceryStore() {
  const [inventory, setInventory] = useState<Product[]>(initialProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash')
  const [creditCardInfo, setCreditCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (product.stock <= 0) {
      alert('Stock unavailable')
      return
    }

    setInventory(inventory.map(item =>
      item.id === product.id ? { ...item, stock: item.stock - 1 } : item
    ))

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ))
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    const itemToRemove = cart.find(item => item.id === productId)
    if (!itemToRemove) return

    setInventory(inventory.map(item =>
      item.id === productId ? { ...item, stock: item.stock + itemToRemove.quantity } : item
    ))

    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    const itemToUpdate = cart.find(item => item.id === productId)
    if (!itemToUpdate) return

    const currentQuantity = itemToUpdate.quantity
    const quantityDifference = newQuantity - currentQuantity

    if (quantityDifference > 0) {
      const stockItem = inventory.find(item => item.id === productId)
      if (stockItem && stockItem.stock >= quantityDifference) {
        setCart(cart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ))
        setInventory(inventory.map(item =>
          item.id === productId ? { ...item, stock: item.stock - quantityDifference } : item
        ))
      } else {
        alert('Not enough stock')
      }
    } else if (quantityDifference < 0) {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ))
      setInventory(inventory.map(item =>
        item.id === productId ? { ...item, stock: item.stock + Math.abs(quantityDifference) } : item
      ))
    }

    if (newQuantity === 0) {
      removeFromCart(productId)
    }
  }

  const addProduct = (product: Product) => {
    setInventory([...inventory, product])
  }

  const downloadCart = () => {
    let cartDetails = "Grocery Store Bill\n"
    cartDetails += "-------------------\n"
    cartDetails += "Items:\n"

    cart.forEach(item => {
      cartDetails += `${item.name} (Quantity: ${item.quantity}) - $${(item.price * item.quantity / 100).toFixed(2)}\n`
    })

    cartDetails += "-------------------\n"
    cartDetails += `Total Amount: $${(total / 100).toFixed(2)}\n`
    cartDetails += "-------------------\n"
    cartDetails += `Payment Method: ${paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'}\n`
    cartDetails += "Delivery time: Approximately 2 hours\n"
    cartDetails += "-------------------\n"
    cartDetails += "Thank you for shopping with us!\n"

    const blob = new Blob([cartDetails], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'grocery-bill.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handlePaymentMethodChange = (method: 'cash' | 'credit') => {
    setPaymentMethod(method)
  }

  const handleCreditCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreditCardInfo({
      ...creditCardInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckout = () => {
    if (paymentMethod === 'credit') {
      if (!creditCardInfo.number || !creditCardInfo.name || !creditCardInfo.expiry || !creditCardInfo.cvv) {
        alert('Please fill in all credit card details')
        return
      }
      // Here you would typically process the credit card payment
      alert('Credit card payment processed successfully!')
    } else {
      alert('Order placed successfully! You will pay on delivery.')
    }
    downloadCart()
    setCart([])
  }
  
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <img src="/placeholder.svg?height=52&width=48" alt="Logo" className="h-13 w-12" />
          <h1 className="text-2xl font-bold">Grocery & Meat Store</h1>
          <a href="https://wa.me/1234567890" className="flex items-center">
            <Phone className="mr-2" />
            Contact us on WhatsApp
          </a>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inventory.map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="mb-2 h-32 w-full object-cover" />
                ) : (
                  <div className="h-32 w-full bg-gray-200 flex items-center justify-center mb-2">
                    No Image
                  </div>
                )}
                <h3 className="font-semibold">{product.name}</h3>
                <p>${(product.price / 100).toFixed(2)}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm text-red-500">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={product.stock <= 0}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <ShoppingCart className="mr-2" />
            Your Cart
          </h2>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      +
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      -
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <span>${((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          <p className="mt-4 text-gray-600">
            Delivery time: <strong>Approximately 2 hours</strong>
          </p>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handlePaymentMethodChange('cash')}
                className={`flex items-center px-4 py-2 rounded ${
                  paymentMethod === 'cash' ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}
              >
                <Truck className="mr-2" />
                Cash on Delivery
              </button>
              <button
                onClick={() => handlePaymentMethodChange('credit')}
                className={`flex items-center px-4 py-2 rounded ${
                  paymentMethod === 'credit' ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}
              >
                <CreditCard className="mr-2" />
                Credit Card
              </button>
            </div>
          </div>

          {paymentMethod === 'credit' && (
            <div className="mt-4 space-y-2">
              <input
                type="text"
                name="number"
                placeholder="Card Number"
                value={creditCardInfo.number}
                onChange={handleCreditCardInfoChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
              <input
                type="text"
                name="name"
                placeholder="Cardholder Name"
                value={creditCardInfo.name}
                onChange={handleCreditCardInfoChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={creditCardInfo.expiry}
                  onChange={handleCreditCardInfoChange}
                  className="w-1/2 border border-gray-300 rounded px-2 py-1"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={creditCardInfo.cvv}
                  onChange={handleCreditCardInfoChange}
                  className="w-1/2 border border-gray-300 rounded px-2 py-1"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleCheckout}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            disabled={cart.length === 0}
          >
            Checkout and Download Bill
          </button>
        </div>
      </main>

      <div className="container mx-auto mt-8 px-4">
        <AddProductForm onAdd={addProduct} />
      </div>
    </div>
  )
}

function AddProductForm({ onAdd }: { onAdd: (product: Product) => void }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !category || !stock) {
      alert('Please fill out all fields')
      return
    }
    onAdd({
      id: Date.now(),
      name,
      price:  Math.round(parseFloat(price) * 100), // Convert to cents
      category,
      stock: parseInt(stock),
      imageUrl: '/placeholder.svg?height=100&width=100',
    })
    setName('')
    setPrice('')
    setCategory('')
    setStock('')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Stock"
          value={stock}
          onChange={e => setStock(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add Product
      </button>
    </form>
  )
}