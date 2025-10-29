import React, { useEffect, useState } from 'react';

const Congratulations = ({ booking, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === localStorage.getItem('currentUserEmail'));
    setCurrentUser(user);

    // Start animation after component mounts
    setTimeout(() => setShowAnimation(true), 100);

    // Auto-close after 8 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!booking || !currentUser) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: showAnimation ? 'fadeIn 0.3s ease-out' : 'none'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        animation: showAnimation ? 'bounceIn 0.6s ease-out' : 'none',
        position: 'relative',
        border: '2px solid #007bff'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 3s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50px',
          right: '-30px',
          width: '60px',
          height: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite reverse'
        }}></div>

        {/* Profile Image */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'white',
          border: '4px solid #007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '3em',
          color: '#007bff',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          animation: showAnimation ? 'bounceIn 1s ease-out' : 'none',
          overflow: 'hidden'
        }}>
          {currentUser.profileImage ? (
            <img
              src={currentUser.profileImage}
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
        </div>

        {/* Celebration Emojis */}
        <div style={{
          fontSize: '2.5em',
          marginBottom: '15px',
          animation: showAnimation ? 'emojiBounce 2s ease-in-out infinite' : 'none'
        }}>
          🎉 ✨ 🌸 🌺 🌻 🎊
        </div>

        {/* Main Message */}
        <h1 style={{
          color: '#007bff',
          fontSize: '2em',
          marginBottom: '10px',
          animation: showAnimation ? 'textGlow 2s ease-in-out' : 'none'
        }}>
          Congratulations!
        </h1>

        <h2 style={{
          color: '#333',
          fontSize: '1.4em',
          marginBottom: '20px'
        }}>
          {currentUser.name}
        </h2>

        {/* Booking Details */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          border: '1px solid #dee2e6',
          maxWidth: '300px',
          margin: '0 auto 20px'
        }}>
          <h3 style={{
            color: '#007bff',
            marginBottom: '12px',
            fontSize: '1.2em',
            textAlign: 'center'
          }}>
            Your Booking is Confirmed! 🏠
          </h3>

          <div style={{
            display: 'grid',
            gap: '8px',
            color: '#495057',
            fontSize: '0.9em'
          }}>
            <div>🏨 <strong>Room:</strong> {booking.room.type} - {booking.room.roomNumber}</div>
            <div>📅 <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</div>
            <div>📅 <strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</div>
            <div>💰 <strong>Price:</strong> ₹{booking.room.price}</div>
          </div>
        </div>

        {/* Thank You Message */}
        <div style={{
          color: '#6c757d',
          fontSize: '1em',
          lineHeight: '1.5',
          marginBottom: '25px'
        }}>
          <p>Thank you for choosing our hostel! 🌸</p>
          <p>We hope you have an amazing stay! 📚✨</p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onClose}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            View My Bookings 📋
          </button>

          <button
            onClick={() => window.location.href = '/profile'}
            style={{
              background: 'transparent',
              color: '#007bff',
              border: '2px solid #007bff',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '1em',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#007bff';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#007bff';
            }}
          >
            Update Profile 👤
          </button>
        </div>

        {/* Auto-close message */}
        <p style={{
          color: '#6c757d',
          fontSize: '0.8em',
          marginTop: '15px'
        }}>
          This message will close automatically in a few seconds...
        </p>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes emojiBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes textGlow {
          0% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
          50% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.5); }
          100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Congratulations;
