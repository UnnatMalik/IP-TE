const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @route   GET /api/expenses
// @desc    Get all expenses for user (with filters)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, startDate, endDate, group } = req.query;
    
    // Build query
    let query = {
      $or: [
        { paidBy: req.user._id },
        { 'splits.user': req.user._id }
      ]
    };

    // Apply filters
    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (group) {
      query.group = group;
    }

    const expenses = await Expense.find(query)
      .populate('category', 'name icon color')
      .populate('paidBy', 'name email avatar')
      .populate('splits.user', 'name email avatar')
      .populate('group', 'name')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/expenses/stats
// @desc    Get expense statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchQuery = {
      $or: [
        { paidBy: req.user._id },
        { 'splits.user': req.user._id }
      ]
    };

    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) {
        matchQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        matchQuery.date.$lte = new Date(endDate);
      }
    }

    // Category-wise spending
    const categoryStats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          total: 1,
          count: 1,
          name: '$category.name',
          icon: '$category.icon',
          color: '$category.color'
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Total spending
    const totalSpent = categoryStats.reduce((sum, cat) => sum + cat.total, 0);

    // Balance calculations (what user owes and is owed)
    const expenses = await Expense.find(matchQuery);
    
    let youOwe = 0;
    let youAreOwed = 0;

    expenses.forEach(expense => {
      const userSplit = expense.splits.find(
        split => split.user.toString() === req.user._id.toString()
      );

      if (expense.paidBy.toString() === req.user._id.toString()) {
        // User paid, calculate what others owe
        expense.splits.forEach(split => {
          if (split.user.toString() !== req.user._id.toString() && !split.paid) {
            youAreOwed += split.amount;
          }
        });
      } else if (userSplit && !userSplit.paid) {
        // User owes money
        youOwe += userSplit.amount;
      }
    });

    res.json({
      categoryStats,
      totalSpent,
      youOwe,
      youAreOwed,
      balance: youAreOwed - youOwe
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('category', 'name icon color')
      .populate('paidBy', 'name email avatar')
      .populate('splits.user', 'name email avatar')
      .populate('group', 'name');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/expenses
// @desc    Create an expense
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { description, amount, category, group, splitType, splits, date, notes } = req.body;

    // Calculate splits based on type
    let expenseSplits = [];

    if (splitType === 'personal') {
      // Personal expense - only user pays
      expenseSplits = [{
        user: req.user._id,
        amount: amount,
        paid: true
      }];
    } else if (splitType === 'equal' && splits && splits.length > 0) {
      // Equal split among all members
      const splitAmount = amount / splits.length;
      expenseSplits = splits.map(userId => ({
        user: userId,
        amount: splitAmount,
        paid: userId === req.user._id.toString()
      }));
    } else if (splitType === 'exact' && splits) {
      // Exact amounts specified
      expenseSplits = splits.map(split => ({
        user: split.user,
        amount: split.amount,
        paid: split.user === req.user._id.toString()
      }));
    } else if (splitType === 'percentage' && splits) {
      // Percentage-based split
      expenseSplits = splits.map(split => ({
        user: split.user,
        amount: (amount * split.percentage) / 100,
        paid: split.user === req.user._id.toString()
      }));
    }

    const expense = await Expense.create({
      description,
      amount,
      category,
      paidBy: req.user._id,
      group: group || null,
      splitType,
      splits: expenseSplits,
      date: date || Date.now(),
      notes
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('category', 'name icon color')
      .populate('paidBy', 'name email avatar')
      .populate('splits.user', 'name email avatar')
      .populate('group', 'name');

    res.status(201).json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Only creator can update
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this expense' });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate('category', 'name icon color')
      .populate('paidBy', 'name email avatar')
      .populate('splits.user', 'name email avatar')
      .populate('group', 'name');

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/expenses/:id/settle
// @desc    Settle a split payment
// @access  Private
router.put('/:id/settle', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find user's split
    const userSplit = expense.splits.find(
      split => split.user.toString() === req.user._id.toString()
    );

    if (!userSplit) {
      return res.status(404).json({ message: 'Split not found for user' });
    }

    userSplit.paid = true;
    await expense.save();

    const populatedExpense = await Expense.findById(expense._id)
      .populate('category', 'name icon color')
      .populate('paidBy', 'name email avatar')
      .populate('splits.user', 'name email avatar')
      .populate('group', 'name');

    res.json(populatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Only creator can delete
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
