// src/components/FarmerDashboard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const FarmerDashboard = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    image: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/products', product);
      setSuccessMessage(response.data.message);
      setProduct({ name: '', category: '', price: '', image: '' }); // Reset the form
    } catch (error) {
      console.error('Error adding product:', error);
      setErrorMessage(error.response ? error.response.data.message : 'Failed to add product');
    }
  };

  return (
    <>
      
      <div className="flex flex-col items-center p-4">
        <h1 className="text-2xl font-bold mb-4">Farmer Dashboard</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full mb-4 p-2 border rounded"
            value={product.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full mb-4 p-2 border rounded"
            value={product.category}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="w-full mb-4 p-2 border rounded"
            value={product.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            className="w-full mb-4 p-2 border rounded"
            value={product.image}
            onChange={handleChange}
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Add Product</button>
        </form>
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </div>
    </>
  );
};

export default FarmerDashboard;
