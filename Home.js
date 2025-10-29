import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Congratulations from './Congratulations';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [searchParams, setSearchParams] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    // Load rooms from localStorage if available, otherwise use sample data
    const savedRooms = JSON.parse(localStorage.getItem('rooms') || '[]');
    const sampleRooms = [
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
    ];

    if (savedRooms.length > 0) {
      setRooms(savedRooms);
    } else {
      setRooms(sampleRooms);
      localStorage.setItem('rooms', JSON.stringify(sampleRooms));
    }

    // Optional: Try to fetch from API in background
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/rooms');
        if (res.data && res.data.length > 0) {
          setRooms(res.data.slice(0, 6));
          localStorage.setItem('rooms', JSON.stringify(res.data.slice(0, 6)));
        }
      } catch (err) {
        console.log('API Error (using sample data):', err);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Show all available rooms (no filtering by guest count)
    const filteredRooms = rooms.filter(room => room.available);

    // Set filtered rooms and show them
    setFilteredRooms(filteredRooms);
    setShowRooms(true);

    // Scroll to results
    setTimeout(() => {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBook = (roomId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book a room');
      return;
    }

    // Use search parameters for dates if available, otherwise prompt
    let checkIn = searchParams.checkIn;
    let checkOut = searchParams.checkOut;

    if (!checkIn || !checkOut) {
      checkIn = prompt('Enter check-in date (YYYY-MM-DD)');
      checkOut = prompt('Enter check-out date (YYYY-MM-DD)');
    }

    if (checkIn && checkOut) {
      const room = rooms.find(r => r._id === roomId);
      const booking = {
        _id: Date.now().toString(),
        userEmail: localStorage.getItem('currentUserEmail'),
        room: room,
        checkIn,
        checkOut,
        status: 'confirmed'
      };

      // Try API first
      axios.post('http://localhost:5001/api/bookings', { roomId, checkIn, checkOut }, {
        headers: { Authorization: token }
      })
      .then((res) => {
        // API success - use response data if available
        const apiBooking = res.data || booking;
        setLatestBooking(apiBooking);
        setShowCongratulations(true);
      })
      .catch((err) => {
        console.error('API Booking error:', err);
        // API failed - still proceed with localStorage booking
        setLatestBooking(booking);
        setShowCongratulations(true);
      });

      // Always store in localStorage (works even if API fails)
      const currentUserEmail = localStorage.getItem('currentUserEmail');
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const newBooking = {
        _id: booking._id,
        userEmail: currentUserEmail,
        room: room,
        checkIn,
        checkOut,
        status: 'confirmed'
      };
      localBookings.push(newBooking);
      localStorage.setItem('bookings', JSON.stringify(localBookings));

      // Update room availability in local state and localStorage
      const updatedRooms = rooms.map(r => r._id === roomId ? { ...r, available: false } : r);
      setRooms(updatedRooms);
      setFilteredRooms(filteredRooms.map(r => r._id === roomId ? { ...r, available: false } : r));
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }
  };

  const handleCloseCongratulations = () => {
    setShowCongratulations(false);
    setLatestBooking(null);
    // Redirect to bookings page after closing congratulations
    setTimeout(() => {
      window.location.href = '/bookings';
    }, 500);
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '100px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.5em', marginBottom: '20px', fontWeight: 'bold' }}>Your Home Away From Home</h1>
          <p style={{ fontSize: '1.3em', marginBottom: '40px', opacity: 0.9 }}>Comfortable hostel accommodation for college students throughout your studies</p>
          <Link to="/rooms" className="btn" style={{ fontSize: '1.2em', padding: '15px 40px', backgroundColor: 'white', color: '#667eea' }}>Find Your Room</Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container">
        <div className="search-bar">
          <h2>Search for Rooms</h2>
          <form onSubmit={handleSearch}>
            <div className="form-row">
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={searchParams.checkIn}
                  onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={searchParams.checkOut}
                  onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Members</label>
                <select
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                >
                  <option value={1}>1 Member</option>
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <button type="submit" className="btn" style={{ height: '42px' }}>Search</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      {showRooms && (
        <div className="container" id="search-results">
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>
            Search Results ({filteredRooms.length} rooms found)
          </h2>
          {filteredRooms.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
              {filteredRooms.map(room => (
                <div key={room._id} className="card">
                  <img
                    src={`https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80`}
                    alt={`Room ${room.roomNumber}`}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ marginTop: 0, color: '#007bff' }}>{room.type} Room</h3>
                    <p style={{ fontSize: '1.1em', color: '#6c757d', marginBottom: '10px' }}>Student Friendly</p>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#28a745', marginBottom: '15px' }}>₹{room.price}</p>
                    <p style={{ marginBottom: '20px', color: '#495057' }}>{room.description}</p>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '0.9em', color: '#6c757d' }}>📚 Study Area</span>
                      <span style={{ fontSize: '0.9em', color: '#6c757d' }}>🛏️ Comfortable Bed</span>
                      <span style={{ fontSize: '0.9em', color: '#6c757d' }}>📶 WiFi</span>
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
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>No rooms found matching your criteria. Try different dates or guest count.</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div>
            <h3>Hostel Booking</h3>
            <p>Your trusted partner for hostel accommodations</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/bookings">My Bookings</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <p>Email: info@hostelbooking.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </footer>

      {/* Congratulations Modal */}
      {showCongratulations && latestBooking && (
        <Congratulations
          booking={latestBooking}
          onClose={handleCloseCongratulations}
        />
      )}
    </div>
  );
};

export default Home;
