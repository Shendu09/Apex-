# Farm Bridge Backend API

Complete Node.js/Express backend for Farm Bridge hyperlocal e-commerce platform connecting farmers directly with consumers.

## Features

### Authentication
- ✅ Phone number + OTP authentication using Twilio
- ✅ JWT token-based session management
- ✅ User type selection (Farmer/Buyer)

### User Management
- ✅ Profile creation and updates
- ✅ Photo upload with Cloudinary
- ✅ Location tracking with coordinates
- ✅ Multi-language support (6 Indian languages)
- ✅ Rating system

### Product Management
- ✅ CRUD operations for products
- ✅ Category-based organization (Fruits, Vegetables, Millets, Grains)
- ✅ Multiple image uploads
- ✅ Location-based product search
- ✅ Price and quantity management
- ✅ Market rate tracking
- ✅ Organic certification

### Order Management
- ✅ Order creation and tracking
- ✅ Real-time status updates via Socket.IO
- ✅ Multiple payment methods (UPI, COD, Bank Transfer)
- ✅ Order cancellation and returns
- ✅ Delivery tracking with route history
- ✅ Order history

### Location Services (OpenStreetMap)
- ✅ Geocoding (address to coordinates)
- ✅ Reverse geocoding (coordinates to address)
- ✅ Distance calculation
- ✅ Route planning with OSRM
- ✅ Nearby farmer search
- ✅ Place search

### Reviews & Ratings
- ✅ Product reviews
- ✅ Farmer ratings
- ✅ Review responses
- ✅ Verified purchase reviews
- ✅ Helpful votes

### Real-time Features
- ✅ WebSocket connections via Socket.IO
- ✅ Live order updates
- ✅ Real-time location tracking
- ✅ Instant notifications

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Twilio (OTP)
- **File Upload**: Multer + Cloudinary
- **Real-time**: Socket.IO
- **Maps**: OpenStreetMap (Nominatim API + OSRM)
- **SMS**: Twilio
- **Security**: Helmet, CORS, Rate Limiting

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables in `.env`:
   - MongoDB connection string
   - JWT secret key
   - Twilio credentials (for OTP)
   - Cloudinary credentials (for image uploads)

## Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login/register
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-photo` - Upload profile photo
- `GET /api/users/nearby-farmers` - Get nearby farmers (buyers)
- `GET /api/users/farmer/:id` - Get farmer details
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/account` - Deactivate account

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (farmers)
- `PUT /api/products/:id` - Update product (farmers)
- `DELETE /api/products/:id` - Delete product (farmers)
- `POST /api/products/:id/images` - Upload product images
- `GET /api/products/farmer/:farmerId` - Get farmer's products
- `GET /api/products/category/:category` - Get products by category

### Orders
- `POST /api/orders` - Create new order (buyers)
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (farmers)
- `PUT /api/orders/:id/tracking` - Update tracking location
- `POST /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/return` - Request return (buyers)

### Reviews
- `POST /api/reviews` - Create review (buyers)
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/farmer/:farmerId` - Get farmer reviews
- `PUT /api/reviews/:id` - Update review
- `POST /api/reviews/:id/response` - Farmer response to review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Location (OpenStreetMap)
- `GET /api/location/geocode` - Convert address to coordinates
- `GET /api/location/reverse` - Convert coordinates to address
- `POST /api/location/update` - Update user location
- `GET /api/location/route` - Get route between two points
- `GET /api/location/distance` - Calculate distance
- `GET /api/location/search` - Search places near location

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/refund` - Process refund

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/fcm-token` - Save FCM token
- `PUT /api/notifications/:id/read` - Mark as read

## Database Models

### User
- Phone number, user type (farmer/buyer)
- Profile details (name, age, photo, address)
- Location with geospatial indexing
- Payment information
- Rating and verification status

### Product
- Farmer reference
- Category, name, description
- Images (Cloudinary URLs)
- Price and quantity
- Market rates
- Location coordinates
- Status and ratings

### Order
- Buyer and farmer references
- Product details
- Quantity and pricing
- Delivery and pickup addresses
- Status tracking history
- Real-time location tracking
- Payment information
- Return requests

### Review
- Order, product, farmer references
- Multiple rating categories
- Comments and images
- Farmer responses
- Helpful votes

### OTP
- Phone number and OTP code
- Expiry timestamp (auto-delete after expiry)
- Verification status

## Real-time Events (Socket.IO)

### Client to Server
- `joinRoom` - Join user-specific room

### Server to Client
- `newOrder` - New order notification (farmer)
- `orderUpdate` - Order status update (buyer)
- `orderCancelled` - Order cancelled notification
- `locationUpdate` - Real-time delivery location
- `returnRequest` - Return request notification (farmer)

## Security Features

- JWT authentication middleware
- User type authorization
- Helmet for HTTP headers security
- CORS protection
- Rate limiting
- Input validation
- Geospatial queries with indexing

## OpenStreetMap Integration

### Nominatim API
Used for geocoding and reverse geocoding addresses in India.

### OSRM (Open Source Routing Machine)
Used for calculating routes between delivery points with turn-by-turn directions.

### Features
- No API key required (free)
- India-specific location search
- Distance calculation using Haversine formula
- Route optimization for deliveries

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use MongoDB Atlas for database
3. Set up Cloudinary for image storage
4. Configure Twilio for SMS
5. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name farm-bridge-api
```

## Year: 2026

Built for the future of hyperlocal agriculture commerce.

---

For frontend integration, update API base URL in React app to point to this backend server.
