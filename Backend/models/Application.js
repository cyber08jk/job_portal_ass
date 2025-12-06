const mongoose = require("mongoose");

// Define the schema for applications
const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  resume: {
    type: String,  // Text-based resume content
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
