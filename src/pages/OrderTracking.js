import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTranslation } from '../translations';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

L.Marker.prototype.options.icon = DefaultIcon;

const OrderTracking = ({ language, userType }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = (key) => getTranslation(language, key);
  const [showMap, setShowMap] = useState({});
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      const storageKey = userType === 'farmer' ? 'farmerOrders' : 'buyerOrders';
      const storedOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // If no orders in localStorage, use dummy data
      if (storedOrders.length === 0) {
        setOrders([
    { 
      id: 1, 
      item: 'Tomatoes', 
      quantity: '20 kg', 
      customer: 'Rajesh Kumar',
      address: '123, MG Road, Bangalore',
      status: 'pending',
      amount: '₹600',
      location: { lat: 12.9716, lng: 77.5946 }
    },
    { 
      id: 2, 
      item: 'Onions', 
      quantity: '30 kg', 
      customer: 'Priya Sharma',
      address: '456, Park Street, Delhi',
      status: 'in-transit',
      amount: '₹1200',
      location: { lat: 28.7041, lng: 77.1025 }
    },
    { 
      id: 3, 
      item: 'Potatoes', 
      quantity: '50 kg', 
      customer: 'Anil Reddy',
      address: '789, Beach Road, Chennai',
      status: 'delivered',
      amount: '₹1250',
      location: { lat: 13.0827, lng: 80.2707 }
    },
    { 
      id: 4, 
      item: 'Carrots', 
      quantity: '15 kg', 
      customer: 'Sunita Patel',
      address: '321, Station Road, Mumbai',
      status: 'pending',
      amount: '₹450',
      location: { lat: 19.0760, lng: 72.8777 }
    },
    { 
      id: 5, 
      item: 'Cabbage', 
      quantity: '25 kg', 
      customer: 'Ramesh Verma',
      address: '567, Lake View, Kolkata',
      status: 'in-transit',
      amount: '₹800',
      location: { lat: 22.5726, lng: 88.3639 }
    },
  ]);
      } else {
        setOrders(storedOrders);
      }
    };

    loadOrders();
  }, [userType]);

  // Update filter when URL parameter changes
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setActiveFilter(filterParam);
    }
  }, [searchParams]);

  // Filter orders based on active filter and search query
  const filteredOrders = orders.filter(order => {
    // Apply filter
    let matchesFilter = true;
    if (activeFilter === 'all') matchesFilter = true;
    else if (activeFilter === 'due') matchesFilter = order.status === 'pending' || order.status === 'in-transit';
    else if (activeFilter === 'in-transit') matchesFilter = order.status === 'in-transit';
    else if (activeFilter === 'delivered') matchesFilter = order.status === 'delivered';

    // Apply search query
    if (!searchQuery.trim()) return matchesFilter;

    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id?.toString().includes(query) ||
      order.item?.toLowerCase().includes(query) ||
      order.customer?.toLowerCase().includes(query) ||
      order.customerName?.toLowerCase().includes(query) ||
      order.address?.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-transit': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in-transit': return 'In Transit';
      case 'delivered': return t('delivered');
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farm-green text-white shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(`/${userType}/dashboard`)} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">{t('track')}</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID, Item, or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-farm-green"
            />
            <svg 
              className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === 'all' 
                ? 'bg-farm-green text-white' 
                : 'bg-white text-gray-700 border-2'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button 
            onClick={() => setActiveFilter('due')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === 'due' 
                ? 'bg-farm-green text-white' 
                : 'bg-white text-gray-700 border-2'
            }`}
          >
            {t('dueOrders')} ({orders.filter(o => o.status === 'pending' || o.status === 'in-transit').length})
          </button>
          <button 
            onClick={() => setActiveFilter('in-transit')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === 'in-transit' 
                ? 'bg-farm-green text-white' 
                : 'bg-white text-gray-700 border-2'
            }`}
          >
            In Transit ({orders.filter(o => o.status === 'in-transit').length})
          </button>
          <button 
            onClick={() => setActiveFilter('delivered')}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === 'delivered' 
                ? 'bg-farm-green text-white' 
                : 'bg-white text-gray-700 border-2'
            }`}
          >
            {t('delivered')} ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              {searchQuery ? (
                <>
                  <p className="text-gray-600 text-lg mb-2">No orders match "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-farm-green hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <p className="text-gray-600 text-lg">No orders found</p>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`${getStatusColor(order.status)} w-3 h-3 rounded-full`}></div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{order.item}</h3>
                    <p className="text-sm text-gray-600">Order #{order.id}234</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-farm-green">{order.amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">{t('quantity')}</p>
                  <p className="font-semibold">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{getStatusText(order.status)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{order.customer}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">{t('deliveryAddress')}</p>
                  <p className="font-semibold">{order.address}</p>
                </div>
              </div>

              {/* Map */}
              {showMap[order.id] ? (
                <div className="rounded-lg overflow-hidden mb-4" style={{ height: '300px' }}>
                  <MapContainer
                    center={[order.location.lat, order.location.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[order.location.lat, order.location.lng]}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold">{order.customer}</p>
                          <p className="text-sm">{order.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <button
                  onClick={() => setShowMap({ ...showMap, [order.id]: true })}
                  className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-48 flex items-center justify-center mb-4 w-full hover:from-green-200 hover:to-blue-200 transition-all"
                >
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-farm-green mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-700 font-medium">Track on Map</p>
                  </div>
                </button>
              )}

              {order.status !== 'delivered' && (
                <button className="w-full bg-farm-green hover:bg-farm-dark-green text-white font-semibold py-3 rounded-lg transition-colors">
                  Mark as Delivered
                </button>
              )}
              
              {order.status === 'delivered' && (
                <div className="flex items-center justify-center text-green-600 font-semibold">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('delivered')}
                </div>
              )}
            </div>
          ))
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
