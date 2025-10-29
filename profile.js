const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update user profile
router.put('/', auth, async (req, res) => {
  const { name, email, studentId, course, year, bio, leetcode, github, linkedin, portfolio } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (studentId !== undefined) user.studentId = studentId;
    if (course !== undefined) user.course = course;
    if (year !== undefined) user.year = year;
    if (bio !== undefined) user.bio = bio;
    if (leetcode !== undefined) user.leetcode = leetcode;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      course: user.course,
      year: user.year,
      bio: user.bio,
      leetcode: user.leetcode,
      github: user.github,
      linkedin: user.linkedin,
      portfolio: user.portfolio,
      profileImage: user.profileImage
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
