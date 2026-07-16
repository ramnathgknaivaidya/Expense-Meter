import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import mongoose from 'mongoose';

// Helper: Get current month/year if not provided
const getMonthYear = (month, year) => {
  const now = new Date();
  return {
    month: month || now.getMonth() + 1, // JavaScript months are 0-indexed
    year: year || now.getFullYear(),
  };
};

// Helper: Calculate spent amount for a budget
const calculateSpentAmount = async (userId, category, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const result = await Expense.aggregate([
    {
      $match: {
        userId: userId,
        category: category,
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Helper: Format budget response
const formatBudget = (budget) => ({
  id: budget._id,
  category: budget.category,
  limitAmount: budget.limitAmount,
  spentAmount: budget.spentAmount || 0,
  month: budget.month,
  year: budget.year,
  remaining: (budget.limitAmount - (budget.spentAmount || 0)),
  percentage: budget.limitAmount > 0 
    ? Math.round(((budget.spentAmount || 0) / budget.limitAmount) * 100) 
    : 0,
});

// @desc    Create a new budget
// @route   POST /api/budget
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const { category, limitAmount, month, year } = req.body;

    // Validate required fields
    if (!category || !limitAmount) {
      return res.status(400).json({
        error: 'Please provide category and limitAmount',
      });
    }

    const { month: finalMonth, year: finalYear } = getMonthYear(month, year);

    // Check if budget already exists for this category/month/year
    const existingBudget = await Budget.findOne({
      userId: req.user._id,
      category,
      month: finalMonth,
      year: finalYear,
    });

    if (existingBudget) {
      return res.status(409).json({
        error: `Budget for category "${category}" already exists for ${finalMonth}/${finalYear}`,
      });
    }

    // Calculate current spent amount from expenses
    const spentAmount = await calculateSpentAmount(
      req.user._id,
      category,
      finalMonth,
      finalYear
    );

    // Create the budget
    const budget = new Budget({
      userId: req.user._id,
      category,
      limitAmount,
      month: finalMonth,
      year: finalYear,
      spentAmount,
    });

    await budget.save();

    res.status(201).json(formatBudget(budget));
  } catch (error) {
    console.error('Create Budget Error:', error.message);
    
    // Handle duplicate key error (E11000)
    if (error.code === 11000) {
      return res.status(409).json({
        error: `Budget for this category already exists for the specified month/year`,
      });
    }

    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Get all budgets for the logged-in user
// @route   GET /api/budget
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { month: finalMonth, year: finalYear } = getMonthYear(
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined
    );

    // Find all budgets for the user for the specified month/year
    const budgets = await Budget.find({
      userId: req.user._id,
      month: finalMonth,
      year: finalYear,
    }).sort({ category: 1 });

    // Recalculate spent amounts for each budget (in case expenses were added/updated)
    const formattedBudgets = await Promise.all(
      budgets.map(async (budget) => {
        const spentAmount = await calculateSpentAmount(
          req.user._id,
          budget.category,
          budget.month,
          budget.year
        );
        
        // Update the spent amount in the budget document
        if (budget.spentAmount !== spentAmount) {
          budget.spentAmount = spentAmount;
          await budget.save();
        }

        return formatBudget(budget);
      })
    );

    res.json(formattedBudgets);
  } catch (error) {
    console.error('Get Budgets Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Get budget status summary (includes spending vs budget)
// @route   GET /api/budget/status
// @access  Private
export const getBudgetStatus = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { month: finalMonth, year: finalYear } = getMonthYear(
      month ? parseInt(month) : undefined,
      year ? parseInt(year) : undefined
    );

    // Get all budgets for the user
    const budgets = await Budget.find({
      userId: req.user._id,
      month: finalMonth,
      year: finalYear,
    });

    if (budgets.length === 0) {
      return res.json({
        message: 'No budgets set for this month',
        budgets: [],
        summary: {
          totalBudget: 0,
          totalSpent: 0,
          totalRemaining: 0,
          overallPercentage: 0,
        },
      });
    }

    // Calculate spent amounts and format response
    const budgetStatus = await Promise.all(
      budgets.map(async (budget) => {
        const spentAmount = await calculateSpentAmount(
          req.user._id,
          budget.category,
          budget.month,
          budget.year
        );

        // Update the spent amount in the budget document
        if (budget.spentAmount !== spentAmount) {
          budget.spentAmount = spentAmount;
          await budget.save();
        }

        const remaining = budget.limitAmount - spentAmount;
        const percentage = budget.limitAmount > 0 
          ? Math.round((spentAmount / budget.limitAmount) * 100) 
          : 0;

        return {
          category: budget.category,
          limit: budget.limitAmount,
          spent: spentAmount,
          remaining: remaining,
          percentage: percentage,
          status: percentage >= 100 ? 'Exceeded' : percentage >= 80 ? 'Warning' : 'On Track',
        };
      })
    );

    // Calculate summary totals
    const summary = budgetStatus.reduce(
      (acc, curr) => ({
        totalBudget: acc.totalBudget + curr.limit,
        totalSpent: acc.totalSpent + curr.spent,
        totalRemaining: acc.totalRemaining + curr.remaining,
      }),
      { totalBudget: 0, totalSpent: 0, totalRemaining: 0 }
    );

    summary.overallPercentage = summary.totalBudget > 0
      ? Math.round((summary.totalSpent / summary.totalBudget) * 100)
      : 0;

    res.json({
      budgets: budgetStatus,
      summary,
    });
  } catch (error) {
    console.error('Budget Status Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Update a budget
// @route   PUT /api/budget/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const { limitAmount, category, month, year } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        error: 'Budget not found or unauthorized',
      });
    }

    // Update fields
    if (limitAmount !== undefined) budget.limitAmount = limitAmount;
    if (category !== undefined) budget.category = category;
    
    if (month !== undefined) {
      budget.month = parseInt(month);
    }
    if (year !== undefined) {
      budget.year = parseInt(year);
    }

    // Recalculate spent amount based on updated category/date
    budget.spentAmount = await calculateSpentAmount(
      req.user._id,
      budget.category,
      budget.month,
      budget.year
    );

    await budget.save();

    res.json(formatBudget(budget));
  } catch (error) {
    console.error('Update Budget Error:', error.message);
    
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Budget for this category already exists for the specified month/year',
      });
    }

    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budget/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        error: 'Budget not found or unauthorized',
      });
    }

    res.json({
      message: 'Budget deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete Budget Error:', error.message);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
};