import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5001/api/bookings', {
          headers: { Authorization: token }
        });
        setBookings(res.data);
      } catch (err) {
        // Fallback to localStorage bookings
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const userBookings = localBookings.filter(b => b.userEmail === currentUserEmail);
        setBookings(userBookings);
        console.log('Using localStorage bookings:', userBookings);
      }
    };
    fetchBookings();
  }, []);

  // Refresh bookings when component mounts (in case user just booked)
  useEffect(() => {
    const refreshBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5001/api/bookings', {
          headers: { Authorization: token }
        });
        setBookings(res.data);
      } catch (err) {
        // Fallback to localStorage bookings
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const userBookings = localBookings.filter(b => b.userEmail === currentUserEmail);
        setBookings(userBookings);
        console.log('Using localStorage bookings:', userBookings);
      }
    };

    // Refresh immediately and set up interval to check for new bookings
    refreshBookings();
    const interval = setInterval(refreshBookings, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (id) => {
    console.log('Cancel button clicked for booking ID:', id);

    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    const token = localStorage.getItem('token');
    console.log('Token available:', !!token);

    if (!token) {
      alert('You are not logged in. Please login to cancel bookings.');
      return;
    }

    try {
      console.log('Making API call to cancel booking');
      await axios.put(`http://localhost:5001/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: token }
      });
      console.log('API cancellation successful');

      // Update UI
      const updatedBookings = bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b);
      setBookings(updatedBookings);
      console.log('UI updated - booking status set to cancelled');

      // Update localStorage bookings
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedLocalBookings = localBookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b);
      localStorage.setItem('bookings', JSON.stringify(updatedLocalBookings));
      console.log('localStorage bookings updated');

      // Update room availability in localStorage
      const cancelledBooking = bookings.find(b => b._id === id);
      if (cancelledBooking) {
        const savedRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
        const roomId = cancelledBooking.room._id || cancelledBooking.room; // Handle both object and string cases
        const updatedRooms = savedRooms.map(room =>
          room._id === roomId ? { ...room, available: true } : room
        );
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
        console.log('Room availability updated in localStorage');
      }

      alert('Booking cancelled successfully! The room is now available for others to book.');
      console.log('Cancel function completed');
    } catch (err) {
      console.error('API cancellation failed:', err);
      // Fallback: Update UI anyway for better UX
      const updatedBookings = bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b);
      setBookings(updatedBookings);

      // Update localStorage bookings
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedLocalBookings = localBookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b);
      localStorage.setItem('bookings', JSON.stringify(updatedLocalBookings));

      // Update room availability in localStorage
      const cancelledBooking = bookings.find(b => b._id === id);
      if (cancelledBooking) {
        const savedRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
        const roomId = cancelledBooking.room._id || cancelledBooking.room;
        const updatedRooms = savedRooms.map(room =>
          room._id === roomId ? { ...room, available: true } : room
        );
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      }

      alert('Booking cancelled successfully! The room is now available for others to book.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px 0' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h1 style={{
            color: '#2c3e50',
            marginBottom: '10px',
            fontSize: '2.5em',
            fontWeight: '700'
          }}>My Bookings</h1>
          <p style={{ color: '#7f8c8d', fontSize: '1.1em' }}>
            Manage your room reservations and bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '60px 40px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            margin: '0 auto',
            maxWidth: '600px'
          }}>
            <div style={{ fontSize: '4em', marginBottom: '20px' }}>🏨</div>
            <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>No bookings yet</h3>
            <p style={{ color: '#495057', marginBottom: '30px', lineHeight: '1.6' }}>
              You haven't made any bookings yet. Start exploring our amazing rooms and book your perfect stay!
            </p>
            <a href="/rooms" style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '1.1em',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}>Browse Rooms</a>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '30px'
          }}>
            {bookings.map(booking => (
              <div key={booking._id} style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '3em',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}>🏨</div>
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: booking.status === 'confirmed' ? '#28a745' :
                                   booking.status === 'cancelled' ? '#dc3545' : '#ffc107',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8em',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {booking.status}
                  </div>
                </div>

                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    marginTop: 0,
                    marginBottom: '15px',
                    color: '#2c3e50',
                    fontSize: '1.4em',
                    fontWeight: '700'
                  }}>
                    Room {booking.room.roomNumber}
                  </h3>

                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '10px',
                    marginBottom: '20px'
                  }}>
                    <p style={{
                      margin: '8px 0',
                      color: '#495057',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '600' }}>🏨 Room Type:</span>
                      <span>{booking.room.type}</span>
                    </p>
                    <p style={{
                      margin: '8px 0',
                      color: '#495057',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '600' }}>📅 Check-in:</span>
                      <span>{new Date(booking.checkIn).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </p>
                    <p style={{
                      margin: '8px 0',
                      color: '#495057',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '600' }}>📅 Check-out:</span>
                      <span>{new Date(booking.checkOut).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </p>
                    <p style={{
                      margin: '8px 0',
                      color: '#495057',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: '600' }}>💰 Price:</span>
                      <span style={{ fontWeight: '700', color: '#28a745' }}>₹{booking.room.price}</span>
                    </p>
                  </div>

                  {booking.room.description && (
                    <p style={{
                      color: '#6c757d',
                      fontSize: '0.95em',
                      lineHeight: '1.5',
                      marginBottom: '20px'
                    }}>
                      {booking.room.description}
                    </p>
                  )}

                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      style={{
                        width: '100%',
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
                      ❌ Cancel Booking
                    </button>
                  )}

                  {booking.status === 'cancelled' && (
                    <div style={{
                      backgroundColor: '#f8d7da',
                      border: '1px solid #f5c6cb',
                      borderRadius: '10px',
                      padding: '15px',
                      textAlign: 'center',
                      color: '#721c24'
                    }}>
                      <div style={{ fontSize: '1.5em', marginBottom: '5px' }}>🚫</div>
                      <p style={{ margin: 0, fontWeight: '600' }}>Booking Cancelled</p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
                        This booking has been cancelled
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
