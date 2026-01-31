const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['farmer', 'buyer'],
    required: true
  },
  profile: {
    name: {
      type: String,
      trim: true
    },
    age: {
      type: Number,
      min: 18
    },
    photo: {
      type: String // URL to uploaded photo
    },
    place: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    pincode: {
      type: String,
      trim: true
    },
    preferences: {
      type: String,
      trim: true
    }
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
    },
    address: String,
    city: String,
    state: String,
    country: String
  },
  payment: {
    bankAccount: {
      type: String,
      trim: true
    },
    upiId: {
      type: String,
      trim: true
    },
    ifscCode: {
      type: String,
      trim: true
    }
  },
  language: {
    type: String,
    enum: ['english', 'hindi', 'telugu', 'tamil', 'kannada', 'malayalam'],
    default: 'english'
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
  verified: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  fcmToken: {
    type: String // For push notifications
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ userType: 1 });

// Virtual for full name
userSchema.virtual('fullProfile').get(function() {
  return {
    ...this.profile,
    phoneNumber: this.phoneNumber,
    userType: this.userType,
    rating: this.rating
  };
});

// Method to calculate distance between users
userSchema.methods.getDistanceFrom = function(targetLocation) {
  const R = 6371; // Earth's radius in km
  const lat1 = this.location.coordinates[1];
  const lon1 = this.location.coordinates[0];
  const lat2 = targetLocation.coordinates[1];
  const lon2 = targetLocation.coordinates[0];

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  return distance;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
