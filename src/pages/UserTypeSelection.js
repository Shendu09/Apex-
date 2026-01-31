import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const UserTypeSelection = ({ onSelectType, language }) => {
  const navigate = useNavigate();

  const handleTypeSelect = (type) => {
    onSelectType(type);
    navigate(type === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
  };

  const t = (key) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-farm-dark-green mb-4">{t('selectUserType')}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Farmer Card */}
          <button
            onClick={() => handleTypeSelect('farmer')}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transform hover:scale-105 transition-all p-0 border-4 border-transparent hover:border-farm-green"
          >
            <div className="h-80 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="p-8">
              <h2 className="text-4xl font-bold text-farm-dark-green mb-4">{t('farmer')}</h2>
              <p className="text-gray-600 text-lg">
                {language === 'hindi' ? 'अपनी उपज बेचें और सीधे खरीदारों से जुड़ें' : 
                 language === 'telugu' ? 'మీ ఉత్పత్తులను విక్రయించండి మరియు కొనుగోలుదారులతో నేరుగా కనెక్ట్ అవ్వండి' :
                 'Sell your produce and connect directly with buyers'}
              </p>
            </div>
          </button>

          {/* Buyer Card */}
          <button
            onClick={() => handleTypeSelect('buyer')}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transform hover:scale-105 transition-all p-0 border-4 border-transparent hover:border-farm-green"
          >
            <div className="h-80 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <svg className="w-48 h-48 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
            </div>
            <div className="p-8">
              <h2 className="text-4xl font-bold text-farm-dark-green mb-4">{t('buyer')}</h2>
              <p className="text-gray-600 text-lg">
                {language === 'hindi' ? 'ताजा उपज खरीदें और स्थानीय किसानों का समर्थन करें' : 
                 language === 'telugu' ? 'తాజా ఉత్పత్తులను కొనుగోలు చేయండి మరియు స్థానిక రైతులకు మద్దతు ఇవ్వండి' :
                 'Buy fresh produce and support local farmers'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;
