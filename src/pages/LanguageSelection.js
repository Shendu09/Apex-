import React from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageSelection = ({ onSelectLanguage, currentLanguage }) => {
  const navigate = useNavigate();

  const languages = [
    { code: 'english', name: 'English', native: 'English' },
    { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
    { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
    { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
    { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'malayalam', name: 'Malayalam', native: 'മലയാളം' },
  ];

  const handleLanguageSelect = (langCode) => {
    onSelectLanguage(langCode);
    navigate('/user-type');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-farm-dark-green mb-4">Select Your Language</h1>
          <p className="text-gray-600">अपनी भाषा चुनें | మీ భాష ఎంచుకోండి</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all border-4 ${
                currentLanguage === lang.code ? 'border-farm-green' : 'border-transparent'
              }`}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{lang.native}</h3>
                <p className="text-gray-600">{lang.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelection;
