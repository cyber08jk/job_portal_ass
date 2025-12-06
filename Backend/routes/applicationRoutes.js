const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");

// POST submit application
router.post("/", async (req, res) => {
  try {
    const { name, email, resume, jobId } = req.body;
    
    // Validate required fields
    if (!name || !email || !resume || !jobId) {
      return res.status(400).json({ error: "Please fill all fields" });
    }
    
    // Simple email format check
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    
    // Create application document
    const newApplication = new Application({
      name,
      email,
      resume,
      jobId
    });
    
    // Save to database
    const savedApplication = await newApplication.save();
    
    res.status(201).json({ 
      message: "successful",
      application: savedApplication 
    });
    
  } catch (error) {
    console.log("Error submitting application:", error.message);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// GET applications for jobs posted by a company
router.get("/company/:userId", async (req, res) => {
  try {
    // First find all jobs posted by this company
    const companyJobs = await Job.find({ postedBy: req.params.userId });
    const jobIds = companyJobs.map(job => job._id);
    
    // Then find all applications for those jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title company")
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    console.log("Error fetching applications:", error.message);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

module.exports = router;
