// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Example of a signup route
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const newUser = new User({ email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// routes/authRoutes.js
// Add this login route to the existing authRoutes.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare passwords (if you are using bcrypt, otherwise adjust accordingly)
    // Assuming password is stored in plain text (for simplicity, but use hashing in production)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Return success and user role
    return res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
