import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../translations';

const OrderTracking = ({ language, userType }) => {
  const navigate = useNavigate();
  const t = (key) => getTranslation(language, key);

  const [orders] = useState([
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
  ]);

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
        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          <button className="px-4 py-2 bg-farm-green text-white rounded-full whitespace-nowrap">
            All Orders
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap border-2">
            {t('dueOrders')}
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap border-2">
            In Transit
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-full whitespace-nowrap border-2">
            {t('delivered')}
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
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

              {/* Map Placeholder */}
              <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg h-48 flex items-center justify-center mb-4">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-farm-green mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-700 font-medium">Track on Map</p>
                </div>
              </div>

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
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
