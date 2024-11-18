// src/components/ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch the products from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <NavLink
              to={`/view-product/${product._id}`}
              className="cursor-pointer"
            >
              <div
                key={product._id}
                className="border rounded-lg overflow-hidden shadow-md hover:scale-105 ease-in-out"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-700">Category: {product.category}</p>
                  <p className="text-lg font-bold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </NavLink>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;
