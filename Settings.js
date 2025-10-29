import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    studentId: '',
    course: '',
    year: '',
    bio: '',
    leetcode: '',
    github: '',
    linkedin: '',
    portfolio: '',
    notifications: true,
    privacy: 'public'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
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
      setSettings({
        name: res.data.name || '',
        email: res.data.email || '',
        studentId: res.data.studentId || '',
        course: res.data.course || '',
        year: res.data.year || '',
        bio: res.data.bio || '',
        leetcode: res.data.leetcode || '',
        github: res.data.github || '',
        linkedin: res.data.linkedin || '',
        portfolio: res.data.portfolio || '',
        notifications: res.data.notifications !== false,
        privacy: res.data.privacy || 'public'
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      // Fallback to localStorage
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.email === currentUserEmail);
      if (currentUser) {
        setUser(currentUser);
        setSettings({
          name: currentUser.name || '',
          email: currentUser.email || '',
          studentId: currentUser.studentId || '',
          course: currentUser.course || '',
          year: currentUser.year || '',
          bio: currentUser.bio || '',
          leetcode: currentUser.leetcode || '',
          github: currentUser.github || '',
          linkedin: currentUser.linkedin || '',
          portfolio: currentUser.portfolio || '',
          notifications: currentUser.notifications !== false,
          privacy: currentUser.privacy || 'public'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5001/api/profile', settings, {
        headers: { Authorization: token }
      });

      setUser(res.data);
      alert(`${section} settings updated successfully!`);
    } catch (err) {
      console.error('Error updating settings:', err);
      alert('Failed to update settings. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserEmail');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading settings...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Please login to access settings</h2>
        <Link to="/login" className="btn">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 0',
        color: 'white'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '10px', fontSize: '2.5em' }}>⚙️ Account Settings</h1>
          <p style={{ fontSize: '1.1em', opacity: '0.9' }}>Manage your profile and preferences</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '1000px', padding: '0 20px' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginTop: '-30px',
          position: 'relative',
          zIndex: 1
        }}>

          {/* Tab Navigation */}
          <div style={{
            borderBottom: '1px solid #e9ecef',
            padding: '0 30px'
          }}>
            <div style={{
              display: 'flex',
              gap: '0',
              overflowX: 'auto'
            }}>
              {[
                { id: 'profile', label: '👤 Profile', icon: '👤' },
                { id: 'academic', label: '🎓 Academic', icon: '🎓' },
                { id: 'social', label: '🌐 Social Links', icon: '🌐' },
                { id: 'privacy', label: '🔒 Privacy', icon: '🔒' },
                { id: 'account', label: '⚙️ Account', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '20px 25px',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#6c757d',
                    borderBottom: activeTab === tab.id ? '3px solid #0056b3' : '3px solid transparent',
                    cursor: 'pointer',
                    fontSize: '1em',
                    fontWeight: '600',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '30px' }}>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Basic Information</h3>
                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({...settings, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({...settings, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Bio
                    </label>
                    <textarea
                      value={settings.bio}
                      onChange={(e) => setSettings({...settings, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        minHeight: '100px',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleSave('Profile')}
                    className="btn"
                    style={{
                      backgroundColor: '#28a745',
                      padding: '12px 30px',
                      fontSize: '1em',
                      fontWeight: '600'
                    }}
                  >
                    💾 Save Profile Changes
                  </button>
                </div>
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === 'academic' && (
              <div>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Academic Information</h3>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '1.5em' }}>🎓</span>
                    <div>
                      <h4 style={{ margin: '0', color: '#495057' }}>Academic Profile</h4>
                      <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '0.9em' }}>
                        Update your student information and academic details
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={settings.studentId}
                      onChange={(e) => setSettings({...settings, studentId: e.target.value})}
                      placeholder="e.g., STU2024001"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Course/Program
                    </label>
                    <input
                      type="text"
                      value={settings.course}
                      onChange={(e) => setSettings({...settings, course: e.target.value})}
                      placeholder="e.g., Computer Science, Engineering"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Year/Semester
                    </label>
                    <select
                      value={settings.year}
                      onChange={(e) => setSettings({...settings, year: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        backgroundColor: 'white',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                      <option value="Masters">Masters</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleSave('Academic')}
                    className="btn"
                    style={{
                      backgroundColor: '#17a2b8',
                      padding: '12px 30px',
                      fontSize: '1em',
                      fontWeight: '600'
                    }}
                  >
                    🎓 Save Academic Changes
                  </button>
                </div>
              </div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <div>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Social & Professional Links</h3>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '1.5em' }}>🌐</span>
                    <div>
                      <h4 style={{ margin: '0', color: '#495057' }}>Online Presence</h4>
                      <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '0.9em' }}>
                        Connect your coding profiles and professional networks
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      LeetCode Username
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ padding: '12px', backgroundColor: '#f8f9fa', border: '2px solid #e9ecef', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#6c757d' }}>
                        leetcode.com/
                      </span>
                      <input
                        type="text"
                        value={settings.leetcode}
                        onChange={(e) => setSettings({...settings, leetcode: e.target.value})}
                        placeholder="your-username"
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderLeft: 'none',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '1em',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      GitHub Username
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ padding: '12px', backgroundColor: '#f8f9fa', border: '2px solid #e9ecef', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#6c757d' }}>
                        github.com/
                      </span>
                      <input
                        type="text"
                        value={settings.github}
                        onChange={(e) => setSettings({...settings, github: e.target.value})}
                        placeholder="your-username"
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '2px solid #e9ecef',
                          borderLeft: 'none',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '1em',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#007bff'}
                        onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={settings.linkedin}
                      onChange={(e) => setSettings({...settings, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/in/yourprofile"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#495057' }}>
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      value={settings.portfolio}
                      onChange={(e) => setSettings({...settings, portfolio: e.target.value})}
                      placeholder="https://yourportfolio.com"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '1em',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007bff'}
                      onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleSave('Social Links')}
                    className="btn"
                    style={{
                      backgroundColor: '#6f42c1',
                      padding: '12px 30px',
                      fontSize: '1em',
                      fontWeight: '600'
                    }}
                  >
                    🌐 Save Social Links
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Privacy & Security</h3>

                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #e9ecef',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '1.5em' }}>🔒</span>
                    <div>
                      <h4 style={{ margin: '0', color: '#495057' }}>Privacy Settings</h4>
                      <p style={{ margin: '5px 0 0 0', color: '#6c757d', fontSize: '0.9em' }}>
                        Control who can see your information and activity
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '20px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#495057' }}>
                      Profile Visibility
                    </label>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {[
                        { value: 'public', label: '🌍 Public', desc: 'Anyone can view your profile' },
                        { value: 'students', label: '🎓 Students Only', desc: 'Only logged-in students can view' },
                        { value: 'private', label: '🔒 Private', desc: 'Only you can view your profile' }
                      ].map(option => (
                        <label
                          key={option.value}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '15px',
                            border: `2px solid ${settings.privacy === option.value ? '#007bff' : '#e9ecef'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: settings.privacy === option.value ? '#e7f3ff' : 'white',
                            transition: 'all 0.3s ease',
                            flex: '1',
                            minWidth: '200px'
                          }}
                        >
                          <input
                            type="radio"
                            name="privacy"
                            value={option.value}
                            checked={settings.privacy === option.value}
                            onChange={(e) => setSettings({...settings, privacy: e.target.value})}
                            style={{ display: 'none' }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', marginBottom: '5px' }}>{option.label}</div>
                            <div style={{ fontSize: '0.9em', color: '#6c757d' }}>{option.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 'bold',
                      color: '#495057',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#007bff'
                        }}
                      />
                      <span>📧 Email Notifications</span>
                    </label>
                    <p style={{ margin: '5px 0 0 28px', color: '#6c757d', fontSize: '0.9em' }}>
                      Receive notifications about bookings, updates, and important announcements
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleSave('Privacy')}
                    className="btn"
                    style={{
                      backgroundColor: '#dc3545',
                      padding: '12px 30px',
                      fontSize: '1em',
                      fontWeight: '600'
                    }}
                  >
                    🔒 Save Privacy Settings
                  </button>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Account Management</h3>

                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '10px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.5em' }}>👤</span>
                    <div>
                      <h4 style={{ margin: '0', color: '#856404' }}>Account Information</h4>
                      <p style={{ margin: '5px 0 0 0', color: '#856404', fontSize: '0.9em' }}>
                        Your current account details and role
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                    <div>
                      <strong>Role:</strong> {user.role === 'admin' ? 'Administrator' : 'Student'}
                    </div>
                    <div>
                      <strong>Member Since:</strong> {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#dc3545' }}>🚪 Sign Out</h4>
                    <p style={{ margin: '0 0 15px 0', color: '#6c757d', fontSize: '0.9em' }}>
                      Sign out of your account on this device
                    </p>
                    <button
                      onClick={handleLogout}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9em',
                        fontWeight: '600'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>

                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ margin: '0 0 15px 0', color: '#6c757d' }}>📊 Account Statistics</h4>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Total Bookings:</span>
                        <span style={{ fontWeight: '600' }}>0</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Active Bookings:</span>
                        <span style={{ fontWeight: '600' }}>0</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Profile Completion:</span>
                        <span style={{ fontWeight: '600', color: '#28a745' }}>85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          marginTop: '30px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#007bff', marginBottom: '20px' }}>Quick Actions</h3>
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/profile" className="btn" style={{ padding: '12px 20px' }}>
              👤 View Profile
            </Link>
            <Link to="/rooms" className="btn" style={{ padding: '12px 20px' }}>
              🏠 Browse Rooms
            </Link>
            <Link to="/bookings" className="btn" style={{ padding: '12px 20px' }}>
              📅 My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
