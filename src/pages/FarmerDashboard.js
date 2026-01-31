import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerDashboard = ({ language, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const menuItems = [
    { icon: '📊', label: t('dashboard'), path: '/farmer/dashboard' },
    { icon: '📦', label: t('dueOrders'), path: '/farmer/tracking' },
    { icon: '✅', label: t('delivered'), path: '/farmer/tracking' },
    { icon: '💰', label: t('payments'), path: '/farmer/dashboard' },
    { icon: '⭐', label: t('reviews'), path: '/farmer/dashboard' },
  ];

  const stats = [
    { label: t('dueOrders'), value: '5', color: 'bg-yellow-500' },
    { label: t('delivered'), value: '23', color: 'bg-green-500' },
    { label: t('payments'), value: '₹12,450', color: 'bg-blue-500' },
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
          <button onClick={() => navigate('/farmer/profile')} className="p-2">
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
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                  <span className="text-white text-2xl font-bold">{stat.value[0]}</span>
                </div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/farmer/categories')}
              className="p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">➕</div>
              <div className="font-semibold">Add Product</div>
            </button>
            <button
              onClick={() => navigate('/farmer/tracking')}
              className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">📍</div>
              <div className="font-semibold">{t('track')}</div>
            </button>
            <button
              onClick={() => navigate('/farmer/profile')}
              className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">👤</div>
              <div className="font-semibold">{t('profile')}</div>
            </button>
            <button
              className="p-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">💰</div>
              <div className="font-semibold">{t('payments')}</div>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍅</span>
                  </div>
                  <div>
                    <p className="font-semibold">Tomatoes - 20 kg</p>
                    <p className="text-sm text-gray-600">Order #{order}234</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹600</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
