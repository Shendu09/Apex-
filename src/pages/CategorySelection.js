import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const CategorySelection = ({ language, userType }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const categories = [
    { 
      name: t('fruits'), 
      emoji: '🍎', 
      color: 'from-red-400 to-red-600',
      image: '🍎🍊🍌🍇'
    },
    { 
      name: t('vegetables'), 
      emoji: '🥬', 
      color: 'from-green-400 to-green-600',
      image: '🥬🥕🍅🥒'
    },
    { 
      name: t('millets'), 
      emoji: '🌾', 
      color: 'from-yellow-400 to-yellow-600',
      image: '🌾🌾🌾🌾'
    },
    { 
      name: t('grains'), 
      emoji: '🌽', 
      color: 'from-orange-400 to-orange-600',
      image: '🌽🌾🌰🥜'
    },
  ];

  const handleCategorySelect = (categoryName) => {
    navigate(`/${userType}/items/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(`/${userType}/dashboard`)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{t('selectCategory')}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleCategorySelect(category.name)}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transform hover:scale-105 transition-all border-4 border-transparent hover:border-farm-green"
            >
              <div className={`h-64 bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                <div className="text-8xl">{category.emoji}</div>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h2>
                <div className="text-4xl">{category.image}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategorySelection;
