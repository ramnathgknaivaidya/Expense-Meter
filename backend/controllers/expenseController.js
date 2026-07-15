const Expense = require('../models/Expense');
const Transaction = require('../models/Transaction');

const addExpense = async (req, res) => {
  try {
    const { amount, category, paymentMethod, merchant, date, description, receipt } = req.body;
    const expense = await Expense.create({
      userId: req.user._id, amount, category, paymentMethod, merchant, date, description, receipt,
    });
    await Transaction.create({
      userId: req.user._id, type: 'expense', referenceId: expense._id,
      amount, category, paymentMethod, description: merchant || description, date,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { category, from, to, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Expense.countDocuments(filter),
    ]);
    res.json({ success: true, data: { expenses, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense record not found' });
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { amount, category, paymentMethod, merchant, date, description, receipt } = req.body;
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { amount, category, paymentMethod, merchant, date, description, receipt },
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ success: false, message: 'Expense record not found' });
    await Transaction.findOneAndUpdate(
      { referenceId: expense._id, type: 'expense' },
      { amount, category, paymentMethod, description: merchant || description, date }
    );
    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense record not found' });
    await Transaction.deleteOne({ referenceId: expense._id, type: 'expense' });
    res.json({ success: true, data: { message: 'Expense record deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addExpense, getExpenses, getExpense, updateExpense, deleteExpense };
