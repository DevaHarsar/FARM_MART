const express = require('express');
const Product = require('../models/Product'); // Make sure this path is correct
const router = express.Router();

// POST: Add a new product
router.post('/', async (req, res) => {
  const { name, category, price, image } = req.body;

  try {
    const newProduct = new Product({ name, category, price, image });
    await newProduct.save();
    return res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Failed to add product' });
  }
});

// GET: Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
