const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productDetails: {
    name: String,
    category: String,
    image: String,
    price: Number,
    unit: String
  },
  quantity: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  deliveryAddress: {
    fullAddress: String,
    landmark: String,
    pincode: String,
    city: String,
    state: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  pickupAddress: {
    fullAddress: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'in-transit', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    note: String
  }],
  tracking: {
    currentLocation: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    estimatedDelivery: Date,
    deliveryPartner: {
      name: String,
      phone: String,
      vehicle: String
    },
    route: [{
      location: {
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: [Number]
      },
      timestamp: Date
    }]
  },
  payment: {
    method: {
      type: String,
      enum: ['upi', 'cod', 'bank_transfer', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    farmerAccount: {
      bankAccount: String,
      upiId: String
    }
  },
  delivery: {
    scheduledDate: Date,
    deliveredAt: Date,
    type: {
      type: String,
      enum: ['instant', 'scheduled', 'pickup'],
      default: 'scheduled'
    }
  },
  returnRequest: {
    requested: {
      type: Boolean,
      default: false
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed']
    },
    requestedAt: Date,
    images: [String]
  },
  notes: {
    buyer: String,
    farmer: String,
    admin: String
  },
  rating: {
    product: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    farmer: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ farmer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'deliveryAddress.location': '2dsphere' });
orderSchema.index({ 'tracking.currentLocation': '2dsphere' });

// Pre-save hook to generate orderId
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    this.orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Method to calculate distance between pickup and delivery
orderSchema.methods.calculateDistance = function() {
  if (!this.pickupAddress.location || !this.deliveryAddress.location) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const lat1 = this.pickupAddress.location.coordinates[1];
  const lon1 = this.pickupAddress.location.coordinates[0];
  const lat2 = this.deliveryAddress.location.coordinates[1];
  const lon2 = this.deliveryAddress.location.coordinates[0];

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
