// src/components/Product/ProductForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/products', {
        name,
        category,
        image,
        price,
      });
      alert(response.data.message); // Display success message
      // Reset form or handle after submission
      setName('');
      setCategory('');
      setImage('');
      setPrice('');
    } catch (error) {
      console.error('Error adding product:', error.response.data);
      alert(`Failed to add product: ${error.response.data.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
      <input type="text" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <button type="submit">Add Product</button>
    </form>
  );
};

export default ProductForm;
