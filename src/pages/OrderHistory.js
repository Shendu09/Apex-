import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const OrderHistory = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orderHistory');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Demo data
      setOrders([
        {
          orderId: 'ORD1738400000001',
          name: 'Fresh Tomatoes',
          image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=200&fit=crop',
          quantity: 5,
          unit: 'kg',
          totalPrice: 150,
          orderDate: '2026-01-30T10:30:00',
          status: 'delivered',
          farmer: { name: 'Ramesh Kumar' }
        },
        {
          orderId: 'ORD1738400000002',
          name: 'Onions',
          image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=200&fit=crop',
          quantity: 3,
          unit: 'kg',
          totalPrice: 120,
          orderDate: '2026-01-29T14:20:00',
          status: 'in-transit',
          farmer: { name: 'Suresh Reddy' }
        },
      ]);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'in-transit': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
          <h1 className="text-xl font-bold">{t('orderHistory')}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping for fresh produce!</p>
            <button
              onClick={() => navigate('/buyer/categories')}
              className="bg-farm-green hover:bg-farm-dark-green text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-mono font-semibold text-sm">{order.orderId}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(order.orderDate)}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status === 'delivered' ? t('delivered') : 
                     order.status === 'in-transit' ? 'In Transit' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={order.image} 
                      alt={order.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x200/22c55e/ffffff?text=' + order.name;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{order.name}</h3>
                    <p className="text-gray-600">{order.quantity} {order.unit}</p>
                    <p className="text-sm text-gray-600">by {order.farmer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-farm-green">₹{order.totalPrice}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {order.status === 'delivered' && (
                    <>
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors">
                        Rate Product
                      </button>
                      <button className="flex-1 bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-3 rounded-lg transition-colors">
                        Reorder
                      </button>
                    </>
                  )}
                  {order.status === 'in-transit' && (
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors">
                      {t('track')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
