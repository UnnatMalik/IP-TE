const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Category', categorySchema);
