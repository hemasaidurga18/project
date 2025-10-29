const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }, // student or admin
  studentId: { type: String },
  course: { type: String },
  year: { type: String },
  profileImage: { type: String },
  bio: { type: String },
  leetcode: { type: String },
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
});

module.exports = mongoose.model('User', userSchema);
