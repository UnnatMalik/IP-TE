const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Search users by email or name
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ],
        _id: { $ne: req.user._id } // Exclude current user
      };
    } else {
      query = { _id: { $ne: req.user._id } };
    }

    const users = await User.find(query)
      .select('name email avatar')
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
