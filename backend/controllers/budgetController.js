const Budget = require('../models/Budget');

exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find().sort('order');
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};