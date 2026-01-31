import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const BuyerProductView = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const [product] = useState({
    name: 'Fresh Tomatoes',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop',
    price: 30,
    unit: 'kg',
    available: 100,
    freshness: 'Just harvested today',
    description: 'Premium quality fresh tomatoes directly from farm',
    farmer: {
      name: 'Ramesh Kumar',
      photo: null,
      rating: 4.8,
      reviews: 45,
      location: 'Guntur, AP',
      distance: '2.5 km',
      bankAccount: '1234567890',
      upiId: 'ramesh@upi'
    },
    productPhoto: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop',
  });

  const [quantity, setQuantity] = useState(1);
  const [showReturn, setShowReturn] = useState(false);

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity,
      totalPrice,
      addedAt: new Date().toISOString()
    };
    localStorage.setItem('cartItem', JSON.stringify(cartItem));
    alert('Added to cart!');
  };

  const handleBuyNow = () => {
    const orderData = {
      ...product,
      quantity,
      totalPrice,
      orderedAt: new Date().toISOString()
    };
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    navigate('/buyer/checkout');
  };

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
          <h1 className="text-xl font-bold">Product Details</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto pb-24">
        {/* Product Image */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
          <div className="h-80 bg-gray-100">
            <img 
              src={product.productPhoto || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x600/22c55e/ffffff?text=' + product.name;
              }}
            />
          </div>
          <div className="p-4 text-center">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {t('fresh')} • {t('available')}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-3xl font-bold text-farm-green">₹{product.price}</span>
            <span className="text-gray-600">per {product.unit}</span>
          </div>
          <p className="text-sm text-gray-600">{t('available')}: {product.available} {product.unit}</p>
          <p className="text-sm text-green-600 font-medium mt-2">{product.freshness}</p>
        </div>

        {/* Farmer Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Farmer Details</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              {product.farmer.photo ? (
                <img src={product.farmer.photo} alt={product.farmer.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{product.farmer.name}</h4>
              <p className="text-sm text-gray-600">{product.farmer.location} • {product.farmer.distance}</p>
              <div className="flex items-center space-x-1 text-yellow-500 mt-1">
                <span>⭐</span>
                <span className="text-gray-800 font-semibold">{product.farmer.rating}</span>
                <span className="text-gray-600 text-sm">({product.farmer.reviews})</span>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div>
              <p className="text-sm text-gray-600">{t('bankAccount')}</p>
              <p className="font-mono font-semibold text-gray-800">{product.farmer.bankAccount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('upiId')}</p>
              <p className="font-mono font-semibold text-gray-800">{product.farmer.upiId}</p>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t('quantity')}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold"
              >
                -
              </button>
              <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.available, quantity + 1))}
                className="w-12 h-12 bg-farm-green hover:bg-farm-dark-green text-white rounded-full flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-farm-green">₹{totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => setShowReturn(!showReturn)}
            className="w-full flex items-center justify-between"
          >
            <span className="font-bold text-gray-800">{t('returnProduct')} Policy</span>
            <svg className={`w-6 h-6 transition-transform ${showReturn ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showReturn && (
            <div className="mt-4 text-gray-600">
              <p className="mb-2">• Return within 24 hours if not satisfied</p>
              <p className="mb-2">• Product should be in original condition</p>
              <p>• Refund processed within 3 working days</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t-2 border-gray-200">
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
          <button
            onClick={handleAddToCart}
            className="bg-white border-2 border-farm-green text-farm-green font-semibold py-4 rounded-lg hover:bg-green-50 transition-colors"
          >
            {t('addToCart')}
          </button>
          <button
            onClick={handleBuyNow}
            className="bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
          >
            {t('orderNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerProductView;
