import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LanguageSelection from './pages/LanguageSelection';
import UserTypeSelection from './pages/UserTypeSelection';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProfile from './pages/FarmerProfile';
import CategorySelection from './pages/CategorySelection';
import ItemsList from './pages/ItemsList';
import ProductDetails from './pages/ProductDetails';
import OrderTracking from './pages/OrderTracking';
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerProfile from './pages/BuyerProfile';
import FarmersList from './pages/FarmersList';
import BuyerProductView from './pages/BuyerProductView';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistory from './pages/OrderHistory';

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
          element={
            !user ? <LoginPage onLogin={handleLogin} /> : 
            !language ? <Navigate to="/language" /> :
            !userType ? <Navigate to="/user-type" /> :
            userType === 'farmer' ? <Navigate to="/farmer/dashboard" /> :
            <Navigate to="/buyer/dashboard" />
          } 
        />
        <Route 
          path="/language" 
          element={
            user ? <LanguageSelection onSelectLanguage={handleLanguageSelect} currentLanguage={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/user-type" 
          element={
            user && language ? <UserTypeSelection onSelectType={handleUserTypeSelect} language={language} /> : 
            <Navigate to="/" />
          } 
        />
        
        {/* Farmer Routes */}
        <Route 
          path="/farmer/dashboard" 
          element={
            user && userType === 'farmer' ? <FarmerDashboard language={language} onLogout={handleLogout} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/profile" 
          element={
            user && userType === 'farmer' ? <FarmerProfile language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/categories" 
          element={
            user && userType === 'farmer' ? <CategorySelection language={language} userType="farmer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/items/:category" 
          element={
            user && userType === 'farmer' ? <ItemsList language={language} userType="farmer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/product/:category/:item" 
          element={
            user && userType === 'farmer' ? <ProductDetails language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/farmer/tracking" 
          element={
            user && userType === 'farmer' ? <OrderTracking language={language} userType="farmer" /> : 
            <Navigate to="/" />
          } 
        />

        {/* Buyer Routes */}
        <Route 
          path="/buyer/dashboard" 
          element={
            user && userType === 'buyer' ? <BuyerDashboard language={language} onLogout={handleLogout} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/profile" 
          element={
            user && userType === 'buyer' ? <BuyerProfile language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/farmers" 
          element={
            user && userType === 'buyer' ? <FarmersList language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/categories" 
          element={
            user && userType === 'buyer' ? <CategorySelection language={language} userType="buyer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/items/:category" 
          element={
            user && userType === 'buyer' ? <ItemsList language={language} userType="buyer" /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/product/:farmerId/:productId" 
          element={
            user && userType === 'buyer' ? <BuyerProductView language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/checkout" 
          element={
            user && userType === 'buyer' ? <CheckoutPage language={language} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/buyer/orders" 
          element={
            user && userType === 'buyer' ? <OrderHistory language={language} /> : 
            <Navigate to="/" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
