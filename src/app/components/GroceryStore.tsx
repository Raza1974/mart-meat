'use client'

import { useState } from 'react'
import { ShoppingCart, Phone } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  imageUrl?: string // Optional image URL
}

interface CartItem extends Product {
  quantity: number
}

const initialProducts: Product[] = [
  { id: 1, name: 'Apples', price: 1.99, category: 'Grocery', stock: 10 },
  { id: 2, name: 'Bread', price: 2.49, category: 'Grocery', stock: 5 },
  { id: 3, name: 'Chicken', price: 5.99, category: 'Meat', stock: 8 },
  { id: 4, name: 'Beef', price: 7.99, category: 'Meat', stock: 6 },
]

export default function GroceryStore() {
  const [inventory, setInventory] = useState<Product[]>(initialProducts)
  const [cart, setCart] = useState<CartItem[]>([])

  // Function to add a product to the cart
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (product.stock <= 0) {
      alert('Stock unavailable')
      return
    }

    // Reduce stock in the inventory
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

  // Function to remove an item from the cart
  const removeFromCart = (productId: number) => {
    const itemToRemove = cart.find(item => item.id === productId)
    if (!itemToRemove) return

    // Restore stock in the inventory
    setInventory(inventory.map(item =>
      item.id === productId ? { ...item, stock: item.stock + itemToRemove.quantity } : item
    ))

    setCart(cart.filter(item => item.id !== productId))
  }

  // Function to update the quantity of an item in the cart
  const updateQuantity = (productId: number, newQuantity: number) => {
    const itemToUpdate = cart.find(item => item.id === productId)
    if (!itemToUpdate) return

    const currentQuantity = itemToUpdate.quantity
    const quantityDifference = newQuantity - currentQuantity

    if (quantityDifference > 0) {
      // Check if there is enough stock to increase the quantity
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
      // Decrease quantity and restore stock
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ))
      setInventory(inventory.map(item =>
        item.id === productId ? { ...item, stock: item.stock - quantityDifference } : item
      ))
    }

    if (newQuantity === 0) {
      removeFromCart(productId)
    }
  }

  const addProduct = (product: Product) => {
    setInventory([...inventory, product])
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-green-600 text-white p-4">
  <div className="container mx-auto flex justify-between items-center">
    {/* Add your logo or image here */}
    <img src="mart.jpeg" alt="Logo" className="h-13 w-12" />
    <h1 className="text-2xl font-bold">Grocery & Meat Store</h1>
    <a href="https://wa.me/1234567890" className="flex items-center">
      <Phone className="mr-2" />
      Contact us on WhatsApp
    </a>
  </div>
</header>

      <main className="container mx-auto mt-8 px-4 flex">
        {/* Product List */}
        <div className="w-2/3 pr-8">
          <h2 className="text-xl font-semibold mb-4">Our Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {inventory.map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
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

        {/* Shopping Cart */}
        <div className="w-1/3 bg-white p-4 rounded shadow">
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
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Add Product Form */}
      <div className="container mx-auto mt-8 px-4">
        <AddProductForm onAdd={addProduct} />
      </div>
    </div>
  )
}

// Form component for adding new products
function AddProductForm({ onAdd }: { onAdd: (product: Product) => void }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState(0)
  const [imageUrl, setImageUrl] = useState('') // New state for image URL

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProduct: Product = {
      id: Date.now(),
      name,
      price,
      category,
      stock,
      imageUrl, // Include the image URL
    }
    onAdd(newProduct)
    setName('')
    setPrice(0)
    setCategory('')
    setStock(0)
    setImageUrl('') // Reset the image URL field
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Add New Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 mr-2"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mr-2"
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
        className="border p-2 mr-2"
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add Product
      </button>
    </form>
  )
}
