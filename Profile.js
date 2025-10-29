import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    studentId: '',
    course: '',
    year: '',
    leetcode: '',
    github: '',
    linkedin: '',
    portfolio: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5001/api/profile', {
        headers: { Authorization: token }
      });

      setUser(res.data);
      setEditForm({
        name: res.data.name || '',
        email: res.data.email || '',
        studentId: res.data.studentId || '',
        course: res.data.course || '',
        year: res.data.year || '',
        leetcode: res.data.leetcode || '',
        github: res.data.github || '',
        linkedin: res.data.linkedin || '',
        portfolio: res.data.portfolio || '',
        bio: res.data.bio || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Fallback to localStorage if API fails
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.email === currentUserEmail);
      if (currentUser) {
        setUser(currentUser);
        setEditForm({
          name: currentUser.name || '',
          email: currentUser.email || '',
          studentId: currentUser.studentId || '',
          course: currentUser.course || '',
          year: currentUser.year || '',
          leetcode: currentUser.leetcode || '',
          github: currentUser.github || '',
          linkedin: currentUser.linkedin || '',
          portfolio: currentUser.portfolio || '',
          bio: currentUser.bio || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5001/api/profile', editForm, {
        headers: { Authorization: token }
      });

      setUser(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserEmail');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please login to view your profile</h2>
        <Link to="/login" className="btn">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Cover Photo Section */}
      <div style={{
        height: '200px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        borderRadius: '0 0 20px 20px',
        marginBottom: '80px'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'white',
          border: '4px solid white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3em',
          color: '#007bff',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          cursor: 'pointer'
        }} onClick={() => document.getElementById('profileImageInput').click()}>
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <span>👤</span>
          )}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            backgroundColor: '#007bff',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2em',
            color: 'white',
            border: '2px solid white'
          }}>
            📷
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', padding: '0 20px' }}>
        {/* Profile Header Info */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h1 style={{
            color: '#2c3e50',
            marginBottom: '10px',
            fontSize: '2.2em',
            fontWeight: '700'
          }}>{user.name}</h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1em',
            marginBottom: '15px'
          }}>{user.email}</p>

          {/* Student Info Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '20px'
          }}>
            <span style={{
              backgroundColor: '#e8f4fd',
              color: '#007bff',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.9em',
              fontWeight: '600'
            }}>
              🎓 {user.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
            {user.studentId && (
              <span style={{
                backgroundColor: '#f8f9fa',
                color: '#495057',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9em',
                fontWeight: '600'
              }}>
                🆔 {user.studentId}
              </span>
            )}
            {user.course && (
              <span style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9em',
                fontWeight: '600'
              }}>
                📚 {user.course}
              </span>
            )}
            {user.year && (
              <span style={{
                backgroundColor: '#d1ecf1',
                color: '#0c5460',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9em',
                fontWeight: '600'
              }}>
                📅 {user.year}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              ✏️ Edit Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '1em',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const updatedUsers = users.map(u =>
                  u.email === user.email ? { ...u, profileImage: event.target.result } : u
                );
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                setUser({ ...user, profileImage: event.target.result });
                alert('Profile image updated successfully!');
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Profile Content */}
        {isEditing ? (
          <div>
            <h2 style={{ color: '#007bff', marginBottom: '20px' }}>Edit Profile</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Student ID</label>
                <input
                  type="text"
                  value={editForm.studentId}
                  onChange={(e) => setEditForm({...editForm, studentId: e.target.value})}
                  placeholder="Your student ID"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Course</label>
                <input
                  type="text"
                  value={editForm.course}
                  onChange={(e) => setEditForm({...editForm, course: e.target.value})}
                  placeholder="Your course (e.g., Computer Science)"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Year</label>
                <input
                  type="text"
                  value={editForm.year}
                  onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                  placeholder="Your year (e.g., 1st Year, 2nd Year)"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }}
                />
              </div>

              <h3 style={{ color: '#007bff', marginTop: '30px' }}>Coding Profiles</h3>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LeetCode Username</label>
                <input
                  type="text"
                  value={editForm.leetcode}
                  onChange={(e) => setEditForm({...editForm, leetcode: e.target.value})}
                  placeholder="Your LeetCode username"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>GitHub Username</label>
                <input
                  type="text"
                  value={editForm.github}
                  onChange={(e) => setEditForm({...editForm, github: e.target.value})}
                  placeholder="Your GitHub username"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LinkedIn Profile</label>
                <input
                  type="url"
                  value={editForm.linkedin}
                  onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/yourprofile"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Portfolio Website</label>
                <input
                  type="url"
                  value={editForm.portfolio}
                  onChange={(e) => setEditForm({...editForm, portfolio: e.target.value})}
                  placeholder="https://yourportfolio.com"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={handleSave} className="btn" style={{ flex: 1 }}>Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Bio Section */}
            {user.bio && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#007bff', marginBottom: '10px' }}>About Me</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>{user.bio}</p>
              </div>
            )}

            {/* Profile Information */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Profile Information</h3>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2em' }}>👤</span>
                  <span style={{ color: '#495057' }}>Name: {user.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2em' }}>📧</span>
                  <span style={{ color: '#495057' }}>Email: {user.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2em' }}>🎓</span>
                  <span style={{ color: '#495057' }}>Role: {user.role === 'admin' ? 'Administrator' : 'Student'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2em' }}>🆔</span>
                  <span style={{ color: '#495057' }}>Student ID: {user.studentId || 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2em' }}>📚</span>
                  <span style={{ color: '#495057' }}>Course: {user.course || 'Not set'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2em' }}>📅</span>
                  <span style={{ color: '#495057' }}>Year: {user.year || 'Not set'}</span>
                </div>
                {user.bio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.2em' }}>📝</span>
                    <span style={{ color: '#495057' }}>Bio: {user.bio}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Coding Profiles */}
            {(user.leetcode || user.github || user.linkedin || user.portfolio) && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Coding Profiles</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {user.leetcode && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2em' }}>💻</span>
                      <span style={{ color: '#495057' }}>
                        LeetCode: <a href={`https://leetcode.com/${user.leetcode}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>{user.leetcode}</a>
                      </span>
                    </div>
                  )}
                  {user.github && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2em' }}>🐙</span>
                      <span style={{ color: '#495057' }}>
                        GitHub: <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>{user.github}</a>
                      </span>
                    </div>
                  )}
                  {user.linkedin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2em' }}>💼</span>
                      <span style={{ color: '#495057' }}>
                        LinkedIn: <a href={user.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>View Profile</a>
                      </span>
                    </div>
                  )}
                  {user.portfolio && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2em' }}>🌐</span>
                      <span style={{ color: '#495057' }}>
                        Portfolio: <a href={user.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>View Portfolio</a>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#007bff', marginBottom: '15px' }}>Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <Link to="/rooms" className="btn" style={{ textAlign: 'center', padding: '15px' }}>
                  Browse Rooms
                </Link>
                <Link to="/bookings" className="btn" style={{ textAlign: 'center', padding: '15px' }}>
                  My Bookings
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#28a745' }}>
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setIsEditing(true)} className="btn" style={{ flex: 1, minWidth: '150px' }}>
                Edit Profile
              </button>
              <Link to="/settings" className="btn" style={{ flex: 1, minWidth: '150px', backgroundColor: '#6f42c1', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>
                ⚙️ Settings
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ flex: 1, minWidth: '150px' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
