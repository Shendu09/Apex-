import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const BuyerProductsList = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample products with farmer info and ratings
  const products = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 30,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      farmer: 'Ramesh Kumar',
      farmerId: 1,
      distance: '2.5 km',
      rating: 4.5,
      reviews: 234,
      inStock: true,
      quality: 'Premium',
      category: 'vegetables',
      discount: 10,
      organic: true
    },
    {
      id: 2,
      name: 'Organic Spinach',
      price: 25,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
      farmer: 'Suresh Reddy',
      farmerId: 2,
      distance: '3.2 km',
      rating: 4.8,
      reviews: 189,
      inStock: true,
      quality: 'Premium',
      category: 'vegetables',
      organic: true
    },
    {
      id: 3,
      name: 'Fresh Carrots',
      price: 35,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
      farmer: 'Lakshmi Devi',
      farmerId: 3,
      distance: '1.8 km',
      rating: 4.7,
      reviews: 156,
      inStock: true,
      quality: 'Grade A',
      category: 'vegetables'
    },
    {
      id: 4,
      name: 'Fresh Mangoes',
      price: 120,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400',
      farmer: 'Ganesh Patel',
      farmerId: 4,
      distance: '5.0 km',
      rating: 4.9,
      reviews: 312,
      inStock: true,
      quality: 'Premium',
      category: 'fruits',
      discount: 15,
      organic: true
    },
    {
      id: 5,
      name: 'Pearl Millet',
      price: 55,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      farmer: 'Sunita Reddy',
      farmerId: 5,
      distance: '4.1 km',
      rating: 4.6,
      reviews: 98,
      inStock: true,
      quality: 'Grade A',
      category: 'grains'
    },
    {
      id: 6,
      name: 'Fresh Cauliflower',
      price: 40,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1568584711271-933f4e68e834?w=400',
      farmer: 'Ramesh Kumar',
      farmerId: 1,
      distance: '2.5 km',
      rating: 4.5,
      reviews: 167,
      inStock: true,
      quality: 'Grade A',
      category: 'vegetables'
    },
    {
      id: 7,
      name: 'Farm Fresh Eggs',
      price: 80,
      unit: 'dozen',
      image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400',
      farmer: 'Lakshmi Devi',
      farmerId: 3,
      distance: '1.8 km',
      rating: 4.9,
      reviews: 445,
      inStock: true,
      quality: 'Premium',
      category: 'dairy',
      organic: true
    },
    {
      id: 8,
      name: 'Fresh Bananas',
      price: 50,
      unit: 'dozen',
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      farmer: 'Ganesh Patel',
      farmerId: 4,
      distance: '5.0 km',
      rating: 4.7,
      reviews: 289,
      inStock: true,
      quality: 'Grade A',
      category: 'fruits',
      discount: 5
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'dairy', name: 'Dairy', icon: '🥛' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products.find(p => p.id === parseInt(id));
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/buyer/dashboard')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Shop Fresh</h1>
          <button className="p-2 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="bg-white rounded-lg flex items-center px-4 py-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 ml-3 outline-none text-gray-800"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="flex space-x-2 p-4 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-farm-green text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <main className="p-4 max-w-7xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">{filteredProducts.length} products found</p>
          <select className="px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-farm-green">
            <option>Sort by: Popularity</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
            <option>Distance</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => navigate(`/buyer/product/${product.farmerId}/${product.id}`)}
                />
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {product.discount}% OFF
                  </div>
                )}
                {product.organic && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                    🌿 Organic
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                
                {/* Farmer Info */}
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">{product.farmer}</span>
                </div>

                {/* Rating & Distance */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-gray-500 ml-1">({product.reviews})</span>
                  </div>
                  <span className="text-gray-600">📍 {product.distance}</span>
                </div>

                {/* Quality Badge */}
                <div className="mb-3">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                    {product.quality}
                  </span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-farm-green">₹{product.price}</p>
                    <p className="text-xs text-gray-500">per {product.unit}</p>
                  </div>
                  
                  {cart[product.id] ? (
                    <div className="flex items-center space-x-2 bg-farm-green rounded-lg">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-white px-2 py-1 hover:bg-farm-dark-green rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="text-white font-bold">{cart[product.id]}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="text-white px-2 py-1 hover:bg-farm-dark-green rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-farm-green hover:bg-farm-dark-green text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Cart */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-farm-green p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{getTotalItems()} items</p>
              <p className="text-2xl font-bold text-farm-green">₹{getTotalPrice()}</p>
            </div>
            <button
              onClick={() => navigate('/buyer/checkout')}
              className="bg-farm-green hover:bg-farm-dark-green text-white px-8 py-3 rounded-lg font-bold text-lg transition-all"
            >
              View Cart & Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProductsList;
