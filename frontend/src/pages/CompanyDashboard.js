import React, { useState, useEffect } from "react";
import axios from "axios";

function CompanyDashboard({ user }) {
  // State for jobs and applications
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for new job form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Fetch company's jobs and applications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get jobs posted by this company
        const jobsResponse = await axios.get(
          `http://localhost:5000/jobs/company/${user.id}`
        );
        setJobs(jobsResponse.data);

        // Get applications for company's jobs
        const appsResponse = await axios.get(
          `http://localhost:5000/apply/company/${user.id}`
        );
        setApplications(appsResponse.data);

      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id]);

  // Handle new job submission
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/jobs", {
        title,
        company: user.name,
        location,
        description,
        postedBy: user.id
      });

      // Add new job to list
      setJobs([response.data, ...jobs]);
      
      // Reset form
      setTitle("");
      setLocation("");
      setDescription("");
      setShowForm(false);
      setFormSuccess("Job posted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setFormSuccess(""), 3000);

    } catch (error) {
      setFormError("Failed to create job");
    }
  };

  if (loading) {
    return <div className="loading-box">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Company Dashboard</h1>
        <p>Welcome, {user.name}</p>
      </div>

      {formSuccess && <div className="success-msg">{formSuccess}</div>}

      {/* Jobs Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Job Openings ({jobs.length})</h2>
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Post New Job"}
          </button>
        </div>

        {/* New Job Form */}
        {showForm && (
          <div className="job-form-card">
            <h3>Create New Job Opening</h3>
            {formError && <div className="error-msg">{formError}</div>}
            
            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Developer"
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chennai, India"
                  required
                />
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the job role, requirements, etc."
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Post Job
              </button>
            </form>
          </div>
        )}

        {/* Jobs List */}
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <p className="no-data">No jobs posted yet. Create your first job opening!</p>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="job-item">
                <div>
                  <h4>{job.title}</h4>
                  <p>{job.location}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Applications Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Applications Received ({applications.length})</h2>
        </div>

        <div className="applications-list">
          {applications.length === 0 ? (
            <p className="no-data">No applications received yet.</p>
          ) : (
            applications.map((app) => (
              <div key={app._id} className="application-card">
                <div className="app-header">
                  <h4>{app.name}</h4>
                  <span className="app-job">
                    Applied for: {app.jobId?.title || "Unknown Job"}
                  </span>
                </div>
                <p className="app-email">Email: {app.email}</p>
                <div className="app-resume">
                  <strong>Resume:</strong>
                  <p>{app.resume}</p>
                </div>
                <p className="app-date">
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;
