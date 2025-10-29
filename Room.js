const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // single, double, etc.
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  description: { type: String },
});

module.exports = mongoose.model('Room', roomSchema);
