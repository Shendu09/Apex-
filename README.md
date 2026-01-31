# Farm Bridge 🌾

A hyperlocal e-commerce platform connecting farmers directly with consumers.

## Features

### 🚜 Farmer Features
- Phone & OTP authentication
- Multi-language support (English, Hindi, Telugu, Tamil, Kannada, Malayalam)
- Voice-to-text product listing
- Product categories (Fruits, Vegetables, Millets, Grains)
- Real-time market rates
- Order tracking with maps
- Photo upload (profile & product)
- Payment management
- Dashboard with analytics

### 🛒 Buyer Features
- Hyperlocal farmer discovery
- Product browsing by category
- Farmer profiles with ratings & reviews
- Direct payment to farmers (Bank/UPI)
- Order history
- Return policy
- Real-time delivery tracking
- Cart & checkout system

## Tech Stack

- **Frontend:** React 18
- **Styling:** Tailwind CSS 3
- **Routing:** React Router DOM 6
- **Speech Recognition:** Web Speech API
- **Storage:** LocalStorage

## Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm start
```

3. **Build for production:**
```bash
npm build
```

The app will open at `http://localhost:3000`

## Demo Credentials

### Login
- Phone: Any 10-digit number
- OTP: 123456 (auto-filled)

### Test Flow

**Farmer Flow:**
1. Login → Select Language → Choose "Farmer"
2. Add products using voice or manual input
3. Upload product photos
4. Track orders on dashboard
5. View payments & reviews

**Buyer Flow:**
1. Login → Select Language → Choose "Buyer"
2. Browse nearby farmers
3. Select products and add to cart
4. Proceed to checkout
5. Make payment (UPI/COD)
6. Track order delivery

## Project Structure

```
Farm Bridge/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── LoginPage.js
│   │   ├── LanguageSelection.js
│   │   ├── UserTypeSelection.js
│   │   ├── FarmerDashboard.js
│   │   ├── FarmerProfile.js
│   │   ├── CategorySelection.js
│   │   ├── ItemsList.js
│   │   ├── ProductDetails.js
│   │   ├── OrderTracking.js
│   │   ├── BuyerDashboard.js
│   │   ├── BuyerProfile.js
│   │   ├── FarmersList.js
│   │   ├── BuyerProductView.js
│   │   ├── CheckoutPage.js
│   │   └── OrderHistory.js
│   ├── translations.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Features Implementation

### Voice Input
- Uses Web Speech API
- Supports multiple Indian languages
- Auto-converts speech to text
- Fallback to manual input

### Image Upload
- File input with preview
- Base64 encoding for storage
- Supports farmer photo & product photos

### Multi-language Support
- 6 languages supported
- Persistent language selection
- Dynamic UI translation

### Payment Integration
- Direct farmer payment details display
- Bank account & UPI information
- Multiple payment methods

### Order Management
- Real-time order tracking
- Status updates (Pending, In-Transit, Delivered)
- Order history with reorder option

## Browser Support

- Chrome (recommended for voice input)
- Firefox
- Safari
- Edge

## Year

© 2026 Farm Bridge. All rights reserved.

## Notes

- Voice input requires microphone permission
- Works best on Chrome browser
- Demo uses LocalStorage for data persistence
- For production, integrate with backend API
- Add Google Maps API for actual tracking

## Future Enhancements

- Real-time notifications
- Live chat with farmers
- Payment gateway integration
- Google Maps integration
- Push notifications
- SMS/WhatsApp integration
- Rating & review system
- Analytics dashboard
- Admin panel
