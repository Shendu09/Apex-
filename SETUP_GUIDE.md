# Farm Bridge - Complete Setup Guide

## 🚀 Project Overview

Farm Bridge is a hyperlocal e-commerce platform that connects farmers directly with consumers, eliminating middlemen. Built with React frontend and Node.js/Express backend.

**Year: 2026**

---

## 📁 Project Structure

```
Farm Bridge/
├── src/                    # React Frontend
│   ├── pages/             # All page components
│   ├── translations.js    # Multi-language support
│   ├── App.js            # Main app with routing
│   └── index.js          # React entry point
├── public/               # Static assets
├── backend/              # Node.js Backend API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Helper functions
│   ├── server.js        # Express server
│   └── .env             # Environment variables
├── package.json         # Frontend dependencies
└── README.md           # This file
```

---

## 🔧 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control

---

## 📦 Installation

### 1. Frontend Setup

```bash
# Navigate to project root
cd "c:\Users\bharu\OneDrive\Desktop\Farm Bridge"

# Install frontend dependencies
npm install

# Start frontend development server
npm start
```

Frontend will run on: **http://localhost:3000**

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Configure environment variables (see next section)

# Start backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Edit `backend/.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Install MongoDB locally or use MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/farm-bridge

# JWT Secret - Change this in production
JWT_SECRET=your_secure_jwt_secret_key_here

# Twilio (for OTP SMS) - Get free account at https://www.twilio.com
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Cloudinary (for image uploads) - Free account at https://cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OpenStreetMap - No API key required
NOMINATIM_API_URL=https://nominatim.openstreetmap.org

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Run installer and install as a service

2. **Start MongoDB**
   ```bash
   # MongoDB should start automatically as a service
   # Check status with:
   mongosh
   ```

3. **Database will be created automatically** when you start the backend server

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farm-bridge
   ```

---

## 🔑 Third-Party Service Setup

### 1. Twilio (SMS/OTP)

**Purpose:** Send OTP for phone authentication

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get free trial account ($15 credit)
3. From Console Dashboard, copy:
   - Account SID
   - Auth Token
   - Phone Number
4. Add to `.env` file

**Note:** In development mode, OTP will be logged to console if Twilio is not configured.

### 2. Cloudinary (Image Storage)

**Purpose:** Store product and profile images

1. Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
2. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add to `.env` file

**Note:** You can also use local file storage, but Cloudinary is recommended for production.

### 3. OpenStreetMap (Location Services)

**Purpose:** Geocoding, routing, and maps

✅ **No API key required** - Free to use!

- Uses Nominatim API for geocoding
- Uses OSRM for route calculation
- Already configured in backend

---

## 🚀 Running the Application

### Development Mode (Both servers)

**Terminal 1 - Frontend:**
```bash
cd "c:\Users\bharu\OneDrive\Desktop\Farm Bridge"
npm start
```

**Terminal 2 - Backend:**
```bash
cd "c:\Users\bharu\OneDrive\Desktop\Farm Bridge\backend"
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/api/health

---

## 🧪 Testing the Application

### 1. Phone Authentication

- Enter any 10-digit phone number
- In development mode, check backend console for OTP
- Enter OTP to login

### 2. User Flow

**Farmer:**
1. Login → Select Language → Choose "Farmer"
2. Complete profile with photo
3. Add products with images and location
4. Manage orders from buyers
5. Track deliveries

**Buyer:**
1. Login → Select Language → Choose "Buyer"
2. Browse nearby farmers and products
3. View product details with farmer info
4. Place orders
5. Track delivery in real-time
6. Rate and review

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & Login

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-photo` - Upload photo
- `GET /api/users/nearby-farmers` - Find nearby farmers

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (farmer)
- `PUT /api/products/:id` - Update product
- `POST /api/products/:id/images` - Upload images

### Orders
- `POST /api/orders` - Create order (buyer)
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update status (farmer)
- `PUT /api/orders/:id/tracking` - Update location

### Location (OpenStreetMap)
- `GET /api/location/geocode` - Address → Coordinates
- `GET /api/location/reverse` - Coordinates → Address
- `GET /api/location/route` - Calculate route
- `GET /api/location/distance` - Calculate distance

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/product/:id` - Product reviews
- `GET /api/reviews/farmer/:id` - Farmer reviews

For complete API documentation, see [backend/README.md](backend/README.md)

---

## 🌐 Frontend Features

✅ **Authentication**
- Phone + OTP login
- Session management

✅ **Multi-language Support**
- English, Hindi, Telugu, Tamil, Kannada, Malayalam
- Native script support

✅ **Voice Input**
- Voice-to-text for product details
- Supports 6 Indian languages

✅ **Farmer Features**
- Dashboard with statistics
- Product management
- Order tracking
- Profile with payment details

✅ **Buyer Features**
- Browse nearby farmers
- Product search and filters
- Shopping cart
- Order history
- Reviews and ratings

✅ **Responsive Design**
- Mobile-first approach
- Tailwind CSS styling
- Green theme (#22c55e)

---

## 🔧 Backend Features

✅ **Authentication & Authorization**
- JWT tokens
- OTP verification via Twilio
- Role-based access (Farmer/Buyer)

✅ **Database**
- MongoDB with Mongoose
- Geospatial indexes for location
- Auto-generated order IDs

✅ **Location Services**
- OpenStreetMap geocoding
- Distance calculation
- Route planning
- Nearby search

✅ **Real-time Updates**
- Socket.IO integration
- Live order updates
- Delivery tracking

✅ **File Uploads**
- Cloudinary integration
- Image optimization
- Multi-file uploads

✅ **Security**
- Helmet for HTTP headers
- CORS configuration
- Rate limiting
- Input validation

---

## 🛠️ Development Commands

### Frontend
```bash
npm start          # Start dev server
npm build          # Production build
npm test           # Run tests
```

### Backend
```bash
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Ensure MongoDB is installed and running
2. Check connection string in `.env`
3. For Windows, check MongoDB service is running:
   ```bash
   services.msc
   # Look for "MongoDB" service
   ```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
1. Change port in package.json scripts or set PORT environment variable
2. Or kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### OTP Not Received

**Problem:** SMS OTP not arriving

**Solution:**
1. Check Twilio credentials in `.env`
2. In development mode, OTP is logged to backend console
3. Check Twilio console for SMS logs

### Image Upload Failing

**Problem:** Images not uploading

**Solution:**
1. Verify Cloudinary credentials in `.env`
2. Check file size (max 5MB)
3. Ensure file is image format (jpg, png, webp)

---

## 📱 Production Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy 'build' folder to hosting service
```

### Backend (Railway/Heroku/DigitalOcean)

1. Set environment variables on hosting platform
2. Use MongoDB Atlas for database
3. Set `NODE_ENV=production`
4. Deploy with:
   ```bash
   npm start
   ```

### Environment Variables for Production

Update all `.env` values:
- Use strong JWT_SECRET
- Use production MongoDB URI
- Configure real Twilio account
- Set proper CORS origins

---

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is created for educational and demonstration purposes.

---

## 👥 Support

For issues or questions:
- Check [backend/README.md](backend/README.md) for API details
- Review troubleshooting section
- Check console logs for errors

---

## 🎯 Key Technologies

**Frontend:**
- React 18.2.0
- Tailwind CSS 3.3.0
- React Router DOM 6.20.0
- Web Speech API

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.IO (Real-time)
- Twilio (SMS)
- Cloudinary (Images)
- OpenStreetMap (Location)

---

**Built in 2026 for the future of agriculture commerce** 🌱
