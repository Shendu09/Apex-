import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmersList = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const [farmers] = useState([
    {
      id: 1,
      name: 'Ramesh Kumar',
      photo: null,
      location: 'Guntur, AP',
      distance: '2.5 km',
      rating: 4.8,
      reviews: 45,
      bankAccount: '1234567890',
      specialties: ['Vegetables', 'Fruits'],
      verified: true,
    },
    {
      id: 2,
      name: 'Suresh Reddy',
      photo: null,
      location: 'Vijayawada, AP',
      distance: '5.2 km',
      rating: 4.6,
      reviews: 32,
      bankAccount: '0987654321',
      specialties: ['Millets', 'Grains'],
      verified: true,
    },
    {
      id: 3,
      name: 'Ganesh Patel',
      photo: null,
      location: 'Bangalore, KA',
      distance: '3.8 km',
      rating: 4.9,
      reviews: 67,
      bankAccount: '1122334455',
      specialties: ['Organic Vegetables'],
      verified: true,
    },
  ]);

  const handleFarmerClick = (farmerId) => {
    navigate(`/buyer/product/${farmerId}/tomato`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/buyer/dashboard')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{t('nearbyFarmers')}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <select className="flex-1 outline-none text-lg">
              <option>Sort by: Nearest</option>
              <option>Sort by: Rating</option>
              <option>Sort by: Reviews</option>
            </select>
          </div>
        </div>

        {/* Farmers List */}
        <div className="space-y-4">
          {farmers.map((farmer) => (
            <div
              key={farmer.id}
              onClick={() => handleFarmerClick(farmer.id)}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                {/* Farmer Photo */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                  {farmer.photo ? (
                    <img src={farmer.photo} alt={farmer.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Farmer Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{farmer.name}</h3>
                    {farmer.verified && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{farmer.location} • {farmer.distance}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center text-yellow-500">
                      <span className="text-xl">⭐</span>
                      <span className="ml-1 font-bold text-gray-800">{farmer.rating}</span>
                    </div>
                    <span className="text-gray-600">({farmer.reviews} {t('reviews')})</span>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {farmer.specialties.map((specialty, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  {/* Bank Account */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">{t('bankAccount')}</p>
                    <p className="font-mono font-semibold text-gray-800">{farmer.bankAccount}</p>
                  </div>
                </div>
              </div>

              {/* View Products Button */}
              <button className="w-full mt-4 bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-3 rounded-lg transition-colors">
                View Products
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default FarmersList;
