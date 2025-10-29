const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user bookings
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('room');
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;
  try {
    // Handle both string and ObjectId roomId
    let room;
    if (typeof roomId === 'string' && roomId.match(/^[0-9a-fA-F]{24}$/)) {
      room = await Room.findById(roomId);
    } else {
      // If it's a string like "1", "2", etc., find by roomNumber
      room = await Room.findOne({ roomNumber: roomId });
    }

    if (!room || !room.available) return res.status(400).json({ msg: 'Room not available' });

    const booking = new Booking({
      user: req.user.id,
      room: room._id,
      checkIn,
      checkOut,
    });
    await booking.save();

    // Update room availability
    room.available = false;
    await room.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.user.toString() !== req.user.id) return res.status(404).json({ msg: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    // Make the room available again
    const room = await Room.findById(booking.room);
    if (room) {
      room.available = true;
      await room.save();
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
