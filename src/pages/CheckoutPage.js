import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const CheckoutPage = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [cartItems, setCartItems] = useState([]);
  const [cart, setCart] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('upi');

  useEffect(() => {
    // Load cart items from localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    const savedCart = localStorage.getItem('cart');
    
    if (savedCartItems && savedCart) {
      const items = JSON.parse(savedCartItems);
      const cartQty = JSON.parse(savedCart);
      setCartItems(items);
      setCart(cartQty);
    } else {
      // If cart is empty, redirect back
      navigate('/buyer/products');
    }
  }, [navigate]);

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeItem(productId);
      return;
    }
    
    const updatedCart = { ...cart, [productId]: newQty };
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    const updatedItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const removeItem = (productId) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    if (updatedItems.length === 0) {
      navigate('/buyer/products');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return getSubtotal() > 200 ? 0 : 40;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handlePayment = () => {
    if (cartItems.length > 0) {
      navigate('/payment', {
        state: {
          items: cartItems,
          subtotal: getSubtotal(),
          deliveryFee: getDeliveryFee(),
          total: getTotal()
        }
      });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to get started!</p>
          <button
            onClick={() => navigate('/buyer/products')}
            className="bg-farm-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-farm-dark-green transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

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
        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Cart ({cartItems.length} items)</h2>
          
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.farmer}</p>
                  <p className="text-lg font-bold text-farm-green mt-1">₹{item.price}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center border-2 border-red-500 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-red-500 px-3 py-1 hover:bg-red-50 font-bold"
                    >
                      −
                    </button>
                    <span className="text-red-500 font-bold px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-red-500 px-3 py-1 hover:bg-red-50 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{getSubtotal()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              {getDeliveryFee() === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                <span>₹{getDeliveryFee()}</span>
              )}
            </div>
            {getSubtotal() < 200 && getSubtotal() > 0 && (
              <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                Add ₹{200 - getSubtotal()} more for free delivery!
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-3 border-t-2">
              <span>Total</span>
              <span className="text-farm-green">₹{getTotal()}</span>
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
            <p className="text-gray-600 mt-1">📱 +91 98765 43210</p>
          </div>
          <button className="mt-3 text-farm-green font-semibold hover:underline">
            Change Address
          </button>
        </div>
      </main>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t-2 border-gray-200">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-farm-green">₹{getTotal()}</p>
          </div>
          <button
            onClick={handlePayment}
            className="bg-farm-green hover:bg-farm-dark-green text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
