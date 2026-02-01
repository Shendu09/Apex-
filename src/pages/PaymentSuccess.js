import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTranslation } from '../translations';

const PaymentSuccess = ({ language, userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const t = (key) => getTranslation(language, key);

  const orderData = location.state || {
    orderId: 'ORD123456',
    amount: 0,
    paymentMethod: 'upi'
  };

  useEffect(() => {
    // Save order and create farmer notifications
    if (orderData.items && orderData.items.length > 0) {
      createOrderAndNotifications();
    }

    // Confetti animation effect
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const createOrderAndNotifications = () => {
    const buyer = JSON.parse(localStorage.getItem('user') || '{}');
    const buyerPhone = JSON.parse(localStorage.getItem('farmBridgeUser') || '{}').phoneNumber;

    // Group items by farmer
    const farmerOrders = {};
    orderData.items.forEach(item => {
      const farmerId = item.farmerId || 1;
      if (!farmerOrders[farmerId]) {
        farmerOrders[farmerId] = {
          farmerId,
          farmerName: item.farmerName || 'Unknown Farmer',
          items: [],
          total: 0
        };
      }
      farmerOrders[farmerId].items.push(item);
      farmerOrders[farmerId].total += item.price * item.quantity;
    });

    // Create orders for each farmer
    const allOrders = JSON.parse(localStorage.getItem('farmerOrders') || '[]');
    const notifications = JSON.parse(localStorage.getItem('farmerNotifications') || '[]');

    Object.values(farmerOrders).forEach(farmerOrder => {
      const newOrder = {
        id: `ORD${Date.now()}-${farmerOrder.farmerId}`,
        orderId: orderData.orderId,
        farmerId: farmerOrder.farmerId,
        farmerName: farmerOrder.farmerName,
        buyerName: buyer.name || 'Customer',
        buyerPhone: buyerPhone || '1234567890',
        items: farmerOrder.items,
        total: farmerOrder.total,
        totalPrice: farmerOrder.total,
        status: 'pending',
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      };

      allOrders.push(newOrder);

      // Create notification for farmer
      const notification = {
        id: `NOTIF${Date.now()}-${farmerOrder.farmerId}`,
        farmerId: farmerOrder.farmerId,
        type: 'new_order',
        title: '🛒 New Order Received!',
        message: `You have a new order from ${buyer.name || 'Customer'}. Order value: ₹${farmerOrder.total}`,
        orderId: newOrder.orderId,
        orderDetails: {
          items: farmerOrder.items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', '),
          total: farmerOrder.total
        },
        read: false,
        createdAt: new Date().toISOString()
      };

      notifications.push(notification);
    });

    // Save to localStorage
    localStorage.setItem('farmerOrders', JSON.stringify(allOrders));
    localStorage.setItem('farmerNotifications', JSON.stringify(notifications));

    // Clear cart
    localStorage.removeItem('cart');
    localStorage.removeItem('cartItems');
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      upi: 'UPI',
      card: 'Credit/Debit Card',
      netbanking: 'Net Banking',
      wallet: 'Wallet',
      cod: 'Cash on Delivery'
    };
    return methods[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-4 animate-bounce">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="text-2xl font-bold text-farm-green">{orderData.orderId}</p>
          </div>

          <div className="border-t border-b py-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-bold text-xl text-gray-800">₹{orderData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-800">{getPaymentMethodName(orderData.paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction Date</span>
              <span className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-green-500 rounded-full p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Expected Delivery</p>
                <p className="text-sm text-gray-600">Your order will be delivered within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/${userType}/dashboard`)}
            className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-xl transition-all shadow-lg"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/farmer/tracking')}
            className="w-full bg-white hover:bg-gray-50 text-farm-green font-semibold py-4 rounded-xl transition-all border-2 border-farm-green"
          >
            Track Order
          </button>
        </div>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className="text-farm-green font-semibold">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
