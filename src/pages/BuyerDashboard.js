import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const BuyerDashboard = ({ language, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const menuItems = [
    { icon: '🏠', label: t('dashboard'), path: '/buyer/dashboard' },
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
      <main className="p-4 max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('dashboard')}</h2>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for fresh produce..."
                className="flex-1 outline-none text-lg"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => navigate('/buyer/farmers')}
            className="p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-4xl mb-2">👨‍🌾</div>
            <div className="font-semibold">{t('nearbyFarmers')}</div>
          </button>
          <button
            onClick={() => navigate('/buyer/categories')}
            className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-4xl mb-2">🛒</div>
            <div className="font-semibold">{t('categories')}</div>
          </button>
          <button
            onClick={() => navigate('/buyer/orders')}
            className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-4xl mb-2">📦</div>
            <div className="font-semibold">{t('orderHistory')}</div>
          </button>
          <button
            onClick={() => navigate('/buyer/profile')}
            className="p-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="font-semibold">{t('profile')}</div>
          </button>
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('fresh')} Products Today</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Tomatoes', emoji: '🍅', price: '₹30/kg', farmer: 'Ramesh' },
              { name: 'Onions', emoji: '🧅', price: '₹40/kg', farmer: 'Suresh' },
              { name: 'Potatoes', emoji: '🥔', price: '₹25/kg', farmer: 'Ganesh' },
              { name: 'Carrots', emoji: '🥕', price: '₹35/kg', farmer: 'Mahesh' },
            ].map((product, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-5xl mb-2">{product.emoji}</div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-green-600 font-bold">{product.price}</p>
                <p className="text-xs text-gray-600">by {product.farmer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Farmers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('nearbyFarmers')}</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((farmer) => (
              <div key={farmer} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
                    👨‍🌾
                  </div>
                  <div>
                    <p className="font-semibold">Farmer {farmer}</p>
                    <p className="text-sm text-gray-600">{farmer * 2} km away</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-500">
                    <span className="text-lg">⭐</span>
                    <span className="ml-1 font-semibold">4.{5 + farmer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
