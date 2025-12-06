import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register({ setUser }) {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("applicant"); // 'applicant' or 'company'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send register request to backend
      const response = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
        role
      });

      // Save user to state and localStorage
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect based on role
      if (userData.role === "company") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Register</h2>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="role-selector">
            <label className={role === "applicant" ? "active" : ""}>
              <input
                type="radio"
                name="role"
                value="applicant"
                checked={role === "applicant"}
                onChange={(e) => setRole(e.target.value)}
              />
              Job Seeker
            </label>
            <label className={role === "company" ? "active" : ""}>
              <input
                type="radio"
                name="role"
                value="company"
                checked={role === "company"}
                onChange={(e) => setRole(e.target.value)}
              />
              Company
            </label>
          </div>

          <div className="form-group">
            <label>{role === "company" ? "Company Name" : "Full Name"}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "company" ? "Enter company name" : "Enter your name"}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
