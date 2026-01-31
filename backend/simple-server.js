const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// In-memory storage
const users = new Map();
const otps = new Map();

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend connected!', timestamp: new Date().toISOString() });
});

app.post('/api/auth/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || phoneNumber.length !== 10) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(phoneNumber, { otp, expiresAt: Date.now() + 600000 });
  console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
  res.json({ success: true, message: 'OTP sent', otp });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phoneNumber, otp, userType, language } = req.body;
  const otpData = otps.get(phoneNumber);
  
  if (!otpData || otpData.otp !== otp || Date.now() > otpData.expiresAt) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }
  
  let user = users.get(phoneNumber) || {
    id: Date.now().toString(),
    phoneNumber,
    userType: userType || 'buyer',
    language: language || 'english',
    name: '',
    createdAt: new Date().toISOString()
  };
  
  if (userType) user.userType = userType;
  if (language) user.language = language;
  users.set(phoneNumber, user);
  otps.delete(phoneNumber);
  
  const token = Buffer.from(phoneNumber).toString('base64');
  console.log(`✅ User logged in: ${phoneNumber}`);
  res.json({ success: true, message: 'Login successful', token, user });
});

app.get('/api/users/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  
  const phoneNumber = Buffer.from(token, 'base64').toString();
  const user = users.get(phoneNumber);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  res.json({ success: true, user });
});

app.put('/api/users/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  
  const phoneNumber = Buffer.from(token, 'base64').toString();
  const user = users.get(phoneNumber);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  
  Object.assign(user, req.body);
  users.set(phoneNumber, user);
  res.json({ success: true, message: 'Profile updated', user });
});

app.post('/api/users/upload-photo', (req, res) => {
  res.json({ success: true, message: 'Photo uploaded', photoUrl: 'https://via.placeholder.com/150' });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`\n🚀 Farm Bridge Backend (Simple Mode) - Port ${PORT}`);
  console.log(`✅ Ready! Frontend at http://localhost:3000 can now connect\n`);
});
