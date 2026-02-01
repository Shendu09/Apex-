import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Custom icon for buyer location
let BuyerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const FarmerDiscovery = ({ language, userType }) => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(10); // km
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // distance, rating, products

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Bangalore if location denied
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
          setLoading(false);
        }
      );
    } else {
      // Default location
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
      setLoading(false);
    }
  }, []);

  // Load farmers data
  useEffect(() => {
    const loadFarmers = () => {
      // Load from localStorage or use sample data
      const storedFarmers = JSON.parse(localStorage.getItem('registeredFarmers') || '[]');
      
      // Generate sample farmers near user's location
      const generateNearbyFarmers = (userLat, userLng) => {
        const offsetDistance = 0.05; // approximately 5-7 km
        return [
          {
            id: 1,
            name: 'Rajesh Kumar Farm',
            owner: 'Rajesh Kumar',
            location: { lat: userLat + offsetDistance, lng: userLng + offsetDistance * 0.5 },
            address: 'Local Farm Area 1',
            phone: '+91 98765 43210',
            rating: 4.8,
            products: ['Tomatoes', 'Potatoes', 'Onions', 'Carrots'],
            productCount: 12,
            organic: true,
            image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400'
          },
          {
            id: 2,
            name: 'Green Valley Organic',
            owner: 'Anita Sharma',
            location: { lat: userLat - offsetDistance * 0.8, lng: userLng + offsetDistance * 0.7 },
            address: 'Local Farm Area 2',
            phone: '+91 98765 43211',
            rating: 4.9,
            products: ['Spinach', 'Cabbage', 'Cauliflower', 'Lettuce'],
            productCount: 8,
            organic: true,
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'
          },
          {
            id: 3,
            name: 'Fresh Harvest Farm',
            owner: 'Ganesh Patel',
            location: { lat: userLat + offsetDistance * 1.2, lng: userLng - offsetDistance * 0.6 },
            address: 'Local Farm Area 3',
            phone: '+91 98765 43212',
            rating: 4.7,
            products: ['Mangoes', 'Bananas', 'Papayas', 'Guavas'],
            productCount: 15,
            organic: false,
            image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'
          },
          {
            id: 4,
            name: 'Sunshine Farms',
            owner: 'Lakshmi Devi',
            location: { lat: userLat - offsetDistance * 1.5, lng: userLng - offsetDistance * 0.9 },
            address: 'Local Farm Area 4',
            phone: '+91 98765 43213',
            rating: 4.6,
            products: ['Rice', 'Wheat', 'Millet', 'Pulses'],
            productCount: 10,
            organic: true,
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
          },
          {
            id: 5,
            name: "Nature's Bounty",
            owner: 'Ramesh Verma',
            location: { lat: userLat + offsetDistance * 0.3, lng: userLng - offsetDistance * 1.3 },
            address: 'Local Farm Area 5',
            phone: '+91 98765 43214',
            rating: 4.5,
            products: ['Milk', 'Eggs', 'Honey', 'Ghee'],
            productCount: 6,
            organic: true,
            image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f6?w=400'
          }
        ];
      };

      if (storedFarmers.length > 0) {
        setFarmers(storedFarmers);
      } else if (userLocation) {
        // Generate farmers near user's actual location
        const nearbyFarmers = generateNearbyFarmers(userLocation.lat, userLocation.lng);
        setFarmers(nearbyFarmers);
      }
    };

    loadFarmers();
  }, [userLocation]);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter and sort farmers
  useEffect(() => {
    if (!userLocation) return;

    let filtered = farmers.map(farmer => ({
      ...farmer,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        farmer.location.lat,
        farmer.location.lng
      )
    })).filter(farmer => farmer.distance <= selectedRadius);

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(farmer =>
        farmer.name.toLowerCase().includes(query) ||
        farmer.owner.toLowerCase().includes(query) ||
        farmer.address.toLowerCase().includes(query) ||
        farmer.products.some(p => p.toLowerCase().includes(query))
      );
    }

    // Sort farmers
    filtered.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'products') return b.productCount - a.productCount;
      return 0;
    });

    setFilteredFarmers(filtered);
  }, [userLocation, farmers, selectedRadius, searchQuery, sortBy]);

  const radiusOptions = [5, 10, 20, 50, 100];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/buyer/dashboard')} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Discover Farmers</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search farmers, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-farm-green"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">Radius</label>
              <select
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-farm-green"
              >
                {radiusOptions.map(radius => (
                  <option key={radius} value={radius}>{radius} km</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-farm-green"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="products">Products</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            <span className="font-semibold">{filteredFarmers.length}</span> farmers found within {selectedRadius} km
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4" style={{ height: '400px' }}>
          {userLocation && (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Buyer Location */}
              <Marker position={[userLocation.lat, userLocation.lng]} icon={BuyerIcon}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold text-blue-600">Your Location</p>
                  </div>
                </Popup>
              </Marker>

              {/* Radius Circle */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={selectedRadius * 1000}
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
              />

              {/* Farmer Markers */}
              {filteredFarmers.map(farmer => (
                <Marker key={farmer.id} position={[farmer.location.lat, farmer.location.lng]}>
                  <Popup>
                    <div className="text-center min-w-[200px]">
                      <p className="font-bold text-farm-green">{farmer.name}</p>
                      <p className="text-sm text-gray-600">{farmer.owner}</p>
                      <p className="text-xs text-gray-500 mb-2">{farmer.distance.toFixed(1)} km away</p>
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm ml-1">{farmer.rating}</span>
                      </div>
                      <button
                        onClick={() => navigate(`/buyer/products?farmerId=${farmer.id}`)}
                        className="bg-farm-green text-white px-3 py-1 rounded text-sm hover:bg-farm-dark-green"
                      >
                        View Products
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Farmers List */}
        <div className="space-y-4">
          {filteredFarmers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🚜</div>
              <p className="text-gray-600 text-lg mb-2">No farmers found nearby</p>
              <p className="text-gray-500 text-sm">Try increasing the search radius</p>
            </div>
          ) : (
            filteredFarmers.map(farmer => (
              <div key={farmer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmer.owner}</p>
                        <p className="text-xs text-gray-500">{farmer.address}</p>
                      </div>
                      {farmer.organic && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          🌿 Organic
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="ml-1 font-semibold">{farmer.rating}</span>
                      </div>
                      <div className="text-gray-600">
                        📍 {farmer.distance.toFixed(1)} km
                      </div>
                      <div className="text-gray-600">
                        🌾 {farmer.productCount} products
                      </div>
                      <a href={`tel:${farmer.phone}`} className="text-farm-green hover:underline">
                        📞 Call
                      </a>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Available Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {farmer.products.slice(0, 4).map((product, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {product}
                          </span>
                        ))}
                        {farmer.products.length > 4 && (
                          <span className="text-xs text-gray-500">+{farmer.products.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/buyer/products?farmerId=${farmer.id}`)}
                      className="w-full bg-farm-green text-white py-2 rounded-lg hover:bg-farm-dark-green transition-colors font-semibold"
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FarmerDiscovery;
