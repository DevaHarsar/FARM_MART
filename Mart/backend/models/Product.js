// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // URL of the product image
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the farmer (user)
});

module.exports = mongoose.model('Product', ProductSchema);
