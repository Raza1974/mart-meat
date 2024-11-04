'use client';

import { useState } from 'react';
import { ShoppingCart, Phone } from 'lucide-react';

// Define a Product interface
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Sample product data
const initialProducts: Product[] = [
  { id: 1, name: 'Oil', price: 2450, category: 'Grocery', stock: 10 },
  { id: 2, name: 'Milk', price: 2280, category: 'Grocery', stock: 5 },
  { id: 3, name: 'Chicken', price: 5.99, category: 'Meat', stock: 8 },
  { id: 4, name: 'Beef', price: 7.99, category: 'Meat', stock: 3 },
];

export default function GroceryStore() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' });

  // Add to Cart function
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return; // Check if stock is available

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    // Reduce stock
    setProducts(products.map(p => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p)));
  };

  // Remove from Cart function
  const removeFromCart = (productId: number) => {
    const itemToRemove = cart.find(item => item.id === productId);
    if (itemToRemove) {
      setProducts(products.map(p =>
        p.id === productId ? { ...p, stock: p.stock + itemToRemove.quantity } : p
      ));
      setCart(cart.filter(item => item.id !== productId));
    }
  };



  // Add new product by storekeeper
  const handleAddProduct = () => {
    if (
      newProduct.name &&
      !isNaN(parseFloat(newProduct.price)) &&
      newProduct.category &&
      !isNaN(parseInt(newProduct.stock))
    ) {
      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      setProducts([
        ...products,
        {
          id: newId,
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          stock: parseInt(newProduct.stock),
        },
      ]);
      setNewProduct({ name: '', price: '', category: '', stock: '' });
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-green-600 text-white py-4 px-8 rounded mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Grocery & Meat Store</h1>
          <a href="https://wa.me/1234567890" className="flex items-center">
            <Phone className="mr-2" />
            Contact us on WhatsApp
          </a>
        </div>
      </header>

      <main className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Product List */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Our Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Stock Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
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

      {/* Storekeeper Section */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Price"
            value={newProduct.price}
            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
            className="border p-2 rounded flex-1"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}
