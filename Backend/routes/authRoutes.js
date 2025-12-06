const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register new user
// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (simple - no password hashing for beginner level)
    const newUser = new User({
      name,
      email,
      password, // In real app, hash this password
      role: role || "user"
    });

    await newUser.save();

    // Send back user data (without password)
    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.log("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login user
// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check password (simple comparison - no hashing for beginner level)
    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Send back user data
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
