const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

// @route   GET /api/groups
// @desc    Get all groups for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id
    }).populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/groups/:id
// @desc    Get single group
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is member
    const isMember = group.members.some(
      member => member.user._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this group' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/groups
// @desc    Create a group
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    // Add creator as first member
    const groupMembers = [{
      user: req.user._id,
      addedBy: req.user._id
    }];

    // Add other members if provided
    if (members && members.length > 0) {
      members.forEach(memberId => {
        if (memberId !== req.user._id.toString()) {
          groupMembers.push({
            user: memberId,
            addedBy: req.user._id
          });
        }
      });
    }

    const group = await Group.create({
      name,
      description,
      members: groupMembers,
      createdBy: req.user._id
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/groups/:id/members
// @desc    Add member to group
// @access  Private
router.put('/:id/members', protect, async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is already a member
    const isMember = group.members.some(
      member => member.user.toString() === userId
    );

    if (isMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push({
      user: userId,
      addedBy: req.user._id
    });

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/groups/:id
// @desc    Delete a group
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Only creator can delete
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this group' });
    }

    await group.deleteOne();
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
