const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route handlers
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const authRoutes = require("./routes/authRoutes");

// Create Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/jobportal";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
  });

// API Routes
app.use("/jobs", jobRoutes);          // Job related endpoints
app.use("/apply", applicationRoutes); // Application submission endpoint
app.use("/auth", authRoutes);         // Login and register endpoints

app.get("/", (req, res) => {
  res.json({ message: "Job Portal API is running" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
