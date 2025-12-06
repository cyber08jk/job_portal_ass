import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobList() {
  // State to store jobs from API
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch jobs when component loads
  useEffect(() => {
    fetchJobs();
  }, []);

  // Function to get all jobs from backend
  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/jobs');
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      console.log('Error loading jobs:', err);
      setError('Unable to load jobs. Please try again.');
      setLoading(false);
    }
  };

  // Show loading message
  if (loading) {
    return (
      <div className="loading-box">
        <p>Loading jobs...</p>
      </div>
    );
  }

  // Show error if any
  if (error) {
    return (
      <div className="error-box">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="job-list-page">
      <h1>Available Job Openings</h1>
      
      {/* Show message if no jobs */}
      {jobs.length === 0 ? (
        <p className="no-jobs">No job openings at the moment.</p>
      ) : (
        <div className="job-grid">
          {/* Loop through each job */}
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-company">{job.company}</p>
              <p className="job-location">📍 {job.location}</p>
              
              <Link to={`/job/${job._id}`} className="view-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;
