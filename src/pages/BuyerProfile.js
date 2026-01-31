import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const BuyerProfile = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    address: '123, MG Road, Bangalore',
    pincode: '560001',
    preferences: 'Organic vegetables',
  });

  const handleSave = () => {
    localStorage.setItem('buyerProfile', JSON.stringify(profile));
    setIsEditing(false);
    alert('Profile saved successfully!');
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
          <h1 className="text-xl font-bold">{t('profile')}</h1>
          <button onClick={() => setIsEditing(!isEditing)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Profile Icon */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('name')}</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('deliveryAddress')}</label>
              <textarea
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                disabled={!isEditing}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Pincode</label>
              <input
                type="text"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Preferences</label>
              <input
                type="text"
                value={profile.preferences}
                onChange={(e) => setProfile({ ...profile, preferences: e.target.value })}
                disabled={!isEditing}
                placeholder="E.g., Organic vegetables, Fresh fruits"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full mt-6 bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-4 rounded-lg transition-colors shadow-lg"
            >
              {t('save')}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyerProfile;
