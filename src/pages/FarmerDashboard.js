import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerDashboard = ({ language, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    delivered: 0,
    totalRevenue: 0,
    products: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load orders
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const allOrders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
    const farmerOrders = allOrders.filter(order => order.farmerId === user.id || order.farmerId === 1);
    
    // Calculate stats
    const pending = farmerOrders.filter(o => o.status === 'pending').length;
    const accepted = farmerOrders.filter(o => o.status === 'accepted' || o.status === 'inTransit').length;
    const delivered = farmerOrders.filter(o => o.status === 'delivered').length;
    const totalRevenue = farmerOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + (order.total || order.totalPrice || 0), 0);
    
    // Load products count
    const products = JSON.parse(localStorage.getItem('farmerProducts') || '[]');
    
    setStats({
      pending,
      accepted,
      delivered,
      totalRevenue,
      products: products.length
    });
    
    // Get recent orders (last 5)
    setRecentOrders(farmerOrders.slice(0, 5));
  };

  const menuItems = [
    { icon: '📊', label: t('dashboard'), path: '/farmer/dashboard' },
    { icon: '📦', label: t('myProducts'), path: '/farmer/products' },
    { icon: '🛒', label: t('viewOrders'), path: '/farmer/orders' },
    { icon: '📍', label: t('track'), path: '/farmer/tracking' },
    { icon: '⭐', label: t('reviews'), path: '/farmer/dashboard' },
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
      <main className="p-4 max-w-6xl mx-auto pb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('dashboard')}</h2>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <button
              onClick={() => navigate('/farmer/orders')}
              className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all text-white"
            >
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm opacity-90">{t('pendingOrders')}</p>
            </button>
            
            <button
              onClick={() => navigate('/farmer/orders')}
              className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all text-white"
            >
              <div className="text-3xl mb-2">🚚</div>
              <p className="text-2xl font-bold">{stats.accepted}</p>
              <p className="text-sm opacity-90">{t('inProgress')}</p>
            </button>
            
            <button
              onClick={() => navigate('/farmer/orders')}
              className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all text-white"
            >
              <div className="text-3xl mb-2">✅</div>
              <p className="text-2xl font-bold">{stats.delivered}</p>
              <p className="text-sm opacity-90">{t('delivered')}</p>
            </button>

            <button
              onClick={() => navigate('/farmer/products')}
              className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-all text-white"
            >
              <div className="text-3xl mb-2">📦</div>
              <p className="text-2xl font-bold">{stats.products}</p>
              <p className="text-sm opacity-90">{t('myProducts')}</p>
            </button>

            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg p-4 text-white">
              <div className="text-3xl mb-2">💰</div>
              <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
              <p className="text-sm opacity-90">{t('totalRevenue')}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{t('quickActions')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/farmer/products')}
              className="p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">➕</div>
              <div className="font-semibold">{t('addProduct')}</div>
            </button>
            <button
              onClick={() => navigate('/farmer/orders')}
              className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">🛒</div>
              <div className="font-semibold">{t('viewOrders')}</div>
            </button>
            <button
              onClick={() => navigate('/farmer/tracking')}
              className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">📍</div>
              <div className="font-semibold">{t('track')}</div>
            </button>
            <button
              onClick={() => navigate('/farmer/profile')}
              className="p-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl text-white hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-2">👤</div>
              <div className="font-semibold">{t('profile')}</div>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{t('recentOrders')}</h3>
            <button 
              onClick={() => navigate('/farmer/orders')}
              className="text-farm-green text-sm font-semibold hover:underline"
            >
              {t('viewAll')}
            </button>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-gray-600">{t('noOrders')}</p>
              <p className="text-sm text-gray-500">{t('ordersWillAppear')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate('/farmer/orders')}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">
                        {order.items && order.items[0] ? 
                          (order.items[0].category === 'vegetables' ? '🥬' : 
                           order.items[0].category === 'fruits' ? '🍎' : '🌾') 
                          : '📦'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.items ? `${order.items.length} item(s)` : 'Multiple items'}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{order.total || order.totalPrice}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
