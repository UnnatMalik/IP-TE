import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="emoji">💰</span>
            Track, Split, Simplify
          </h1>
          <p className="hero-subtitle">
            The smartest way to manage expenses and split bills with friends
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Login
            </Link>
          </div>
          <p className="hero-note">No credit card required • Free forever</p>
        </div>
        
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">🍔</div>
            <div className="card-text">
              <div className="card-title">Dinner Split</div>
              <div className="card-amount">₹1,200</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🎬</div>
            <div className="card-text">
              <div className="card-title">Movie Night</div>
              <div className="card-amount">₹800</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">✈️</div>
            <div className="card-text">
              <div className="card-title">Trip Expenses</div>
              <div className="card-amount">₹5,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">Powerful features to manage your money better</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts and graphs to visualize your spending patterns</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Group Expenses</h3>
            <p>Create groups and split bills easily with friends and family</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💸</div>
            <h3>Smart Splitting</h3>
            <p>Split expenses equally or customize amounts for each person</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Advanced Filters</h3>
            <p>Filter by category, date, group, and more to find any expense</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Balance Tracking</h3>
            <p>See who owes you and who you owe at a glance</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and secure with industry-standard protection</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Get started in three simple steps</p>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Account</h3>
              <p>Sign up for free in seconds. No credit card needed.</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Add Expenses</h3>
              <p>Track your expenses and organize them by categories.</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Split & Settle</h3>
              <p>Split bills with friends and settle up instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat">
            <div className="stat-number">₹50M+</div>
            <div className="stat-label">Expenses Tracked</div>
          </div>
          <div className="stat">
            <div className="stat-number">25K+</div>
            <div className="stat-label">Groups Created</div>
          </div>
          <div className="stat">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">User Rating</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "This app has made splitting expenses with roommates so much easier. No more awkward money conversations!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">A</div>
              <div>
                <div className="author-name">Anjali Sharma</div>
                <div className="author-title">College Student</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The visual analytics help me understand where my money goes. Best expense tracker I've used!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">R</div>
              <div>
                <div className="author-name">Rahul Verma</div>
                <div className="author-title">Software Engineer</div>
              </div>
            </div>
          </div>

          <div className="testimonial">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Perfect for our trip expenses! Everyone could see who paid what and settle up easily."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">P</div>
              <div>
                <div className="author-name">Priya Patel</div>
                <div className="author-title">Travel Enthusiast</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Take Control?</h2>
        <p>Join thousands of users managing their expenses smarter</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Start Free Today
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>💰 Expense Tracker</h3>
            <p>Smart expense management for everyone</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#download">Download</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#blog">Blog</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Expense Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
