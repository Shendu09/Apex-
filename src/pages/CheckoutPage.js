import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const CheckoutPage = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      navigate('/buyer/dashboard');
    }
  }, [navigate]);

  const handlePayment = () => {
    if (order) {
      // Navigate to payment page with order data
      navigate('/payment', {
        state: {
          items: [{
            name: order.name,
            quantity: order.quantity,
            price: order.price
          }],
          subtotal: order.totalPrice,
          deliveryFee: 0,
          total: order.totalPrice
        }
      });
    }
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{t('checkout')}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-24">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img 
                src={order.image || order.productPhoto} 
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
              <p className="text-gray-600">{order.quantity} {order.unit} × ₹{order.price}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-farm-green">₹{order.totalPrice}</p>
            </div>
          </div>
          
          {/* Pricing Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{order.totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-farm-green">₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Farmer Payment Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Payment will be sent to:</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-600">Farmer Name</p>
              <p className="font-bold">{order.farmer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('bankAccount')}</p>
              <p className="font-mono font-semibold">{order.farmer.bankAccount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('upiId')}</p>
              <p className="font-mono font-semibold">{order.farmer.upiId}</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-farm-green"
              />
              <div className="ml-3 flex items-center flex-1">
                <span className="text-2xl mr-3">📱</span>
                <span className="font-medium">UPI Payment</span>
              </div>
            </label>
            
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-farm-green"
              />
              <div className="ml-3 flex items-center flex-1">
                <span className="text-2xl mr-3">💵</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
            </label>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t('deliveryAddress')}</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium">Rajesh Kumar</p>
            <p className="text-gray-600 mt-2">123, MG Road, Bangalore, Karnataka - 560001</p>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t-2 border-gray-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePayment}
            className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
          >
            {t('payNow')} ₹{order.totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
