const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  const { name, description, price, quantity, image } = req.body;
  const newProduct = new Product({
    farmer: req.user.id,
    name,
    description,
    price,
    quantity,
    image,
  });
  await newProduct.save();
  res.json(newProduct);
};

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
