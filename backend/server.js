const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/expenses', require('./routes/expenses'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API' });
});

// Seed default categories
const seedCategories = async () => {
  const Category = require('./models/Category');
  
  const defaultCategories = [
    { name: 'Food & Dining', icon: '🍔', color: '#ef4444', isDefault: true },
    { name: 'Transportation', icon: '🚗', color: '#f59e0b', isDefault: true },
    { name: 'Shopping', icon: '🛍️', color: '#ec4899', isDefault: true },
    { name: 'Entertainment', icon: '🎬', color: '#8b5cf6', isDefault: true },
    { name: 'Bills & Utilities', icon: '💡', color: '#06b6d4', isDefault: true },
    { name: 'Healthcare', icon: '🏥', color: '#10b981', isDefault: true },
    { name: 'Travel', icon: '✈️', color: '#3b82f6', isDefault: true },
    { name: 'Education', icon: '📚', color: '#6366f1', isDefault: true },
    { name: 'Other', icon: '📁', color: '#64748b', isDefault: true }
  ];

  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

seedCategories();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
