import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/rooms';
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      // Try API first
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('currentUserEmail', formData.email);

      // Get user name from API response or localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email);
      const displayName = user ? user.name : formData.email.split('@')[0];

      alert(`Login successful! Welcome back, ${displayName}!`);
      window.location.href = '/rooms'; // Redirect directly to rooms page
    } catch (err) {
      // Fallback: Check localStorage users
      console.log('API Error, using localStorage fallback:', err);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        // Simulate token for localStorage users
        localStorage.setItem('token', 'local_' + Date.now());
        localStorage.setItem('currentUserEmail', formData.email);
        alert(`Login successful! Welcome back, ${user.name}!`);
        window.location.href = '/rooms'; // Redirect directly to rooms page
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>Welcome Back</h2>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.querySelector('input[name="password"]');
                  input.type = input.type === 'password' ? 'text' : 'password';
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6c757d',
                  fontSize: '14px'
                }}
              >
                👁️
              </button>
            </div>
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '20px' }}>Sign In</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
          Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
