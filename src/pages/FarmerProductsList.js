import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerProductsList = ({ language }) => {
  const navigate = useNavigate();
  const { farmerId } = useParams();
  const t = (key) => getTranslation(language, key);

  // Farmer data with their specific products
  const farmersData = {
    '1': {
      id: 1,
      name: 'Ramesh Kumar',
      location: 'Guntur, AP',
      distance: '2.5 km',
      rating: 4.8,
      reviews: 45,
      specialties: ['Fresh Vegetables', 'Leafy Greens'],
      products: [
        { name: 'Tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop', price: 30, unit: 'kg', available: 50 },
        { name: 'Onion', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=400&fit=crop', price: 40, unit: 'kg', available: 80 },
        { name: 'Potato', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop', price: 25, unit: 'kg', available: 100 },
        { name: 'Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop', price: 20, unit: 'kg', available: 30 },
        { name: 'Cabbage', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop', price: 35, unit: 'kg', available: 45 },
      ]
    },
    '2': {
      id: 2,
      name: 'Suresh Reddy',
      location: 'Vijayawada, AP',
      distance: '5.2 km',
      rating: 4.6,
      reviews: 32,
      specialties: ['Organic Millets', 'Traditional Grains'],
      products: [
        { name: 'Pearl Millet', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', price: 55, unit: 'kg', available: 60 },
        { name: 'Finger Millet', image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?w=400&h=400&fit=crop', price: 50, unit: 'kg', available: 40 },
        { name: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop', price: 45, unit: 'kg', available: 150 },
        { name: 'Wheat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop', price: 40, unit: 'kg', available: 120 },
        { name: 'Green Gram', image: 'https://images.unsplash.com/photo-1587217932378-7c7ae3889d41?w=400&h=400&fit=crop', price: 85, unit: 'kg', available: 50 },
      ]
    },
    '3': {
      id: 3,
      name: 'Ganesh Patel',
      location: 'Bangalore, KA',
      distance: '3.8 km',
      rating: 4.9,
      reviews: 67,
      specialties: ['Seasonal Fruits', 'Exotic Produce'],
      products: [
        { name: 'Mango', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop', price: 120, unit: 'kg', available: 80 },
        { name: 'Banana', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop', price: 50, unit: 'dozen', available: 100 },
        { name: 'Apple', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop', price: 150, unit: 'kg', available: 60 },
        { name: 'Pomegranate', image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc768?w=400&h=400&fit=crop', price: 180, unit: 'kg', available: 40 },
        { name: 'Dragon Fruit', image: 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&h=400&fit=crop', price: 250, unit: 'kg', available: 25 },
      ]
    },
    '4': {
      id: 4,
      name: 'Lakshmi Devi',
      location: 'Hyderabad, TS',
      distance: '4.1 km',
      rating: 4.7,
      reviews: 38,
      specialties: ['Root Vegetables', 'Gourds'],
      products: [
        { name: 'Carrot', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop', price: 35, unit: 'kg', available: 70 },
        { name: 'Beetroot', image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=400&h=400&fit=crop', price: 40, unit: 'kg', available: 55 },
        { name: 'Bottle Gourd', image: 'https://images.unsplash.com/photo-1619113666558-3dde02c6bb80?w=400&h=400&fit=crop', price: 30, unit: 'kg', available: 50 },
        { name: 'Bitter Gourd', image: 'https://images.unsplash.com/photo-1610416530796-36e8296d9b38?w=400&h=400&fit=crop', price: 45, unit: 'kg', available: 40 },
        { name: 'Pumpkin', image: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400&h=400&fit=crop', price: 28, unit: 'kg', available: 90 },
      ]
    },
    '5': {
      id: 5,
      name: 'Krishna Murthy',
      location: 'Chennai, TN',
      distance: '6.3 km',
      rating: 4.5,
      reviews: 28,
      specialties: ['Citrus Fruits', 'Tropical Produce'],
      products: [
        { name: 'Orange', image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop', price: 80, unit: 'kg', available: 65 },
        { name: 'Watermelon', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784e38?w=400&h=400&fit=crop', price: 35, unit: 'kg', available: 100 },
        { name: 'Papaya', image: 'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?w=400&h=400&fit=crop', price: 45, unit: 'kg', available: 70 },
        { name: 'Guava', image: 'https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=400&h=400&fit=crop', price: 60, unit: 'kg', available: 50 },
        { name: 'Pineapple', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop', price: 55, unit: 'piece', available: 80 },
      ]
    },
    '6': {
      id: 6,
      name: 'Vijay Singh',
      location: 'Pune, MH',
      distance: '7.8 km',
      rating: 4.8,
      reviews: 52,
      specialties: ['Premium Vegetables', 'Herbs'],
      products: [
        { name: 'Capsicum', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop', price: 60, unit: 'kg', available: 45 },
        { name: 'Brinjal', image: 'https://images.unsplash.com/photo-1659261200833-ec8761558af7?w=400&h=400&fit=crop', price: 35, unit: 'kg', available: 55 },
        { name: 'Cauliflower', image: 'https://images.unsplash.com/photo-1568584711271-0ee13c80e333?w=400&h=400&fit=crop', price: 45, unit: 'kg', available: 60 },
        { name: 'Green Chilli', image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=400&fit=crop', price: 80, unit: 'kg', available: 30 },
        { name: 'Cucumber', image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400&h=400&fit=crop', price: 30, unit: 'kg', available: 75 },
      ]
    },
  };

  const farmer = farmersData[farmerId] || farmersData['1'];

  const handleProductClick = (product) => {
    navigate(`/buyer/product/${farmerId}/${product.name.toLowerCase()}`, {
      state: { farmer, product }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/buyer/farmers')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{farmer.name}'s Products</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Farmer Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{farmer.name}</h2>
              <p className="text-gray-600">{farmer.location} • {farmer.distance}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center text-yellow-500">
                  <span>⭐</span>
                  <span className="ml-1 font-bold text-gray-800">{farmer.rating}</span>
                </div>
                <span className="text-gray-600">({farmer.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Specialties */}
          <div className="flex flex-wrap gap-2">
            {farmer.specialties.map((specialty, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Available Products ({farmer.products.length})</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {farmer.products.map((product, index) => (
            <button
              key={index}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <div className="h-40 bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/400x400/22c55e/ffffff?text=${product.name}`;
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-800 mb-1">{product.name}</h4>
                <p className="text-farm-green font-bold text-lg">₹{product.price}/{product.unit}</p>
                <p className="text-sm text-gray-600 mt-1">{product.available} {product.unit} available</p>
                <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                  Fresh Today
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FarmerProductsList;
