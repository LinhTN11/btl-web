const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'transport', 'entertainment', 'shopping', 'bills', 'salary', 'bonus', 'investment', 'other']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  note: String,
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);