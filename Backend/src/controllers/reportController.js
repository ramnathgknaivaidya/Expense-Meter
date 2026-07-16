import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// Helper: Format month number to name
const getMonthName = (monthNumber) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNumber - 1];
};

// Helper: Create date range from month/year
const getMonthDateRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  return { startDate, endDate };
};

// Helper: Get date range for a full year
const getYearDateRange = (year) => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);
  return { startDate, endDate };
};

// Helper: Calculate income, expense, savings
const calculateFinancialSummary = async (userId, startDate, endDate) => {
  const result = await Transaction.aggregate([
    {
      $match: {
        userId: userId,
        date: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
      },
    },
  ]);

  let income = 0;
  let expense = 0;

  result.forEach((item) => {
    if (item._id === 'Income') income = item.total;
    if (item._id === 'Expense') expense = item.total;
  });

  const savings = income - expense;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  return { income, expense, savings, savingsRate };
};

// =============================================
// 1. MONTHLY REPORT
// =============================================
// @desc    Get monthly financial report
// @route   GET /api/reports/monthly?month=7&year=2026
// @access  Private
export const getMonthlyReport = async (req, res) => {
  try {
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const { startDate, endDate } = getMonthDateRange(month, year);
    const summary = await calculateFinancialSummary(req.user._id, startDate, endDate);

    res.json({
      month: getMonthName(month),
      year: year,
      income: summary.income,
      expense: summary.expense,
      savings: summary.savings,
      savingsRate: summary.savingsRate,
    });
  } catch (error) {
    console.error('Monthly Report Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// =============================================
// 2. YEARLY REPORT
// =============================================
// @desc    Get yearly financial report with monthly breakdown
// @route   GET /api/reports/yearly?year=2026
// @access  Private
export const getYearlyReport = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const { startDate, endDate } = getYearDateRange(year);

    // Monthly breakdown
    const monthlyData = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Income'] }, '$total', 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'Expense'] }, '$total', 0],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Format monthly breakdown
    const monthlyBreakdown = monthlyData.map((item) => {
      const monthNum = item._id;
      const savings = item.income - item.expense;
      const savingsRate = item.income > 0 ? Math.round((savings / item.income) * 100) : 0;
      return {
        month: getMonthName(monthNum),
        monthNumber: monthNum,
        income: item.income,
        expense: item.expense,
        savings: savings,
        savingsRate: savingsRate,
      };
    });

    // Overall yearly totals
    const totalIncome = monthlyBreakdown.reduce((sum, m) => sum + m.income, 0);
    const totalExpense = monthlyBreakdown.reduce((sum, m) => sum + m.expense, 0);
    const totalSavings = totalIncome - totalExpense;
    const overallSavingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

    res.json({
      year: year,
      summary: {
        totalIncome,
        totalExpense,
        totalSavings,
        overallSavingsRate,
      },
      monthlyBreakdown,
    });
  } catch (error) {
    console.error('Yearly Report Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// =============================================
// 3. INCOME REPORT (Detailed)
// =============================================
// @desc    Get detailed income report with source breakdown
// @route   GET /api/reports/income?from=2026-07-01&to=2026-07-31
// @access  Private
export const getIncomeReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        error: 'Please provide both "from" and "to" date parameters (YYYY-MM-DD)',
      });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date

    // 1. Get all income transactions
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: 'Income',
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: -1 });

    // 2. Calculate total income
    const totalIncome = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // 3. Breakdown by source (category)
    const sourceBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'Income',
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    const formattedSourceBreakdown = sourceBreakdown.map((item) => ({
      source: item._id,
      total: item.total,
      count: item.count,
      percentage: totalIncome > 0 ? Math.round((item.total / totalIncome) * 100) : 0,
    }));

    // Format transactions for response
    const formattedTransactions = transactions.map((tx) => ({
      id: tx._id,
      amount: tx.amount,
      source: tx.category,
      paymentMethod: tx.paymentMethod,
      description: tx.description,
      date: tx.date,
    }));

    res.json({
      from: startDate,
      to: endDate,
      summary: {
        totalIncome,
        totalTransactions: transactions.length,
        averageTransaction: transactions.length > 0 
          ? Math.round(totalIncome / transactions.length) 
          : 0,
      },
      sourceBreakdown: formattedSourceBreakdown,
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error('Income Report Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// =============================================
// 4. EXPENSE REPORT (Detailed)
// =============================================
// @desc    Get detailed expense report with category breakdown
// @route   GET /api/reports/expense?from=2026-07-01&to=2026-07-31
// @access  Private
export const getExpenseReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        error: 'Please provide both "from" and "to" date parameters (YYYY-MM-DD)',
      });
    }

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    // 1. Get all expense transactions
    const transactions = await Transaction.find({
      userId: req.user._id,
      type: 'Expense',
      date: { $gte: startDate, $lt: endDate },
    }).sort({ date: -1 });

    // 2. Calculate total expense
    const totalExpense = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    // 3. Breakdown by category
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'Expense',
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    const formattedCategoryBreakdown = categoryBreakdown.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
      percentage: totalExpense > 0 ? Math.round((item.total / totalExpense) * 100) : 0,
    }));

    // Format transactions for response
    const formattedTransactions = transactions.map((tx) => ({
      id: tx._id,
      amount: tx.amount,
      category: tx.category,
      paymentMethod: tx.paymentMethod,
      merchant: tx.merchantOrSource,
      description: tx.description,
      date: tx.date,
    }));

    res.json({
      from: startDate,
      to: endDate,
      summary: {
        totalExpense,
        totalTransactions: transactions.length,
        averageTransaction: transactions.length > 0 
          ? Math.round(totalExpense / transactions.length) 
          : 0,
        highestCategory: formattedCategoryBreakdown.length > 0 
          ? formattedCategoryBreakdown[0].category 
          : 'N/A',
      },
      categoryBreakdown: formattedCategoryBreakdown,
      transactions: formattedTransactions,
    });
  } catch (error) {
    console.error('Expense Report Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};