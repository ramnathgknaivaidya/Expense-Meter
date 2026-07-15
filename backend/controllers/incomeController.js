const Income = require('../models/Income');
const Transaction = require('../models/Transaction');

const addIncome = async (req, res) => {
  try {
    const { amount, source, paymentMethod, date, description } = req.body;
    const income = await Income.create({ userId: req.user._id, amount, source, paymentMethod, date, description });
    await Transaction.create({
      userId: req.user._id, type: 'income', referenceId: income._id,
      amount, category: source, paymentMethod, description, date,
    });
    res.status(201).json({ success: true, data: income });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIncomes = async (req, res) => {
  try {
    const { source, from, to, page = 1, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    if (source) filter.source = source;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [incomes, total] = await Promise.all([
      Income.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Income.countDocuments(filter),
    ]);
    res.json({ success: true, data: { incomes, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: 'Income record not found' });
    res.json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const { amount, source, paymentMethod, date, description } = req.body;
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { amount, source, paymentMethod, date, description },
      { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ success: false, message: 'Income record not found' });
    await Transaction.findOneAndUpdate(
      { referenceId: income._id, type: 'income' },
      { amount, category: source, paymentMethod, description, date }
    );
    res.json({ success: true, data: income });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: 'Income record not found' });
    await Transaction.deleteOne({ referenceId: income._id, type: 'income' });
    res.json({ success: true, data: { message: 'Income record deleted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addIncome, getIncomes, getIncome, updateIncome, deleteIncome };
