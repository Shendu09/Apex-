import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTranslation } from '../translations';

const ProductDetails = ({ language }) => {
  const navigate = useNavigate();
  const { category, item } = useParams();
  const t = (key) => getTranslation(language, key);
  
  const [isListening, setIsListening] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    address: '',
    productPhoto: null,
  });

  const marketData = {
    tomato: { rate: '₹30/kg', demand: 'high' },
    potato: { rate: '₹25/kg', demand: 'medium' },
    onion: { rate: '₹40/kg', demand: 'high' },
    default: { rate: '₹35/kg', demand: 'medium' },
  };

  const currentMarket = marketData[item] || marketData.default;

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = language === 'hindi' ? 'hi-IN' : 
                        language === 'telugu' ? 'te-IN' :
                        language === 'tamil' ? 'ta-IN' :
                        language === 'kannada' ? 'kn-IN' :
                        language === 'malayalam' ? 'ml-IN' : 'en-IN';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData({ ...formData, address: transcript });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        alert('Voice input not supported or permission denied. Please type manually.');
      };
      
      recognition.start();
    } else {
      alert('Voice input not supported in this browser. Please type manually.');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, productPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.quantity || !formData.address) {
      alert('Please fill all fields');
      return;
    }
    localStorage.setItem('productData', JSON.stringify({
      category,
      item,
      ...formData,
      timestamp: new Date().toISOString()
    }));
    alert('Product added successfully!');
    navigate('/farmer/dashboard');
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
          <h1 className="text-xl font-bold capitalize">{item}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Market Rate Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('marketRate')}</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-farm-green">{currentMarket.rate}</p>
              <p className="text-gray-600 mt-2">{t('demand')}: <span className={`font-bold ${
                currentMarket.demand === 'high' ? 'text-red-600' : 
                currentMarket.demand === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>{t(currentMarket.demand)}</span></p>
            </div>
            <div className="text-6xl">📈</div>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Voice Input Button */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
            <button
              onClick={handleVoiceInput}
              className={`w-20 h-20 rounded-full ${isListening ? 'bg-red-500' : 'bg-farm-green'} hover:bg-farm-dark-green text-white shadow-lg mx-auto flex items-center justify-center transform hover:scale-110 transition-all`}
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="mt-4 text-sm text-gray-700">
              {isListening ? t('listening') : t('speakToAdd')}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">{t('quantity')} ({t('kg')})</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Enter quantity"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green"
            />
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">{t('deliveryAddress')}</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter or speak address"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green"
            />
          </div>

          {/* Product Photo Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">{t('uploadProductPhoto')}</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {formData.productPhoto ? (
                <div className="relative">
                  <img src={formData.productPhoto} alt="Product" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    onClick={() => setFormData({ ...formData, productPhoto: null })}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Tap to upload product photo</p>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
          >
            Add Product
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
