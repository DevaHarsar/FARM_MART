import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import logo from "../assets/img/fAMRMART LOGO.webp"
const Navbar = ({ isLoggedIn, isFarmer, onLogout, cartLength }) => {
  return (
    <nav className="flex justify-between items-center p-4 bg-green-600 text-white">
      <Link to="/" className="text-lg font-bold">

        <div className="sticky top-0 left-0">
          <img src={logo} alt="Farm Mart Logo" className="h-12 w-28" />
        </div>
      </Link>
      <div className="flex items-center space-x-6">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
              Login
            </Link>
            <Link to="/signup" className="text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
              Signup
            </Link>
          </>
        ) : (
          <>
            {isFarmer ? (
              <>
                <Link to="/farmer-dashboard" className="text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
                  Farmer Dashboard
                </Link>
                <Link to="/orders/farmer-orders" className="text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
                  Ordered List
                </Link>
              </>
            ) : (
              <>
                <Link to="/orders" className="text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
                  Orders
                </Link>
                <Link to="/product-list" className="text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
                  Product List
                </Link>
              </>
            )}
            {!isFarmer && (
              <Link to="/cart" className="relative text-center bg-white text-green-700 py-2 px-4 rounded-md hover:bg-green-300 transition-all duration-200">
                <FiShoppingCart size={30} />
                {cartLength > 0 && (
                  <span className="absolute top-0 right-0 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {cartLength}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={onLogout}
              className="text-center bg-red-500 py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200"
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
