import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ItemsList = ({ language, userType }) => {
  const navigate = useNavigate();
  const { category } = useParams();

  const itemsData = {
    fruits: [
      { name: 'Apple', emoji: '🍎', telugu: 'ఆపిల్', hindi: 'सेब', tamil: 'ஆப்பிள்' },
      { name: 'Banana', emoji: '🍌', telugu: 'అరటి', hindi: 'केला', tamil: 'வாழை' },
      { name: 'Mango', emoji: '🥭', telugu: 'మామిడి', hindi: 'आम', tamil: 'மாம்பழம்' },
      { name: 'Orange', emoji: '🍊', telugu: 'నారింజ', hindi: 'संतरा', tamil: 'ஆரஞ்சு' },
      { name: 'Grapes', emoji: '🍇', telugu: 'ద్రాక్ష', hindi: 'अंगूर', tamil: 'திராட்சை' },
      { name: 'Watermelon', emoji: '🍉', telugu: 'పుచ్చకాయ', hindi: 'तरबूज', tamil: 'தர்பூசணி' },
    ],
    vegetables: [
      { name: 'Tomato', emoji: '🍅', telugu: 'టమాటో', hindi: 'टमाटर', tamil: 'தக்காளி' },
      { name: 'Potato', emoji: '🥔', telugu: 'బంగాళదుంప', hindi: 'आलू', tamil: 'உருளைக்கிழங்கு' },
      { name: 'Onion', emoji: '🧅', telugu: 'ఉల్లిపాయ', hindi: 'प्याज', tamil: 'வெங்காயம்' },
      { name: 'Carrot', emoji: '🥕', telugu: 'క్యారెట్', hindi: 'गाजर', tamil: 'கேரட்' },
      { name: 'Cabbage', emoji: '🥬', telugu: 'క్యాబేజీ', hindi: 'पत्तागोभी', tamil: 'முட்டைகோஸ்' },
      { name: 'Brinjal', emoji: '🍆', telugu: 'వంకాయ', hindi: 'बैंगन', tamil: 'கத்திரிக்காய்' },
    ],
    millets: [
      { name: 'Pearl Millet', emoji: '🌾', telugu: 'సజ్జలు', hindi: 'बाजरा', tamil: 'கம்பு' },
      { name: 'Finger Millet', emoji: '🌾', telugu: 'రాగి', hindi: 'रागी', tamil: 'கேழ்வரகு' },
      { name: 'Foxtail Millet', emoji: '🌾', telugu: 'కొర్రలు', hindi: 'कंगनी', tamil: 'தினை' },
      { name: 'Sorghum', emoji: '🌾', telugu: 'జొన్నలు', hindi: 'ज्वार', tamil: 'சோளம்' },
      { name: 'Little Millet', emoji: '🌾', telugu: 'సామలు', hindi: 'कुटकी', tamil: 'சாமை' },
    ],
    grains: [
      { name: 'Rice', emoji: '🌾', telugu: 'బియ్యం', hindi: 'चावल', tamil: 'அரிசி' },
      { name: 'Wheat', emoji: '🌾', telugu: 'గోధుమ', hindi: 'गेहूं', tamil: 'கோதுமை' },
      { name: 'Corn', emoji: '🌽', telugu: 'మొక్కజొన్న', hindi: 'मक्का', tamil: 'சோளம்' },
      { name: 'Barley', emoji: '🌾', telugu: 'బార్లీ', hindi: 'जौ', tamil: 'வாற்கோதுமை' },
    ],
  };

  const items = itemsData[category] || [];

  const getLocalizedName = (item) => {
    if (language === 'telugu') return item.telugu;
    if (language === 'hindi') return item.hindi;
    if (language === 'tamil') return item.tamil;
    return item.name;
  };

  const handleItemClick = (item) => {
    if (userType === 'farmer') {
      navigate(`/farmer/product/${category}/${item.name.toLowerCase()}`);
    } else {
      navigate(`/buyer/product/farmer1/${item.name.toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(`/${userType}/categories`)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold capitalize">{category}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition-all border-4 border-transparent hover:border-farm-green"
            >
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h3 className="text-lg font-bold text-gray-800">{getLocalizedName(item)}</h3>
              <p className="text-sm text-gray-600">{item.name}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ItemsList;
