
const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    console.log("Error fetching jobs:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// GET single job by ID
router.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    res.json(job);
  } catch (error) {
    console.log("Error fetching job:", error.message);
    res.status(500).json({ error: "Failed to fetch job details" });
  }
});

// POST create new job
router.post("/", async (req, res) => {
  try {
    const { title, company, location, description, postedBy } = req.body;
    
    // Basic validation
    if (!title || !company || !location || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Create new job document
    const newJob = new Job({
      title,
      company,
      location,
      description,
      postedBy
    });
    
    // Save to database
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
    
  } catch (error) {
    console.log("Error creating job:", error.message);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// GET jobs posted by a specific company
router.get("/company/:userId", async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.userId }).sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    console.log("Error fetching company jobs:", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

module.exports = router;
