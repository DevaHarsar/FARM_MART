const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { ObjectId } = require('mongodb');

const mongoose = require('mongoose');


// Add product to cart
exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const userId = req.user.id; // Get user ID from the token
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if it doesn't exist
      cart = new Cart({ userId, items: [{ productId, quantity: 1 }] });
    } else {
      // Check if the product already exists in the cart
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Increment quantity if product already exists
        cart.items[itemIndex].quantity += 1;
      } else {
        // Add product to cart
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save(); // Save cart to the database
    res.status(200).json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product to cart", error: error.message });
  }
};

// Get cart items for a user
exports.getCart = async (req, res) => {

  try {
    const userId = req.user.id; // Get userId from request object
     

    if (!userId) {
        throw new Error("User ID is required");
    }

    const userCart  = await Cart.findOne({ userId: userId }); // Find cart by userId
       
    if (!userCart) {
        console.log("Cart not found for this user.");
        return res.status(404).json({ message: "Cart not found for this user." }); // Respond with a 404 status and message
    } else {
        
        return res.status(200).json(userCart); // Respond with the cart data
    }
} catch (error) {
    console.error("Error fetching from backend:", error.message);
    return res.status(500).json({ error: error.message }); // Respond with a 500 status and error message
}

};

exports.updateCart = async (req, res) => {
  try {
    const { itemId } = req.params;  // Make sure to extract itemId from the URL params
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);  // Make sure itemId is being compared properly
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity for the found item
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json(cart.items);  // Send updated items back as the response
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ message: "An error occurred while updating the cart item" });
  }
};



exports.removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id; // Extract the id from the userId object

    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing' });
    }

    const objectIdItemId = new mongoose.Types.ObjectId(itemId);

   

    const result = await Cart.updateOne(
      { userId: new mongoose.Types.ObjectId(userId) }, // Convert userId to ObjectId
      { $pull: { items: { _id: objectIdItemId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Item not found or already removed' });
    }

    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    console.error("Error in backend:", err);
    res.status(500).json({ message: 'Error removing product from cart', error: err.message });
  }
};
