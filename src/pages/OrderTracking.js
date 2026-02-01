import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTranslation } from '../translations';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
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

// Delivery agent icon
let DeliveryIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
      <circle cx="24" cy="24" r="22" fill="#10b981" stroke="white" stroke-width="3"/>
      <path d="M24 14 L16 26 L20 26 L18 34 L30 22 L26 22 L28 14 Z" fill="white"/>
    </svg>
  `),
  iconSize: [40, 40],
  iconAnchor: [20, 20]
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
  const [deliveryAgents, setDeliveryAgents] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const intervalRefs = useRef({});

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

  // Simulate real-time delivery agent movement
  useEffect(() => {
    orders.forEach(order => {
      if (order.status === 'in-transit' && !deliveryAgents[order.id]) {
        // Initialize delivery agent position between farm and customer
        const farmLat = order.location.lat - 0.05;
        const farmLng = order.location.lng - 0.05;
        
        setDeliveryAgents(prev => ({
          ...prev,
          [order.id]: {
            position: { lat: farmLat, lng: farmLng },
            name: getDeliveryAgentName(order.id),
            phone: '+91 98765' + (43210 + order.id),
            vehicle: 'Bike',
            estimatedTime: Math.floor(Math.random() * 30) + 15, // 15-45 mins
            farmLocation: { lat: farmLat, lng: farmLng }
          }
        }));

        // Animate delivery agent movement
        const steps = 100;
        let currentStep = 0;
        
        intervalRefs.current[order.id] = setInterval(() => {
          currentStep++;
          if (currentStep >= steps) {
            clearInterval(intervalRefs.current[order.id]);
            return;
          }

          const progress = currentStep / steps;
          const newLat = farmLat + (order.location.lat - farmLat) * progress;
          const newLng = farmLng + (order.location.lng - farmLng) * progress;

          setDeliveryAgents(prev => ({
            ...prev,
            [order.id]: {
              ...prev[order.id],
              position: { lat: newLat, lng: newLng },
              estimatedTime: Math.max(1, prev[order.id].estimatedTime - 0.3)
            }
          }));
        }, 2000); // Update every 2 seconds
      }
    });

    return () => {
      Object.values(intervalRefs.current).forEach(interval => clearInterval(interval));
    };
  }, [orders]);

  const getDeliveryAgentName = (orderId) => {
    const names = ['Raj Kumar', 'Amit Singh', 'Suresh Patel', 'Vijay Reddy', 'Manoj Sharma'];
    return names[orderId % names.length];
  };

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
      case 'accepted': return 'bg-blue-500';
      case 'in-transit': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const getOrderTimeline = (status) => {
    const steps = [
      { id: 'placed', label: 'Order Placed', icon: '📝' },
      { id: 'accepted', label: 'Accepted', icon: '✅' },
      { id: 'packed', label: 'Packed', icon: '📦' },
      { id: 'in-transit', label: 'Out for Delivery', icon: '🚚' },
      { id: 'delivered', label: 'Delivered', icon: '✨' }
    ];

    const statusOrder = ['placed', 'accepted', 'packed', 'in-transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status === 'pending' ? 'placed' : status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
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
            filteredOrders.map((order) => {
              const agent = deliveryAgents[order.id];
              const timeline = getOrderTimeline(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`${getStatusColor(order.status)} w-4 h-4 rounded-full animate-pulse`}></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{order.item}</h3>
                      <p className="text-sm text-gray-600">Order #{order.id}234</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-farm-green">{order.amount}</span>
                    <p className="text-xs text-gray-600 mt-1">{order.quantity}</p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="flex items-center justify-between mt-6 mb-4">
                  {timeline.map((step, index) => (
                    <div key={step.id} className="flex-1 relative">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          step.completed ? 'bg-farm-green text-white' : 
                          step.active ? 'bg-blue-500 text-white animate-bounce' : 
                          'bg-gray-200 text-gray-400'
                        }`}>
                          {step.icon}
                        </div>
                        <p className={`text-xs mt-2 text-center ${
                          step.completed || step.active ? 'text-gray-800 font-semibold' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                      {index < timeline.length - 1 && (
                        <div className={`absolute top-5 left-1/2 w-full h-1 ${
                          step.completed ? 'bg-farm-green' : 'bg-gray-200'
                        }`} style={{ zIndex: -1 }}></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Estimated Delivery Time */}
                {order.status === 'in-transit' && agent && (
                  <div className="bg-white rounded-lg p-4 mt-4 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Delivery</p>
                        <p className="text-2xl font-bold text-farm-green">{Math.round(agent.estimatedTime)} mins</p>
                      </div>
                      <div className="text-5xl animate-pulse">⚡</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Agent Details (for in-transit orders) */}
              {order.status === 'in-transit' && agent && (
                <div className="px-6 py-4 bg-blue-50 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-farm-green rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{agent.name}</p>
                        <p className="text-sm text-gray-600">🏍️ {agent.vehicle}</p>
                      </div>
                    </div>
                    <a 
                      href={`tel:${agent.phone}`}
                      className="bg-farm-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-800">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'in-transit' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getStatusText(order.status)}
                      </span>
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">{t('deliveryAddress')}</p>
                    <p className="font-semibold text-gray-800">{order.address}</p>
                  </div>
                </div>

              {/* Live Map Toggle */}
              <button
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                className="w-full bg-gradient-to-r from-farm-green to-green-600 text-white font-semibold py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{isExpanded ? 'Hide' : 'Track'} Live Location</span>
              </button>

              {/* Real-time Map */}
              {isExpanded && (
                <div className="mt-4 rounded-lg overflow-hidden border-4 border-farm-green" style={{ height: '400px' }}>
                  <MapContainer
                    center={order.status === 'in-transit' && agent ? 
                      [(agent.position.lat + order.location.lat) / 2, (agent.position.lng + order.location.lng) / 2] :
                      [order.location.lat, order.location.lng]
                    }
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Destination Marker */}
                    <Marker position={[order.location.lat, order.location.lng]}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold">📍 Delivery Location</p>
                          <p className="text-sm">{order.customer}</p>
                          <p className="text-xs text-gray-600">{order.address}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Delivery Agent Marker (for in-transit orders) */}
                    {order.status === 'in-transit' && agent && (
                      <>
                        <Marker 
                          position={[agent.position.lat, agent.position.lng]}
                          icon={DeliveryIcon}
                        >
                          <Popup>
                            <div className="text-center">
                              <p className="font-bold">🚚 {agent.name}</p>
                              <p className="text-sm">{agent.vehicle}</p>
                              <p className="text-xs text-green-600 font-semibold">
                                Arriving in ~{Math.round(agent.estimatedTime)} mins
                              </p>
                            </div>
                          </Popup>
                        </Marker>

                        {/* Route Line */}
                        <Polyline 
                          positions={[
                            [agent.position.lat, agent.position.lng],
                            [order.location.lat, order.location.lng]
                          ]}
                          color="#10b981"
                          weight={4}
                          opacity={0.7}
                          dashArray="10, 10"
                        />

                        {/* Radius Circle around delivery location */}
                        <Circle
                          center={[order.location.lat, order.location.lng]}
                          radius={500}
                          fillColor="#10b981"
                          fillOpacity={0.1}
                          color="#10b981"
                          weight={2}
                          opacity={0.5}
                        />
                      </>
                    )}
                  </MapContainer>
                </div>
              )}

              {order.status !== 'delivered' && (
                <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors">
                  Mark as Delivered
                </button>
              )}
              
              {order.status === 'delivered' && (
                <div className="flex items-center justify-center text-green-600 font-semibold mt-4 p-4 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ✨ {t('delivered')} Successfully!
                </div>
              )}
            </div>
            </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
