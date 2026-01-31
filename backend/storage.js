// In-Memory Storage for Farm Bridge (No Database Required)

const storage = {
  users: new Map(),
  products: new Map(),
  orders: new Map(),
  reviews: new Map(),
  otps: new Map(),
};

// Helper functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

module.exports = {
  storage,
  generateId,
  
  // User operations
  findUserByPhone: (phoneNumber) => {
    for (let [id, user] of storage.users) {
      if (user.phoneNumber === phoneNumber) return { ...user, _id: id };
    }
    return null;
  },
  
  createUser: (userData) => {
    const id = generateId();
    storage.users.set(id, { ...userData, createdAt: new Date() });
    return { ...userData, _id: id };
  },
  
  updateUser: (id, updates) => {
    const user = storage.users.get(id);
    if (user) {
      storage.users.set(id, { ...user, ...updates, updatedAt: new Date() });
      return { ...storage.users.get(id), _id: id };
    }
    return null;
  },
  
  // OTP operations
  saveOTP: (phoneNumber, otp) => {
    storage.otps.set(phoneNumber, {
      otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    });
  },
  
  verifyOTP: (phoneNumber, otp) => {
    const otpData = storage.otps.get(phoneNumber);
    if (!otpData) return false;
    if (Date.now() > otpData.expiresAt) {
      storage.otps.delete(phoneNumber);
      return false;
    }
    if (otpData.otp === otp) {
      storage.otps.delete(phoneNumber);
      return true;
    }
    return false;
  },
  
  // Product operations
  getAllProducts: (filters = {}) => {
    const products = Array.from(storage.products.values()).map((p, i) => ({
      ...p,
      _id: Array.from(storage.products.keys())[i]
    }));
    return products;
  },
  
  createProduct: (productData) => {
    const id = generateId();
    storage.products.set(id, { ...productData, createdAt: new Date() });
    return { ...productData, _id: id };
  },
  
  // Order operations
  createOrder: (orderData) => {
    const id = generateId();
    storage.orders.set(id, { ...orderData, createdAt: new Date(), status: 'pending' });
    return { ...orderData, _id: id };
  },
  
  getOrders: (userId) => {
    const orders = Array.from(storage.orders.entries())
      .filter(([id, order]) => order.buyer === userId || order.farmer === userId)
      .map(([id, order]) => ({ ...order, _id: id }));
    return orders;
  },
};
