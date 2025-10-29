const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add room (admin only)
router.post('/', auth, async (req, res) => {
  const { roomNumber, type, price, description } = req.body;
  try {
    const room = new Room({ roomNumber, type, price, description });
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update room availability
router.put('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ msg: 'Room not found' });

    room.available = req.body.available;
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
