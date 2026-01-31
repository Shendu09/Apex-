import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerOrders = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, delivered

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const allOrders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
    
    // Filter orders for this farmer
    const farmerOrders = allOrders.filter(order => order.farmerId === user.id || order.farmerId === 1);
    setOrders(farmerOrders);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const allOrders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
    const updated = allOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toISOString() } : order
    );
    
    localStorage.setItem('farmerOrders', JSON.stringify(updated));
    
    // Also update buyer's order history
    const buyerOrders = JSON.parse(localStorage.getItem('buyerOrders') || '[]');
    const updatedBuyerOrders = buyerOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('buyerOrders', JSON.stringify(updatedBuyerOrders));
    
    // Send notification to buyer
    sendNotificationToBuyer(orderId, newStatus);
    
    loadOrders();
  };

  const sendNotificationToBuyer = (orderId, status) => {
    const notifications = JSON.parse(localStorage.getItem('buyerNotifications') || '[]');
    notifications.push({
      id: Date.now(),
      orderId,
      type: 'order_status',
      title: `Order ${status}`,
      message: `Your order #${orderId} has been ${status}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('buyerNotifications', JSON.stringify(notifications));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'inTransit': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'inTransit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/farmer/dashboard')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Orders</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto pb-20">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 shadow text-center">
            <p className="text-xs text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 shadow text-center">
            <p className="text-xs text-yellow-700 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{orders.filter(o => o.status === 'pending').length}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 shadow text-center">
            <p className="text-xs text-blue-700 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-700">{orders.filter(o => o.status === 'accepted' || o.status === 'inTransit').length}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 shadow text-center">
            <p className="text-xs text-green-700 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-700">{orders.filter(o => o.status === 'delivered').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {['all', 'pending', 'accepted', 'inTransit', 'delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${
                filter === status
                  ? 'bg-farm-green text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? 'All Orders' : getStatusText(status)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'You have no orders yet. Orders from buyers will appear here.'
                : `No ${getStatusText(filter).toLowerCase()} orders at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm font-semibold text-gray-700">Customer Details</p>
                  <p className="text-sm text-gray-600">👤 {order.buyerName || 'Buyer'}</p>
                  <p className="text-sm text-gray-600">📱 {order.buyerPhone || '+91 98765 43210'}</p>
                  <p className="text-sm text-gray-600">📍 {order.deliveryAddress || 'Delivery address not provided'}</p>
                </div>

                {/* Items */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Items</p>
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                          {item.category === 'vegetables' ? '🥬' : 
                           item.category === 'fruits' ? '🍎' : 
                           item.category === 'grains' ? '🌾' : '🥛'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">{item.quantity} {item.unit} × ₹{item.price}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-farm-green">₹{item.quantity * item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t-2">
                  <span className="font-bold text-lg">Total Amount</span>
                  <span className="font-bold text-2xl text-farm-green">₹{order.total || order.totalPrice}</span>
                </div>

                {/* Action Buttons */}
                {order.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                    >
                      ✓ Accept Order
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      className="bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}

                {order.status === 'accepted' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'inTransit')}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-4"
                  >
                    🚚 Mark as In Transit
                  </button>
                )}

                {order.status === 'inTransit' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 mt-4"
                  >
                    ✓ Mark as Delivered
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerOrders;
