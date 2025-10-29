import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    course: '',
    year: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    try {
      // Try API first
      const res = await axios.post('http://localhost:5001/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('currentUserEmail', formData.email);
      // Store user data in localStorage for profile display
      if (res.data.user) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUserIndex = users.findIndex(user => user.email === formData.email);
        if (existingUserIndex >= 0) {
          users[existingUserIndex] = { ...users[existingUserIndex], ...res.data.user };
        } else {
          users.push({ ...formData, ...res.data.user });
        }
        localStorage.setItem('users', JSON.stringify(users));
      }
      alert('Registration successful! Welcome to our hostel booking platform.');
      window.location.href = '/profile'; // Redirect to profile page after registration
    } catch (err) {
      // Fallback: Simulate registration with localStorage
      console.log('API Error, using localStorage fallback:', err);
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(user => user.email === formData.email);
      if (existingUser) {
        alert('User already exists! Please login.');
        window.location.href = '/login';
      } else {
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        // Simulate token for localStorage users
        localStorage.setItem('token', 'local_' + Date.now());
        localStorage.setItem('currentUserEmail', formData.email);
        alert('Registration successful! Welcome to our hostel booking platform.');
        window.location.href = '/profile'; // Redirect to profile page after registration
      }
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div className="card" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
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
                placeholder="Create a password (min 6 characters)"
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
          <button type="submit" className="btn" style={{ width: '100%', marginTop: '20px' }}>Create Account</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#6c757d' }}>
          Already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
