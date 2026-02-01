import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ItemsList = ({ language, userType }) => {
  const navigate = useNavigate();
  const { category } = useParams();

  const itemsData = {
    fruits: [
      { name: 'Apple', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop', telugu: 'ఆపిల్', hindi: 'सेब', tamil: 'ஆப்பிள்', kannada: 'ಸೇಬು', malayalam: 'ആപ്പിൾ' },
      { name: 'Banana', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', telugu: 'అరటి', hindi: 'केला', tamil: 'வாழை', kannada: 'ಬಾಳೆ', malayalam: 'വാഴപ്പഴം' },
      { name: 'Mango', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop', telugu: 'మామిడి', hindi: 'आम', tamil: 'மாம்பழம்', kannada: 'ಮಾವಿನ ಹಣ್ಣು', malayalam: 'മാമ്പഴം' },
      { name: 'Orange', image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop', telugu: 'నారింజ', hindi: 'संतरा', tamil: 'ஆரஞ்சு', kannada: 'ಕಿತ್ತಳೆ', malayalam: 'ഓറഞ്ച്' },
      { name: 'Grapes', image: 'https://images.unsplash.com/photo-1599819177326-1d38c79f6116?w=400&h=400&fit=crop', telugu: 'ద్రాక్ష', hindi: 'अंगूर', tamil: 'திராட்சை', kannada: 'ದ್ರಾಕ್ಷಿ', malayalam: 'മുന്തിരി' },
      { name: 'Watermelon', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784e38?w=400&h=400&fit=crop', telugu: 'పుచ్చకాయ', hindi: 'तरबूज', tamil: 'தர்பூசணி', kannada: 'ಕಲ್ಲಂಗಡಿ', malayalam: 'തണ്ണിമത്തൻ' },
      { name: 'Pomegranate', image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=400&h=400&fit=crop', telugu: 'దానిమ్మ', hindi: 'अनार', tamil: 'மாதுளை', kannada: 'ದಾಳಿಂಬೆ', malayalam: 'മാതളം' },
      { name: 'Papaya', image: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400&h=400&fit=crop', telugu: 'బొప్పాయి', hindi: 'पपीता', tamil: 'பப்பாளி', kannada: 'ಪಪ್ಪಾಯ', malayalam: 'പപ്പായ' },
      { name: 'Guava', image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=400&fit=crop', telugu: 'జామ', hindi: 'अमरूद', tamil: 'கொய்யா', kannada: 'ಪೇರಲ', malayalam: 'പേരക്ക' },
      { name: 'Pineapple', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop', telugu: 'అనాస', hindi: 'अनानास', tamil: 'அன்னாசி', kannada: 'ಅನಾನಸ್', malayalam: 'കൈതച്ചക്ക' },
      { name: 'Dragon Fruit', image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&h=400&fit=crop', telugu: 'డ్రాగన్ ఫ్రూట్', hindi: 'ड्रैगन फल', tamil: 'டிராகன் பழம்', kannada: 'ಡ್ರ್ಯಾಗನ್ ಫ್ರೂಟ್', malayalam: 'ഡ്രാഗൺ ഫ്രൂട്ട്' },
      { name: 'Strawberry', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop', telugu: 'స్ట్రాబెర్రీ', hindi: 'स्ट्रॉबेरी', tamil: 'ஸ்ட்ராபெரி', kannada: 'ಸ್ಟ್ರಾಬೆರಿ', malayalam: 'സ്ട്രോബെറി' },
    ],
    vegetables: [
      { name: 'Tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop', telugu: 'టమాటో', hindi: 'टमाटर', tamil: 'தக்காளி', kannada: 'ಟೊಮೇಟೊ', malayalam: 'തക്കാളി' },
      { name: 'Potato', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', telugu: 'బంగాళదుంప', hindi: 'आलू', tamil: 'உருளைக்கிழங்கு', kannada: 'ಆಲೂಗೆಡ್ಡೆ', malayalam: 'ഉരുളക്കിഴങ്ങ്' },
      { name: 'Onion', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop', telugu: 'ఉల్లిపాయ', hindi: 'प्याज', tamil: 'வெங்காயம்', kannada: 'ಈರುಳ್ಳಿ', malayalam: 'ഉള്ളി' },
      { name: 'Carrot', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop', telugu: 'క్యారెట్', hindi: 'गाजर', tamil: 'கேரட்', kannada: 'ಕ್ಯಾರೆಟ್', malayalam: 'കാരറ്റ്' },
      { name: 'Cabbage', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop', telugu: 'క్యాబేజీ', hindi: 'पत्तागोभी', tamil: 'முட்டைகோஸ்', kannada: 'ಎಲೆಕೋಸು', malayalam: 'കാബേജ്' },
      { name: 'Brinjal', image: 'https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=400&h=400&fit=crop', telugu: 'వంకాయ', hindi: 'बैंगन', tamil: 'கத்திரிக்காய்', kannada: 'ಬದನೆಕಾಯಿ', malayalam: 'വഴുതന' },
      { name: 'Cauliflower', image: 'https://images.unsplash.com/photo-1568584711271-0ee13c80e333?w=400&h=400&fit=crop', telugu: 'కాలీఫ్లవర్', hindi: 'फूलगोभी', tamil: 'காலிஃப்ளவர்', kannada: 'ಹೂಕೋಸು', malayalam: 'കോളിഫ്ലവർ' },
      { name: 'Capsicum', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop', telugu: 'క్యాప్సికం', hindi: 'शिमला मिर्च', tamil: 'குடமிளகாய்', kannada: 'ಕ್ಯಾಪ್ಸಿಕಮ್', malayalam: 'കാപ്സിക്കം' },
      { name: 'Cucumber', image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop', telugu: 'దోసకాయ', hindi: 'खीरा', tamil: 'வெள்ளரிக்காய்', kannada: 'ಸೌತೆಕಾಯಿ', malayalam: 'വെള്ളരിക്ക' },
      { name: 'Beetroot', image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop', telugu: 'బీట్‌రూట్', hindi: 'चुकंदर', tamil: 'பீட்ரூட்', kannada: 'ಬೀಟ್ರೂಟ್', malayalam: 'ബീറ്റ്റൂട്ട്' },
      { name: 'Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop', telugu: 'పాలకూర', hindi: 'पालक', tamil: 'கீரை', kannada: 'ಸೊಪ್ಪು', malayalam: 'ചീര' },
      { name: 'Pumpkin', image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=400&fit=crop', telugu: 'గుమ్మడికాయ', hindi: 'कद्दू', tamil: 'பூசணிக்காய்', kannada: 'ಕುಂಬಳಕಾಯಿ', malayalam: 'മത്തങ്ങ' },
      { name: 'Bitter Gourd', image: 'https://images.unsplash.com/photo-1610416530796-36e8296d9b38?w=400&h=400&fit=crop', telugu: 'కాకరకాయ', hindi: 'करेला', tamil: 'பாகற்காய்', kannada: 'ಹಾಗಲಕಾಯಿ', malayalam: 'പാവയ്ക്ക' },
      { name: 'Bottle Gourd', image: 'https://images.unsplash.com/photo-1619113666558-3dde02c6bb80?w=400&h=400&fit=crop', telugu: 'సొరకాయ', hindi: 'लौकी', tamil: 'சுரைக்காய்', kannada: 'ಸೋರೇಕಾಯಿ', malayalam: 'ചുരയ്ക്ക' },
      { name: 'Green Chilli', image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=400&fit=crop', telugu: 'పచ్చి మిర్చి', hindi: 'हरी मिर्च', tamil: 'பச்சை மிளகாய்', kannada: 'ಹಸಿ ಮೆಣಸು', malayalam: 'പച്ച മുളക്' },
      { name: 'Lady Finger', image: 'https://images.unsplash.com/photo-1592411853175-a2b12ae5802c?w=400&h=400&fit=crop', telugu: 'బెండకాయ', hindi: 'भिंडी', tamil: 'வெண்டைக்காய்', kannada: 'ಬೆಂಡೆಕಾಯಿ', malayalam: 'വെണ്ടക്ക' },
    ],
    millets: [
      { name: 'Pearl Millet', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', telugu: 'సజ్జలు', hindi: 'बाजरा', tamil: 'கம்பு', kannada: 'ಸಜ್ಜೆ', malayalam: 'കമ്പ്' },
      { name: 'Finger Millet', image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=400&h=400&fit=crop', telugu: 'రాగి', hindi: 'रागी', tamil: 'கேழ்வரகு', kannada: 'ರಾಗಿ', malayalam: 'രാഗി' },
      { name: 'Foxtail Millet', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', telugu: 'కొర్రలు', hindi: 'कंगनी', tamil: 'தினை', kannada: 'ನವಣೆ', malayalam: 'തിന' },
      { name: 'Sorghum', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', telugu: 'జొన్నలు', hindi: 'ज्वार', tamil: 'சோளம்', kannada: 'ಜೋಳ', malayalam: 'ചോളം' },
      { name: 'Little Millet', image: 'https://images.unsplash.com/photo-1605799937151-38a8fe81edce?w=400&h=400&fit=crop', telugu: 'సామలు', hindi: 'कुटकी', tamil: 'சாமை', kannada: 'ಸಾವೆ', malayalam: 'ചാമ' },
      { name: 'Barnyard Millet', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', telugu: 'ఒడలు', hindi: 'झंगोरा', tamil: 'குதிரைவாலி', kannada: 'ಕೊರಲೆ', malayalam: 'കവടം' },
      { name: 'Kodo Millet', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', telugu: 'అరికలు', hindi: 'कोदो', tamil: 'வரகு', kannada: 'ಹಾರಕ', malayalam: 'കൊടോ' },
      { name: 'Proso Millet', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', telugu: 'వరిగలు', hindi: 'चीना', tamil: 'பனிவரகு', kannada: 'ಬಾರಗು', malayalam: 'പ്രോസോ' },
    ],
    grains: [
      { name: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', telugu: 'బియ్యం', hindi: 'चावल', tamil: 'அரிசி', kannada: 'ಅಕ್ಕಿ', malayalam: 'അരി' },
      { name: 'Wheat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', telugu: 'గోధుమ', hindi: 'गेहूं', tamil: 'கோதுமை', kannada: 'ಗೋಧಿ', malayalam: 'ഗോതമ്പ്' },
      { name: 'Corn', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop', telugu: 'మొక్కజొన్న', hindi: 'मक्का', tamil: 'சோளம்', kannada: 'ಮೆಕ್ಕೆಜೋಳ', malayalam: 'ചോളം' },
      { name: 'Barley', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&h=400&fit=crop', telugu: 'బార్లీ', hindi: 'जौ', tamil: 'வாற்கோதுமை', kannada: 'ಬಾರ್ಲಿ', malayalam: 'ബാർലി' },
      { name: 'Black Gram', image: 'https://images.unsplash.com/photo-1605799937151-38a8fe81edce?w=400&h=400&fit=crop', telugu: 'మినుములు', hindi: 'उड़द', tamil: 'உளுந்து', kannada: 'ಉದ್ದು', malayalam: 'ഉഴുന്ന്' },
      { name: 'Green Gram', image: 'https://images.unsplash.com/photo-1587217932378-7c7ae3889d41?w=400&h=400&fit=crop', telugu: 'పెసలు', hindi: 'मूंग', tamil: 'பயறு', kannada: 'ಹೆಸರು', malayalam: 'പയർ' },
      { name: 'Red Gram', image: 'https://images.unsplash.com/photo-1616671276441-9c2c9b937a31?w=400&h=400&fit=crop', telugu: 'కందులు', hindi: 'अरहर', tamil: 'துவரம் பருப்பு', kannada: 'ತೊಗರಿ', malayalam: 'തുവര' },
      { name: 'Bengal Gram', image: 'https://images.unsplash.com/photo-1594756202469-9ff9799b2e4e?w=400&h=400&fit=crop', telugu: 'శనగలు', hindi: 'चना', tamil: 'கடலை', kannada: 'ಕಡಲೆ', malayalam: 'കടല' },
    ],
    dairy: [
      { name: 'Fresh Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop', telugu: 'పాలు', hindi: 'दूध', tamil: 'பால்', kannada: 'ಹಾಲು', malayalam: 'പാല്' },
      { name: 'Curd', image: 'https://images.unsplash.com/photo-1571212515416-65e2f27c323c?w=400&h=400&fit=crop', telugu: 'పెరుగు', hindi: 'दही', tamil: 'தயிர்', kannada: 'ಮೊಸರು', malayalam: 'തൈര്' },
      { name: 'Butter', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=400&fit=crop', telugu: 'వెన్న', hindi: 'मक्खन', tamil: 'வெண்ணெய்', kannada: 'ಬೆಣ್ಣೆ', malayalam: 'വെണ്ണ' },
      { name: 'Ghee', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop', telugu: 'నెయ్యి', hindi: 'घी', tamil: 'நெய்', kannada: 'ತುಪ್ಪ', malayalam: 'നെയ്യ്' },
      { name: 'Paneer', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=400&fit=crop', telugu: 'పన్నీర్', hindi: 'पनीर', tamil: 'பன்னீர்', kannada: 'ಪನೀರ್', malayalam: 'പനീർ' },
      { name: 'Cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop', telugu: 'చీజ్', hindi: 'चीज़', tamil: 'சீஸ்', kannada: 'ಚೀಸ್', malayalam: 'ചീസ്' },
      { name: 'Buttermilk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop', telugu: 'మజ్జిగ', hindi: 'छाछ', tamil: 'மோர்', kannada: 'ಮಜ್ಜಿಗೆ', malayalam: 'മോര്' },
      { name: 'Cream', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop', telugu: 'క్రీమ్', hindi: 'क्रीम', tamil: 'க்ரீம்', kannada: 'ಕ್ರೀಮ್', malayalam: 'ക്രീം' },
      { name: 'Lassi', image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=400&fit=crop', telugu: 'లస్సీ', hindi: 'लस्सी', tamil: 'லஸ்ஸி', kannada: 'ಲಸ್ಸಿ', malayalam: 'ലസ്സി' },
      { name: 'Fresh Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop', telugu: 'గుడ్లు', hindi: 'अंडे', tamil: 'முட்டை', kannada: 'ಮೊಟ್ಟೆ', malayalam: 'മുട്ട' },
      { name: 'Yogurt', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop', telugu: 'యోగర్ట్', hindi: 'योगर्ट', tamil: 'யோகர்ட்', kannada: 'ಯೋಗರ್ಟ್', malayalam: 'യോഗർട്ട്' },
      { name: 'Cottage Cheese', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop', telugu: 'కాటేజ్ చీజ్', hindi: 'छेना', tamil: 'காடேஜ் சீஸ்', kannada: 'ಕಾಟೇಜ್ ಚೀಸ್', malayalam: 'കോട്ടേജ് ചീസ്' },
    ],
  };

  const items = itemsData[category] || [];

  const getLocalizedName = (item) => {
    if (language === 'telugu') return item.telugu;
    if (language === 'hindi') return item.hindi;
    if (language === 'tamil') return item.tamil;
    if (language === 'kannada') return item.kannada;
    if (language === 'malayalam') return item.malayalam;
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
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all border-4 border-transparent hover:border-farm-green"
            >
              <div className="h-40 overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x400/22c55e/ffffff?text=' + item.name;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">{getLocalizedName(item)}</h3>
                <p className="text-sm text-gray-600">{item.name}</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ItemsList;
