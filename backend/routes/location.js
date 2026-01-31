const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// OpenStreetMap Nominatim API base URL
const NOMINATIM_URL = process.env.NOMINATIM_API_URL || 'https://nominatim.openstreetmap.org';

// @route   GET /api/location/geocode
// @desc    Convert address to coordinates (Geocoding)
// @access  Public
router.get('/geocode', async (req, res) => {
  try {
    const { address, city, state, country = 'India' } = req.query;

    if (!address && !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide address or city'
      });
    }

    const searchQuery = [address, city, state, country]
      .filter(Boolean)
      .join(', ');

    const response = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: searchQuery,
        format: 'json',
        limit: 5,
        countrycodes: 'in', // India
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'FarmBridge/1.0'
      }
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const locations = response.data.map(loc => ({
      displayName: loc.display_name,
      latitude: parseFloat(loc.lat),
      longitude: parseFloat(loc.lon),
      address: {
        city: loc.address.city || loc.address.town || loc.address.village,
        state: loc.address.state,
        country: loc.address.country,
        postcode: loc.address.postcode
      },
      boundingBox: loc.boundingbox
    }));

    res.status(200).json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    console.error('Geocoding Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error geocoding address',
      error: error.message
    });
  }
});

// @route   GET /api/location/reverse
// @desc    Convert coordinates to address (Reverse Geocoding)
// @access  Public
router.get('/reverse', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
      params: {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'FarmBridge/1.0'
      }
    });

    if (!response.data) {
      return res.status(404).json({
        success: false,
        message: 'Address not found for these coordinates'
      });
    }

    const location = {
      displayName: response.data.display_name,
      latitude: parseFloat(response.data.lat),
      longitude: parseFloat(response.data.lon),
      address: {
        road: response.data.address.road,
        neighbourhood: response.data.address.neighbourhood,
        suburb: response.data.address.suburb,
        city: response.data.address.city || response.data.address.town || response.data.address.village,
        state: response.data.address.state,
        country: response.data.address.country,
        postcode: response.data.address.postcode
      }
    };

    res.status(200).json({
      success: true,
      location
    });
  } catch (error) {
    console.error('Reverse Geocoding Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error reverse geocoding coordinates',
      error: error.message
    });
  }
});

// @route   POST /api/location/update
// @desc    Update user location
// @access  Private
router.post('/update', protect, async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    let locationData = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    // If address not provided, get it via reverse geocoding
    if (!address) {
      try {
        const response = await axios.get(`${NOMINATIM_URL}/reverse`, {
          params: {
            lat: latitude,
            lon: longitude,
            format: 'json',
            addressdetails: 1
          },
          headers: {
            'User-Agent': 'FarmBridge/1.0'
          }
        });

        if (response.data) {
          locationData.address = response.data.display_name;
          locationData.city = response.data.address.city || response.data.address.town;
          locationData.state = response.data.address.state;
          locationData.country = response.data.address.country;
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error.message);
      }
    } else {
      locationData = { ...locationData, ...address };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { location: locationData },
      { new: true }
    ).select('location profile');

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      location: user.location
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
});

// @route   GET /api/location/route
// @desc    Get route between two points
// @access  Public
router.get('/route', async (req, res) => {
  try {
    const { startLat, startLon, endLat, endLon } = req.query;

    if (!startLat || !startLon || !endLat || !endLon) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start and end coordinates'
      });
    }

    // Use OSRM (Open Source Routing Machine) for routing
    const osrmUrl = 'https://router.project-osrm.org/route/v1/driving';
    const coordinates = `${startLon},${startLat};${endLon},${endLat}`;

    const response = await axios.get(`${osrmUrl}/${coordinates}`, {
      params: {
        overview: 'full',
        geometries: 'geojson',
        steps: true
      }
    });

    if (!response.data || response.data.code !== 'Ok') {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const route = response.data.routes[0];

    res.status(200).json({
      success: true,
      route: {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        geometry: route.geometry,
        steps: route.legs[0].steps.map(step => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.maneuver.instruction || 'Continue',
          location: step.maneuver.location
        }))
      }
    });
  } catch (error) {
    console.error('Routing Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error calculating route',
      error: error.message
    });
  }
});

// @route   GET /api/location/distance
// @desc    Calculate distance between two points
// @access  Public
router.get('/distance', async (req, res) => {
  try {
    const { lat1, lon1, lat2, lon2 } = req.query;

    if (!lat1 || !lon1 || !lat2 || !lon2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both coordinate pairs'
      });
    }

    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (parseFloat(lat2) - parseFloat(lat1)) * Math.PI / 180;
    const dLon = (parseFloat(lon2) - parseFloat(lon1)) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(parseFloat(lat1) * Math.PI / 180) * 
              Math.cos(parseFloat(lat2) * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    res.status(200).json({
      success: true,
      distance: {
        kilometers: distance.toFixed(2),
        meters: (distance * 1000).toFixed(0),
        miles: (distance * 0.621371).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating distance',
      error: error.message
    });
  }
});

// @route   GET /api/location/search
// @desc    Search for places near a location
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, latitude, longitude, radius = 10 } = req.query;

    if (!query || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query and coordinates'
      });
    }

    const response = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 10,
        bounded: 1,
        viewbox: `${parseFloat(longitude) - 0.1},${parseFloat(latitude) - 0.1},${parseFloat(longitude) + 0.1},${parseFloat(latitude) + 0.1}`,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'FarmBridge/1.0'
      }
    });

    const places = response.data.map(place => ({
      displayName: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      type: place.type,
      address: place.address
    }));

    res.status(200).json({
      success: true,
      count: places.length,
      places
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching places',
      error: error.message
    });
  }
});

module.exports = router;
