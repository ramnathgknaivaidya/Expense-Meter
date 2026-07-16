import Expense from "../models/Expense.js";
import {
  syncExpenseToTransaction,
  deleteTransactionByReference,
} from "../utils/transactionHelper.js";

// Helper function to format the response object
const formatExpense = (expense) => ({
  id: expense._id,
  amount: expense.amount,
  category: expense.category,
  paymentMethod: expense.paymentMethod,
  merchant: expense.merchant || "",
  date: expense.date,
  description: expense.description || "",
  receipt: expense.receipt || null,
});

// @desc    Add Expense
// @route   POST /api/expense
// @access  Private
export const addExpense = async (req, res) => {
  try {
    // Safety check: ensure user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    const {
      amount,
      category,
      paymentMethod,
      merchant,
      date,
      description,
      receipt,
    } = req.body;

    // Validate required fields
    if (!amount || !category || !paymentMethod) {
      return res.status(400).json({
        error: "Please provide amount, category, and paymentMethod",
      });
    }

    // Create the expense record
    const expense = new Expense({
      userId: req.user._id,
      amount,
      category,
      paymentMethod,
      merchant: merchant || "",
      date: date || Date.now(),
      description: description || "",
      receipt: receipt || null,
    });

    await expense.save();

    // 🔥 SYNC TO TRANSACTION (Create a corresponding transaction)
    await syncExpenseToTransaction(expense);

    // Return the newly created expense in the specified format
    res.status(201).json(formatExpense(expense));
  } catch (error) {
    console.error("Add Expense Error:", error.message);
    res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};

// @desc    Get all expense records for the logged-in user
// @route   GET /api/expense
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({
      date: -1,
    });

    const formattedExpenses = expenses.map(formatExpense);
    res.json(formattedExpenses);
  } catch (error) {
    console.error("Get Expenses Error:", error.message);
    res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};

// @desc    Get single expense record
// @route   GET /api/expense/:id
// @access  Private
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        error: "Expense record not found or unauthorized",
      });
    }

    res.json(formatExpense(expense));
  } catch (error) {
    console.error("Get Expense By ID Error:", error.message);
    res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};

// @desc    Update expense record
// @route   PUT /api/expense/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const {
      amount,
      category,
      paymentMethod,
      merchant,
      date,
      description,
      receipt,
    } = req.body;

    // Find the expense and ensure it belongs to the user
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        error: "Expense record not found or unauthorized",
      });
    }

    // Update only the fields that are provided
    if (amount !== undefined) expense.amount = amount;
    if (category !== undefined) expense.category = category;
    if (paymentMethod !== undefined) expense.paymentMethod = paymentMethod;
    if (merchant !== undefined) expense.merchant = merchant;
    if (date !== undefined) expense.date = date;
    if (description !== undefined) expense.description = description;
    if (receipt !== undefined) expense.receipt = receipt;

    await expense.save();

    // 🔥 UPDATE TRANSACTION (Sync the changes to the transaction ledger)
    await syncExpenseToTransaction(expense);

    res.json(formatExpense(expense));
  } catch (error) {
    console.error("Update Expense Error:", error.message);
    res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};

// @desc    Get expense summary by category (current month by default)
// @route   GET /api/expense/summary
// @access  Private

export const getExpenseSummary = async (req, res) => {
  try {
    // Default to current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Optional: override with query params ?month=7&year=2026
    let startDate = startOfMonth;
    let endDate = endOfMonth;
    if (req.query.month && req.query.year) {
      const month = parseInt(req.query.month) - 1; // JS months are 0-indexed
      const year = parseInt(req.query.year);
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 1);
    }

    const summary = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 }, // Highest spending first
      },
    ]);

    res.json(summary);
  } catch (error) {
    console.error("Expense Summary Error:", error.message);
    res.status(500).json({ error: "Server error, please try again later" });
  }
};

// @desc    Delete expense record
// @route   DELETE /api/expense/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    // Find and delete the expense
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        error: "Expense record not found or unauthorized",
      });
    }

    // 🔥 DELETE TRANSACTION (Remove the corresponding transaction)
    await deleteTransactionByReference(req.user._id, req.params.id);

    res.json({
      message: "Expense record deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete Expense Error:", error.message);
    res.status(500).json({
      error: "Server error, please try again later",
    });
  }
};
