import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";

const Navbar = ({ isLoggedIn, isFarmer, onLogout, cartLength }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-green-600 text-white">
      <Link to="/" className="text-lg font-bold">
        Farm Mart
      </Link>
      <div className="flex justify-end items-center">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="mx-2">
              Login
            </Link>
            <Link to="/signup" className="mx-2">
              Signup
            </Link>
          </>
        ) : (
          <>
            {isFarmer ? (
              <Link to="/farmer-dashboard" className="mx-2">
                Farmer Dashboard
              </Link>
            ) : (
              <Link to="/product-list" className="mx-5 border-2 bg-white text-green-700">
                Product List
              </Link>
            )}
            {!isFarmer && (
              <Link to="/cart" className="mx-2">
                 <FiShoppingCart size={30} />
                 
              </Link>
            )}
            <button
              onClick={onLogout}
              className="mx-5 bg-red-500 p-2 rounded hover:bg-red-700 transition-all duration-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
