import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LanguageSelection from './pages/LanguageSelection';
import UserTypeSelection from './pages/UserTypeSelection';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProfile from './pages/FarmerProfile';
import FarmerProductManagement from './pages/FarmerProductManagement';
import FarmerOrders from './pages/FarmerOrders';
import CategorySelection from './pages/CategorySelection';
import ItemsList from './pages/ItemsList';
import ProductDetails from './pages/ProductDetails';
import OrderTracking from './pages/OrderTracking';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerProfile from './pages/BuyerProfile';
import FarmersList from './pages/FarmersList';
import BuyerProductView from './pages/BuyerProductView';
import BuyerProductsList from './pages/BuyerProductsList';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistory from './pages/OrderHistory';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import FarmerDiscovery from './pages/FarmerDiscovery';
import VoiceAssistant from './components/VoiceAssistant';

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('english');
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('farmBridgeUser');
    const savedLanguage = localStorage.getItem('farmBridgeLanguage');
    const savedUserType = localStorage.getItem('farmBridgeUserType');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedUserType) setUserType(savedUserType);
  }, []);

  const handleLogin = (phoneNumber) => {
    const userData = { phoneNumber, loginTime: new Date().toISOString() };
    setUser(userData);
    localStorage.setItem('farmBridgeUser', JSON.stringify(userData));
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem('farmBridgeLanguage', lang);
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    localStorage.setItem('farmBridgeUserType', type);
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('farmBridgeUser');
    localStorage.removeItem('farmBridgeUserType');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to="/language" />} 
        />
        <Route 
          path="/language" 
          element={<LanguageSelection onSelectLanguage={handleLanguageSelect} currentLanguage={language} />} 
        />
        <Route 
          path="/login" 
          element={
            !user ? <LoginPage onLogin={handleLogin} /> : 
            !userType ? <Navigate to="/user-type" /> :
            userType === 'farmer' ? <Navigate to="/farmer/dashboard" /> :
            <Navigate to="/buyer/dashboard" />
          } 
        />
        <Route 
          path="/user-type" 
          element={
            language ? <UserTypeSelection onSelectType={handleUserTypeSelect} language={language} /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* Farmer Routes */}
        <Route 
          path="/farmer/dashboard" 
          element={
            userType === 'farmer' ? <FarmerDashboard language={language} onLogout={handleLogout} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/profile" 
          element={
            userType === 'farmer' ? <FarmerProfile language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/products" 
          element={
            userType === 'farmer' ? <FarmerProductManagement language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/orders" 
          element={
            userType === 'farmer' ? <FarmerOrders language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/categories" 
          element={
            userType === 'farmer' ? <CategorySelection language={language} userType="farmer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/items/:category" 
          element={
            userType === 'farmer' ? <ItemsList language={language} userType="farmer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/product/:category/:item" 
          element={
            userType === 'farmer' ? <ProductDetails language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/tracking" 
          element={
            userType === 'farmer' ? <OrderTracking language={language} userType="farmer" /> : 
            <Navigate to="/" />
          } 
        />

        {/* Buyer Routes */}
        <Route 
          path="/buyer/dashboard" 
          element={
            userType === 'buyer' ? <BuyerDashboard language={language} onLogout={handleLogout} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/profile" 
          element={
            userType === 'buyer' ? <BuyerProfile language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/farmers" 
          element={
            userType === 'buyer' ? <FarmersList language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/products" 
          element={
            userType === 'buyer' ? <BuyerProductsList language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route           path="/buyer/discover" 
          element={
            userType === 'buyer' ? <FarmerDiscovery language={language} userType={userType} /> : 
            <Navigate to="/" />
          } 
        />
        <Route           path="/buyer/discover" 
          element={
            userType === 'buyer' ? <FarmerDiscovery language={language} userType={userType} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/categories" 
          element={
            userType === 'buyer' ? <CategorySelection language={language} userType="buyer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/items/:category" 
          element={
            userType === 'buyer' ? <ItemsList language={language} userType="buyer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/product/:farmerId/:productId" 
          element={
            userType === 'buyer' ? <BuyerProductView language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/checkout" 
          element={
            userType === 'buyer' ? <CheckoutPage language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/cart" 
          element={
            userType === 'buyer' ? <CheckoutPage language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/orders" 
          element={
            userType === 'buyer' ? <OrderHistory language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/payment" 
          element={<PaymentPage language={language} />} 
        />
        <Route 
          path="/payment-success" 
          element={<PaymentSuccess language={language} userType={userType} />} 
        />
      </Routes>
      
      {/* Voice Assistant - Available after language selection */}
      {language && (
        <VoiceAssistant language={language} userType={userType || 'buyer'} />
      )}
    </Router>
  );
}

export default App;
