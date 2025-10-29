import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', type: '', price: '', description: '' });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/rooms');
        setRooms(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRooms();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5001/api/rooms', newRoom, {
        headers: { Authorization: token }
      });
      setRooms([...rooms, res.data]);
      setNewRoom({ roomNumber: '', type: '', price: '', description: '' });
      alert('Room added');
    } catch (err) {
      alert('Failed to add room');
    }
  };

  const handleToggleAvailability = async (id, available) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5001/api/rooms/${id}`, { available: !available }, {
        headers: { Authorization: token }
      });
      setRooms(rooms.map(r => r._id === id ? { ...r, available: !available } : r));
    } catch (err) {
      alert('Failed to update room');
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <h3>Add New Room</h3>
      <form onSubmit={handleAddRoom}>
        <div className="form-group">
          <label>Room Number</label>
          <input type="text" value={newRoom.roomNumber} onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <input type="text" value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input type="text" value={newRoom.description} onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })} />
        </div>
        <button type="submit" className="btn">Add Room</button>
      </form>
      <h3>Manage Rooms</h3>
      <ul>
        {rooms.map(room => (
          <li key={room._id} style={{ marginBottom: '10px' }}>
            Room {room.roomNumber} - {room.available ? 'Available' : 'Not Available'}
            <button className="btn" onClick={() => handleToggleAvailability(room._id, room.available)}>
              {room.available ? 'Mark Unavailable' : 'Mark Available'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
