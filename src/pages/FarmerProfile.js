import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const FarmerProfile = ({ language }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ramesh Kumar',
    age: '45',
    place: 'Guntur, Andhra Pradesh',
    bankAccount: '1234567890',
    upiId: 'ramesh@upi',
    photo: null,
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('farmerProfile', JSON.stringify(profile));
    setIsEditing(false);
    alert('Profile saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/farmer/dashboard')} className="p-2">
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
          {/* Photo Upload */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-farm-green text-white p-2 rounded-full cursor-pointer hover:bg-farm-dark-green">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
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
              <label className="block text-gray-700 font-medium mb-2">{t('age')}</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('place')}</label>
              <input
                type="text"
                value={profile.place}
                onChange={(e) => setProfile({ ...profile, place: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('bankAccount')}</label>
              <input
                type="text"
                value={profile.bankAccount}
                onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg outline-none focus:border-farm-green disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">{t('upiId')}</label>
              <input
                type="text"
                value={profile.upiId}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                disabled={!isEditing}
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

export default FarmerProfile;
