import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import FarmerDashboard from "./components/FarmerDashboard";
import ProductList from "./components/Product/ProductList";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ViewProduct from "./components/Product/ViewProduct";
import Cart from "./components/Product/Cart";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [isFarmer, setIsFarmer] = useState(localStorage.getItem('isFarmer') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const [token, setToken] = useState(localStorage.getItem('token'));


  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setIsFarmer(role === "farmer");
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('isFarmer', role === "farmer");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setIsFarmer(false);
    setUsername('');
    setCart([]);
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        isFarmer={isFarmer}
        username={username}
        onLogout={handleLogout}
        cartLength={cart.length}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={isLoggedIn && token ? <Navigate to={isFarmer ? "/farmer-dashboard" : "/product-list"} /> : <Login onLogin={handleLogin} />} />

        {/* Protected Routes for Farmers */}
        <Route path="/farmer-dashboard" element={isLoggedIn && isFarmer ? <FarmerDashboard /> : <Navigate to="/login" />} />

        {/* Protected Routes for Authenticated Users */}
        <Route path="/product-list" element={isLoggedIn && !isFarmer ? <ProductList /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={isLoggedIn ? <ViewProduct /> : <Navigate to="/login" />} />
        <Route path="/cart" element={isLoggedIn ? <Cart cart={cart} /> : <Navigate to="/login" />} />

        {/* Redirect all unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
