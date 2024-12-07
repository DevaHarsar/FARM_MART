// routes/orderRoutes.js
const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const Cart = require("../models/Cart");
const router = express.Router();


// Create a new order
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      userId,
      farmerId,
      name,
      products,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      phoneNumber,
      email,
    } = req.body;

    // Validate input
    if (
      !userId ||
      !farmerId ||
      !name ||
      !products ||
      !totalAmount ||
      !paymentMethod ||
      !deliveryAddress ||
      !phoneNumber ||
      !email
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new order
    const order = new Order({
      userId,
      farmerId,
      name,
      products,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      phoneNumber,
      email,
    });

    // Save the order to the database
    const savedOrder = await order.save();
    res.status(201).json({ message: "Order created successfully!", order: savedOrder });
    await Cart.deleteMany({ userId });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Error creating order.", error: error.message });
  }
});



// Fetch all orders for a specific user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authMiddleware adds `user` to the request

    const orders = await Order.find({ userId }).sort({ createdAt: -1 }); // Fetch orders sorted by creation date
    console.log(orders)
    if (orders.length === 0) {
      return res.status(404).json({ message: "" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Error fetching orders.", error: error.message });
  }
});

router.get("/farmer-orders", authMiddleware, async (req, res) => {
  try {
    console.log("Fetching Farmer Orders...");
    const farmerOrders = await Order.find({ farmerId: req.user.id });



    // Check if no orders are found
    if (!farmerOrders || farmerOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for this farmer." });
    }

    // Send the fetched orders as response
    res.status(200).json(farmerOrders);
  } catch (error) {
    // If any error occurs, return a 500 response
    res.status(500).json({
      message: "Error fetching farmer orders",
      error: error.message,
    });
  }
});
// Fetch details of a specific order
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Backend working")
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, userId }).populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res.status(500).json({ message: "Error fetching order details.", error: error.message });
  }
});

// Get all orders for a user
router.get("/user-orders", authMiddleware, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.user._id })
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
});

// Get all orders for a farmer



// Update order status by farmer
router.put("/update-status/:orderId", authMiddleware, async (req, res) => {
  try {
    console.log("Update status");
    const { status } = req.body; // Getting status from request body
    // Ensure the provided status is valid (you can add more validation if needed)
    const validStatuses = ["Processing", "Shipped", "Delivered"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
});

module.exports = router;
