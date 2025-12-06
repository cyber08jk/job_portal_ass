import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function JobDetails({ user }) {
  // Get job ID from URL
  const { id } = useParams();
  const navigate = useNavigate();

  // State for job data
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for application form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch job details on load
  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/jobs/${id}`);
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        console.log('Error fetching job:', err);
        setLoading(false);
      }
    };
    getJobDetails();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    // Check if all fields filled
    if (!formData.name || !formData.email || !formData.resume) {
      setMessage('Please fill in all fields');
      setSubmitting(false);
      return;
    }

    try {
      // Send application to backend
      const applicationData = {
        ...formData,
        jobId: id
      };

      await axios.post('http://localhost:5000/apply', applicationData);
      
      setMessage('Application submitted successfully!');
      setFormData({ name: '', email: '', resume: '' });
      
    } catch (err) {
      console.log('Error submitting:', err);
      setMessage(err.response?.data?.error || 'Failed to submit. Please try again.');
    }
    
    setSubmitting(false);
  };

  // Loading state
  if (loading) {
    return <div className="loading-box"><p>Loading...</p></div>;
  }

  // Job not found
  if (!job) {
    return (
      <div className="error-box">
        <p>Job not found</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      {/* Job Information Section */}
      <div className="job-info-card">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Jobs
        </button>
        
        <h1>{job.title}</h1>
        <h3 className="company-name">{job.company}</h3>
        <p className="location">📍 {job.location}</p>
        
        <div className="description-section">
          <h4>Job Description</h4>
          <p>{job.description}</p>
        </div>
      </div>

      {/* Application Form Section */}
      <div className="apply-section">
        <h2>Apply for this Position</h2>
        
        {/* Check if user is logged in */}
        {!user ? (
          <div className="login-prompt">
            <p>Please login to apply for this job</p>
            <Link to="/login" className="login-link-btn">Login to Apply</Link>
          </div>
        ) : user.role === "company" ? (
          <div className="login-prompt">
            <p>Company accounts cannot apply for jobs</p>
          </div>
        ) : (
          <>
            {/* Success/Error Message */}
            {message && (
              <div className={message.includes('success') ? 'success-msg' : 'error-msg'}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="apply-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="resume">Resume / Cover Letter</label>
                <textarea
                  id="resume"
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  placeholder="Paste your resume or write a cover letter here..."
                  rows="8"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
