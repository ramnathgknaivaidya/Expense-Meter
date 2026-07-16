import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// Helper: Format transaction for API response (matches spec)
const formatTransaction = (tx) => ({
  id: tx._id,
  type: tx.type.toLowerCase(), // "income" or "expense"
  amount: tx.amount,
  category: tx.category,
  paymentMethod: tx.paymentMethod,
  merchantOrSource: tx.merchantOrSource,
  description: tx.description,
  date: tx.date,
});

// @desc    Get all transactions (with filters)
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    // 1. Build the base filter (ensure user isolation)
    const filter = { userId: req.user._id };

    // 2. Apply filters from query parameters
    // --- Date Range ---
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      filter.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      filter.date = { $lte: new Date(req.query.endDate) };
    }

    // --- Type (income/expense) ---
    if (req.query.type) {
      const typeMap = {
        income: 'Income',
        expense: 'Expense',
      };
      const mapped = typeMap[req.query.type.toLowerCase()];
      if (mapped) filter.type = mapped;
    }

    // --- Category ---
    if (req.query.category) {
      filter.category = { $regex: new RegExp(req.query.category, 'i') }; // Case-insensitive partial match
    }

    // --- Payment Method ---
    if (req.query.paymentMethod) {
      filter.paymentMethod = { $regex: new RegExp(req.query.paymentMethod, 'i') };
    }

    // --- Amount Range ---
    if (req.query.minAmount || req.query.maxAmount) {
      filter.amount = {};
      if (req.query.minAmount) filter.amount.$gte = parseFloat(req.query.minAmount);
      if (req.query.maxAmount) filter.amount.$lte = parseFloat(req.query.maxAmount);
    }

    // 3. Pagination (optional, but good practice)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // 4. Execute query
    const transactions = await Transaction.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    // 5. Format and return
    const formatted = transactions.map(formatTransaction);

    res.json({
      results: formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get Transactions Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    res.json(formatTransaction(transaction));
  } catch (error) {
    console.error('Get Transaction By ID Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};