// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import FarmerDashboard from './components/FarmerDashboard';
import ProductList from './components/Product/ProductList';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setIsFarmer(role === 'farmer');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsFarmer(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} isFarmer={isFarmer} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/farmer-dashboard" element={isFarmer ? <FarmerDashboard /> : <Home />} />
        <Route path="/product-list" element={isLoggedIn ? <ProductList /> : <Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
