import Income from '../models/Income.js';
import { syncIncomeToTransaction, deleteTransactionByReference } from '../utils/transactionHelper.js';

// Helper function to format the response object
const formatIncome = (income) => ({
  id: income._id,
  amount: income.amount,
  source: income.source,
  paymentMethod: income.paymentMethod,
  date: income.date,
  description: income.description || '',
});

// @desc    Add Income
// @route   POST /api/income
// @access  Private
export const addIncome = async (req, res) => {
  try {
    const { amount, source, paymentMethod, date, description } = req.body;

    // Validate required fields
    if (!amount || !source || !paymentMethod) {
      return res.status(400).json({
        error: 'Please provide amount, source, and paymentMethod',
      });
    }

    // Create the income record (userId comes from the authenticated user)
    const income = new Income({
      userId: req.user._id,           // Use _id consistently
      amount,
      source,
      paymentMethod,
      date: date || Date.now(),
      description: description || '',
    });

    console.log('✅ Income saved, syncing to transaction...');
    await income.save();


    // 🔥 SYNC TO TRANSACTION (Create a corresponding transaction)
    await syncIncomeToTransaction(income);
        console.log('✅ Transaction synced successfully');

    res.status(201).json(formatIncome(income));
  } catch (error) {
    console.error('Add Income Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Get all income records for the logged-in user
// @route   GET /api/income
// @access  Private
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user._id })
      .sort({ date: -1 });

    const formattedIncomes = incomes.map(formatIncome);
    res.json(formattedIncomes);
  } catch (error) {
    console.error('Get Incomes Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Get single income record
// @route   GET /api/income/:id
// @access  Private
export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        error: 'Income record not found or unauthorized',
      });
    }

    res.json(formatIncome(income));
  } catch (error) {
    console.error('Get Income By ID Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Update income record
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res) => {
  try {
    const { amount, source, paymentMethod, date, description } = req.body;

    const income = await Income.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        error: 'Income record not found or unauthorized',
      });
    }

    // Update only the fields that are provided
    if (amount !== undefined) income.amount = amount;
    if (source !== undefined) income.source = source;
    if (paymentMethod !== undefined) income.paymentMethod = paymentMethod;
    if (date !== undefined) income.date = date;
    if (description !== undefined) income.description = description;

    await income.save();

    // 🔥 UPDATE TRANSACTION (Sync the changes to the transaction ledger)
    await syncIncomeToTransaction(income);

    res.json(formatIncome(income));
  } catch (error) {
    console.error('Update Income Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Delete income record
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        error: 'Income record not found or unauthorized',
      });
    }

    // 🔥 DELETE TRANSACTION (Remove the corresponding transaction)
    await deleteTransactionByReference(req.user._id, req.params.id);

    res.json({
      message: 'Income record deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete Income Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};