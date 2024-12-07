import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../services/api.js'; // Ensure axios is installed for API calls
import Navbar from './Navbar'; // Assuming you have a Navbar component
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    if (!user) {
      // If user is not logged in, redirect to login page
      navigate('/login');
    } else {
      // Proceed with adding to the cart (this part can be added later)
      console.log(`Product added to cart: ${product.name}`);
    }
  };

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(); // Replace with your actual endpoint
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-green-600 text-white py-8">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold">Welcome to Farm Mart</h1>
            <p className="text-lg mt-4">
              Explore fresh products directly from farmers. Best quality, best prices!
            </p>
          </div>
        </div>

        {/* Featured Products */}
        <section className="mt-12">
          <div className="container mx-auto text-center mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <img
                    src={product.image || '/path/to/default-image.jpg'} // Default image if no image exists
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xl font-bold text-green-600">₹{product.prices.price_1kg}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-all duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="bg-gray-50 py-8">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800">Fruits & Vegetables</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800">Seeds</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800">Fertilizers</h3>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800">Farm Equipment</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
