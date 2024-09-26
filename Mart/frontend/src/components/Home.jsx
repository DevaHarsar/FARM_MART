// src/components/Home.jsx
import React from 'react';
import Navbar from './Navbar';

const Home = () => {
  return (
    <>
    
      <div className="bg-green-100 min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome to Farm Mart</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Your one-stop solution for all agricultural needs. Discover the best products from our trusted farmers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Featured Products</h2>
            <p className="text-gray-600">Fresh fruits and vegetables</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Quality Seeds</h2>
            <p className="text-gray-600">High-quality seeds for your crops</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Organic Fertilizers</h2>
            <p className="text-gray-600">Eco-friendly fertilizers for healthy soil</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Farm Equipment</h2>
            <p className="text-gray-600">Tools and machinery for all your farming needs</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
