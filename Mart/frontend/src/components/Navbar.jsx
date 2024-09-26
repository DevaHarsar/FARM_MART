// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, isFarmer, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic (like clearing tokens)
    onLogout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-green-600 text-white">
      <div className="text-lg font-bold">Farm Mart</div>
      <div>
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="mx-2">Login</Link>
            <Link to="/signup" className="mx-2">Signup</Link>
          </>
        ) : (
          <>
            {isFarmer ? (
              <Link to="/farmer-dashboard" className="mx-2">Farmer Dashboard</Link>
            ) : (
              <Link to="/product-list" className="mx-2">Product List</Link>
            )}
            <button onClick={handleLogout} className="mx-2 bg-red-500 p-1 rounded">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
