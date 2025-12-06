import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CompanyDashboard from './pages/CompanyDashboard';
import './App.css';

function App() {
  // User state - check localStorage on load
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          JobPortal
        </Link>
        <div className="nav-links">
          <Link to="/">All Jobs</Link>
          
          {/* Show different links based on login status */}
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              {/* Show Dashboard link for company users */}
              {user.role === 'company' && (
                <Link to="/dashboard">Dashboard</Link>
              )}
              <span className="user-name">Hi, {user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/job/:id" element={<JobDetails user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route 
            path="/dashboard" 
            element={
              user && user.role === 'company' 
                ? <CompanyDashboard user={user} /> 
                : <Login setUser={setUser} />
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
