const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

const createBudget = async (req, res) => {
  try {
    const { category, limitAmount, month, year } = req.body;
    const existing = await Budget.findOne({ userId: req.user._id, category, month, year });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Budget already exists for this category and month' });
    }
    const budget = await Budget.create({ userId: req.user._id, category, limitAmount, month, year });
    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const filter = { userId: req.user._id };
    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);
    const budgets = await Budget.find(filter).sort({ category: 1 });
    res.json({ success: true, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBudgetStatus = async (req, res) => {
  try {
    const now = new Date();
    const month = req.query.month ? parseInt(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();
    const budgets = await Budget.find({ userId: req.user._id, month, year });
    const statuses = await Promise.all(budgets.map(async (budget) => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      const expenseResult = await Expense.aggregate([
        { $match: { userId: req.user._id, category: budget.category, date: { $gte: startDate, $lt: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const spent = expenseResult[0]?.total || 0;
      const percentage = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
      return {
        id: budget._id, category: budget.category, limit: budget.limitAmount,
        spent, remaining: budget.limitAmount - spent,
        percentage: Math.round(percentage * 100) / 100,
      };
    }));
    res.json({ success: true, data: statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const { limitAmount, spentAmount } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...(limitAmount !== undefined && { limitAmount }), ...(spentAmount !== undefined && { spentAmount }) },
      { new: true, runValidators: true }
    );
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    res.json({ success: true, data: { message: 'Budget deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBudget, getBudgets, getBudgetStatus, updateBudget, deleteBudget };
