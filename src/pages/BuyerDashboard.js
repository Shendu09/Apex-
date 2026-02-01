import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const BuyerDashboard = ({ language, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const menuItems = [
    { icon: '🏠', label: t('dashboard'), path: '/buyer/dashboard' },
    { icon: '🌍', label: 'Discover Farmers', path: '/buyer/discover' },
    { icon: '👨‍🌾', label: t('viewFarmers'), path: '/buyer/farmers' },
    { icon: '📦', label: t('categories'), path: '/buyer/categories' },
    { icon: '🛒', label: t('cart'), path: '/buyer/cart' },
    { icon: '📜', label: t('orderHistory'), path: '/buyer/orders' },
    { icon: '⭐', label: t('reviews'), path: '/buyer/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Farm Bridge</h1>
          <button onClick={() => navigate('/buyer/profile')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-farm-dark-green mb-6">{t('dashboard')}</h2>
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors text-left"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left mt-6"
                >
                  <span className="text-2xl">🚪</span>
                  <span className="font-medium">{t('logout')}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Welcome to Farm Bridge! 🌾</h2>
            <p className="text-green-50">Fresh produce directly from local farmers</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="sticky top-16 z-40 bg-white shadow-md p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for Vegetables, Fruits, Grains..."
                className="flex-1 ml-3 outline-none bg-transparent"
                onFocus={() => navigate('/buyer/products')}
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 mt-6">
          {/* Discover Farmers Card */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">🌍 Discover Local Farmers</h3>
                  <p className="text-blue-50 mb-4">Find farmers near you and shop directly</p>
                  <button
                    onClick={() => navigate('/buyer/discover')}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                  >
                    Explore Now →
                  </button>
                </div>
                <div className="text-6xl hidden md:block">🚜</div>
              </div>
            </div>
          </div>

          {/* Shop by Category */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Shop by Category</h3>
              <button 
                onClick={() => navigate('/buyer/products')}
                className="text-green-600 text-sm font-semibold hover:underline"
              >
                See All
              </button>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {[
                { icon: '🥬', name: 'Vegetables', color: 'bg-green-50' },
                { icon: '🍎', name: 'Fruits', color: 'bg-red-50' },
                { icon: '🌾', name: 'Grains', color: 'bg-yellow-50' },
                { icon: '🥛', name: 'Dairy', color: 'bg-blue-50' },
                { icon: '🥚', name: 'Eggs', color: 'bg-orange-50' },
                { icon: '🌿', name: 'Organic', color: 'bg-green-50' },
              ].map((cat, index) => (
                <button
                  key={index}
                  onClick={() => navigate('/buyer/products')}
                  className={`${cat.color} p-4 rounded-xl hover:shadow-lg transition-all text-center`}
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="text-xs font-semibold text-gray-700">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Banner Slider */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
                <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400" alt="banner" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="text-sm font-semibold bg-white bg-opacity-20 px-3 py-1 rounded-full inline-block mb-3">
                  🎉 Special Offer
                </div>
                <h2 className="text-3xl font-bold mb-2">Fresh Fruits & Vegetables</h2>
                <p className="text-orange-50 mb-4">Get up to 30% off on your first order</p>
                <button 
                  onClick={() => navigate('/buyer/products')}
                  className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-50 transition-colors"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Best Sellers</h3>
              <button 
                onClick={() => navigate('/buyer/products')}
                className="text-green-600 text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Tomatoes', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400', price: 30, unit: 'kg', discount: 10 },
                { name: 'Fresh Mangoes', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400', price: 120, unit: 'kg', discount: 15 },
                { name: 'Carrots', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', price: 35, unit: 'kg' },
                { name: 'Fresh Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', price: 25, unit: 'kg' },
                { name: 'Pearl Millet', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', price: 55, unit: 'kg' },
                { name: 'Farm Eggs', image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=400', price: 80, unit: 'dozen' },
              ].map((product, index) => (
                <div 
                  key={index} 
                  onClick={() => navigate('/buyer/products')}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full inline-flex items-center mb-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                      9 MINS
                    </div>
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h4>
                    <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs mb-2">
                      <option>250 g</option>
                      <option>500 g</option>
                      <option>1 kg</option>
                    </select>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-bold">₹{product.price}</span>
                        {product.discount && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            ₹{Math.round(product.price / (1 - product.discount / 100))}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="w-full mt-2 border-2 border-red-500 text-red-500 py-1.5 rounded text-sm font-bold hover:bg-red-50 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Farmers */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Local Farmers Near You</h3>
              <button 
                onClick={() => navigate('/buyer/farmers')}
                className="text-green-600 text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Ramesh Kumar', distance: '2.5 km', rating: 4.5, reviews: 234, products: 'Vegetables, Fruits' },
                { name: 'Suresh Reddy', distance: '3.2 km', rating: 4.8, reviews: 189, products: 'Grains, Pulses' },
                { name: 'Lakshmi Devi', distance: '1.8 km', rating: 4.7, reviews: 156, products: 'Dairy, Eggs' },
              ].map((farmer, index) => (
                <div 
                  key={index}
                  onClick={() => navigate('/buyer/farmers')}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-3xl">
                      👨‍🌾
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{farmer.name}</h4>
                      <div className="flex items-center text-yellow-500 text-sm mt-1">
                        <span>⭐</span>
                        <span className="ml-1 font-semibold text-gray-700">{farmer.rating}</span>
                        <span className="text-gray-500 ml-1">({farmer.reviews})</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">📍 {farmer.distance} away</p>
                      <p className="text-xs text-green-600 mt-1 font-semibold">{farmer.products}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offers Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">🎁 Bank Offers</h3>
              <p className="text-purple-100 mb-3">Get 10% instant discount on HDFC Bank cards</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50">
                Know More
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">📦 Free Delivery</h3>
              <p className="text-blue-100 mb-3">On orders above ₹200. Limited time offer!</p>
              <button 
                onClick={() => navigate('/buyer/products')}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
        <div className="grid grid-cols-4 max-w-6xl mx-auto">
          <button 
            onClick={() => navigate('/buyer/dashboard')}
            className="flex flex-col items-center py-3 text-green-600"
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/products')}
            className="flex flex-col items-center py-3 text-gray-600 hover:text-green-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs font-semibold">Shop</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/cart')}
            className="flex flex-col items-center py-3 text-gray-600 hover:text-green-600 relative"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-semibold">Cart</span>
          </button>
          <button 
            onClick={() => navigate('/buyer/profile')}
            className="flex flex-col items-center py-3 text-gray-600 hover:text-green-600"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-semibold">Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
