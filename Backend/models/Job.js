
const mongoose = require("mongoose");

// Define the schema for job documents
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  postedDate: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
