
import React, { useState, useEffect } from 'react';
import { getAllProducts, getFarmerDetails } from '../../services/api'; // Ensure `getFarmerDetails` fetches farmer details by ID.
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Importing search and clear icons


const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [farmerUsernames, setFarmerUsernames] = useState({}); // Store farmer usernames mapped by ID.
  const [searchTerm, setSearchTerm] = useState(''); // Store the search term

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();


      const filteredProducts = response.data.filter(
        (product) => product.visibility !== "hidden"
      );
   
      // Fetch farmer usernames for visible products
      const usernames = {};
      for (const product of filteredProducts) {
        if (product.farmerId) {
          const farmerResponse = await getFarmerDetails(product.farmerId);
          usernames[product.farmerId] =
            farmerResponse.data.username || "Unknown";
        }
      }

      setProducts(filteredProducts);
      setFarmerUsernames(usernames);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) // You can also search by category
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold mb-6 text-center">All Products</h2>
      
      {/* Search Bar */}
      <div className="mb-6 flex justify-center relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-3 pl-10 pr-3 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute left-3 top-2.5 text-gray-500">
          <FaSearch size={18} />
        </div>
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={product.image || "default-image-url.jpg"}
                alt={product.name}
                className="w-full h-56 object-cover transition-all duration-300 ease-in-out"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  ₹{product.prices.price_1kg}
                </p>
                <p className="text-sm text-gray-700 mt-2">Qty: 1 kg</p>
                <p className="text-sm text-gray-700 mt-2">
                  Sold by: {farmerUsernames[product.farmerId] || "Unknown"}
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
