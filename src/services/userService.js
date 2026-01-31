import api from './api';

export const userService = {
  // Get profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data.user;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    // Update local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...user, ...response.data.user }));
    return response.data.user;
  },

  // Upload photo
  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    const response = await api.post('/users/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Get nearby farmers
  getNearbyFarmers: async (latitude, longitude, radius = 50) => {
    const response = await api.get('/users/nearby-farmers', {
      params: { latitude, longitude, radius },
    });
    return response.data.farmers;
  },

  // Get farmer details
  getFarmer: async (farmerId) => {
    const response = await api.get(`/users/farmer/${farmerId}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data.stats;
  },
};
