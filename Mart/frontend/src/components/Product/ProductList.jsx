import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
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
                className="w-full h-48 object-cover transition-all duration-300 ease-in-out group-hover:scale-110"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category}</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">${product.price}</p>
                <p className="text-sm text-gray-700 mt-2">
                  Sold by: {product.farmer?.username || 'Unknown'}
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
