import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Don't show navbar on landing page when not logged in
  if (!user && location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo">
          💰 Expense Tracker
        </Link>

        {user ? (
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <Link to="/expenses" className="navbar-link">Expenses</Link>
            <Link to="/groups" className="navbar-link">Groups</Link>
            
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
