const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'millets', 'grains'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  localizedNames: {
    telugu: String,
    hindi: String,
    tamil: String,
    kannada: String,
    malayalam: String
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    publicId: String // Cloudinary public ID
  }],
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'ton', 'piece', 'dozen', 'quintal'],
      default: 'kg'
    }
  },
  quantity: {
    available: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'gram', 'ton', 'piece', 'dozen', 'quintal'],
      default: 'kg'
    }
  },
  marketRate: {
    current: Number,
    demand: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    lastUpdated: Date
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  freshness: {
    type: String,
    default: 'Fresh'
  },
  organic: {
    type: Boolean,
    default: false
  },
  deliveryAddress: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'expired'],
    default: 'available'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  orders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
productSchema.index({ location: '2dsphere' });
productSchema.index({ farmer: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'price.amount': 1 });
productSchema.index({ createdAt: -1 });

// Virtual for total value
productSchema.virtual('totalValue').get(function() {
  return this.price.amount * this.quantity.available;
});

// Method to check if product is fresh
productSchema.methods.isFresh = function() {
  if (!this.harvestDate) return true;
  const daysSinceHarvest = (Date.now() - this.harvestDate) / (1000 * 60 * 60 * 24);
  return daysSinceHarvest <= 7; // Fresh if harvested within 7 days
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
