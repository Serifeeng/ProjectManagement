const express = require('express');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Get all users (Admin)
router.get('/', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new user (Admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    let userByEmail = await User.findOne({ email });
    if (userByEmail) return res.status(400).json({ message: 'User with this email already exists' });

    let userByUsername = await User.findOne({ username });
    if (userByUsername) return res.status(400).json({ message: 'Username is already taken' });

    user = new User({ username, name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ _id: user._id, username: user.username, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (Admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username && username !== user.username) {
      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ message: 'Username is already taken' });
      user.username = username;
    }
    if (name)  user.name  = name;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email is already taken' });
      user.email = email;
    }
    if (role)  user.role  = role;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    await user.save();
    res.json({ _id: user._id, username: user.username, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Remove user assignments
    await Project.updateMany({ assignedUsers: req.params.id }, { $pull: { assignedUsers: req.params.id } });
    await Task.updateMany({ assignedTo: req.params.id }, { $unset: { assignedTo: 1 } });
    
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
