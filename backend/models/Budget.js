const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'salary', 'bonus', 'investment', 'other']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);