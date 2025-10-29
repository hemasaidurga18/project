import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Congratulations from './Congratulations';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    // Set detailed sample apartments with Indian currency and AC/Non-AC separation
    setRooms([
      {
        _id: '1',
        roomNumber: '101',
        type: 'Single AC',
        price: 1200,
        available: true,
        description: 'Premium single AC room with attached bathroom, study table, and 24/7 power backup.'
      },
      {
        _id: '2',
        roomNumber: '102',
        type: 'Single Non-AC',
        price: 800,
        available: true,
        description: 'Comfortable single non-AC room with fan, study area, and shared bathroom facilities.'
      },
      {
        _id: '3',
        roomNumber: '103',
        type: 'Double AC',
        price: 1800,
        available: true,
        description: 'Spacious double AC room perfect for friends, with two study tables and attached bathrooms.'
      },
      {
        _id: '4',
        roomNumber: '104',
        type: 'Double Non-AC',
        price: 1200,
        available: true,
        description: 'Budget-friendly double non-AC room with fans, study areas, and shared facilities.'
      },
      {
        _id: '5',
        roomNumber: '105',
        type: 'Single AC',
        price: 1400,
        available: false,
        description: 'Executive single AC room with premium amenities, refrigerator, and laundry service.'
      },
      {
        _id: '6',
        roomNumber: '106',
        type: 'Double AC',
        price: 2000,
        available: true,
        description: 'Luxury double AC room with balcony, microwave, and housekeeping services.'
      }
    ]);

    // Optional: Try to fetch from API in background
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data);
        }
      } catch (err) {
        console.log('API Error (using sample data):', err);
      }
    };
    fetchRooms();
  }, []);

  const handleBook = async (roomId) => {
    const checkIn = prompt('Enter check-in date (YYYY-MM-DD)');
    const checkOut = prompt('Enter check-out date (YYYY-MM-DD)');
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first');

    if (!checkIn || !checkOut) return alert('Please enter valid dates');

    const room = rooms.find(r => r._id === roomId);
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    // Create booking object
    const newBooking = {
      _id: Date.now().toString(),
      userEmail: currentUserEmail,
      room: room,
      checkIn,
      checkOut,
      status: 'confirmed'
    };

    try {
      await axios.post('http://localhost:5001/api/bookings', { roomId, checkIn, checkOut }, {
        headers: { Authorization: token }
      });

      // Update room availability in state and localStorage
      const updatedRooms = rooms.map(r => r._id === roomId ? { ...r, available: false } : r);
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));

      // Store booking in localStorage as fallback
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localBookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(localBookings));

      // Show congratulations modal
      setLatestBooking(newBooking);
      setShowCongratulations(true);

    } catch (err) {
      console.error('Booking error:', err);
      // Always store in localStorage even if API fails
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      localBookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(localBookings));

      // Update room availability in state and localStorage even if API fails
      const updatedRooms = rooms.map(r => r._id === roomId ? { ...r, available: false } : r);
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));

      // Show congratulations modal even if API fails
      setLatestBooking(newBooking);
      setShowCongratulations(true);
    }
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
    setLatestBooking(null);
    // Redirect to bookings page
    window.location.href = '/bookings';
  };

  console.log('Rooms state:', rooms); // Debug log

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>Available Rooms for Students</h2>
      {rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading rooms...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {rooms.map(room => (
            <div key={room._id} className="card">
              <img
                src={`https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                alt={`Room ${room.roomNumber}`}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#007bff' }}>{room.type} Room</h3>
                <p style={{ fontSize: '1.1em', color: '#6c757d', marginBottom: '10px' }}>Perfect for Students</p>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>₹{room.price}</p>
                <p style={{ marginBottom: '20px', color: '#495057' }}>{room.description}</p>

                {/* Student Priority Features */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ marginBottom: '10px', color: '#007bff', fontSize: '1em' }}>Student Amenities:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9em' }}>
                    <span style={{ color: '#6c757d' }}>📚 Dedicated Study Desk</span>
                    <span style={{ color: '#6c757d' }}>📶 High-Speed WiFi</span>
                    <span style={{ color: '#6c757d' }}>🛏️ Comfortable Study Bed</span>
                    <span style={{ color: '#6c757d' }}>📍 5min to Campus</span>
                    <span style={{ color: '#6c757d' }}>🍳 Shared Kitchen</span>
                    <span style={{ color: '#6c757d' }}>👥 Study Groups Area</span>
                    <span style={{ color: '#6c757d' }}>🧺 Laundry Service</span>
                    <span style={{ color: '#6c757d' }}>🔒 24/7 Security</span>
                  </div>
                </div>

                {/* Room Highlights */}
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <h4 style={{ marginBottom: '8px', color: '#007bff', fontSize: '0.9em' }}>Why Students Choose This Room:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9em', color: '#495057' }}>
                    <li>Quiet environment perfect for studying</li>
                    <li>Proximity to university library</li>
                    <li>Affordable long-term rates</li>
                    <li>Clean and well-maintained</li>
                  </ul>
                </div>

                {room.available ? (
                  <button className="btn" onClick={() => handleBook(room._id)} style={{ width: '100%' }}>Book This Room</button>
                ) : (
                  <button className="btn btn-secondary" disabled style={{ width: '100%' }}>Currently Occupied</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Congratulations Modal */}
      {showCongratulations && latestBooking && (
        <Congratulations booking={latestBooking} onClose={handleCloseCongratulations} />
      )}
    </div>
  );
};

export default Rooms;
