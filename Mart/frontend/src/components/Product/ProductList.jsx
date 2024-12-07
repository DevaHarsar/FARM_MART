import React, { useState, useEffect } from 'react';
import { getAllProducts, getFarmerDetails } from '../../services/api'; // Ensure `getFarmerDetails` fetches farmer details by ID.
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [farmerUsernames, setFarmerUsernames] = useState({}); // Store farmer usernames mapped by ID.

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();
      console.log(response)
      const filteredProducts = response.data.filter((product) => product.visibility !== "hidden");

      // Fetch farmer usernames for visible products
      const usernames = {};
      for (const product of filteredProducts) {
        if (product.farmerId) {
          const farmerResponse = await getFarmerDetails(product.farmerId);
          usernames[product.farmerId] = farmerResponse.data.username || 'Unknown';
        }
      }

      setProducts(filteredProducts);
      setFarmerUsernames(usernames);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={product.image || 'default-image-url.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover transition-all duration-300 ease-in-out"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">₹{product.prices.price_1kg}</p>
                <p className="text-sm text-gray-700 mt-2">Qty: 1 kg</p>
                <p className="text-sm text-gray-700 mt-2">
                  Sold by: {farmerUsernames[product.farmerId] || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
