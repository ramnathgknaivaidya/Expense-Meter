import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// Helper: Get date range for current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { startOfMonth, endOfMonth };
};

// Helper: Get date range for previous month
const getPreviousMonthRange = () => {
  const now = new Date();
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return { startOfPrevMonth, endOfPrevMonth };
};

// @desc    Dashboard Summary
// @route   GET /api/dashboard
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();

    // Get all transactions for the current month
    const transactions = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Extract totals
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((item) => {
      if (item._id === 'Income') totalIncome = item.total;
      if (item._id === 'Expense') totalExpense = item.total;
    });

    const balance = totalIncome - totalExpense;
    const savings = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      savings,
    });
  } catch (error) {
    console.error('Dashboard Summary Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// @desc    Income Analytics
// @route   GET /api/analytics/income
// @access  Private
export const getIncomeAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();
    const { startOfPrevMonth, endOfPrevMonth } = getPreviousMonthRange();

    // 1. Monthly Income (current month total)
    const monthlyIncomeResult = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'Income',
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const monthlyIncome = monthlyIncomeResult.length > 0 ? monthlyIncomeResult[0].total : 0;

    // 2. Income Sources (group by category/source)
    const incomeSources = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'Income',
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { amount: -1 },
      },
    ]);

    // Calculate percentages
    const totalIncomeForSources = incomeSources.reduce((sum, item) => sum + item.amount, 0);
    const formattedSources = incomeSources.map((item) => ({
      source: item._id,
      amount: item.amount,
      percentage: totalIncomeForSources > 0
        ? Math.round((item.amount / totalIncomeForSources) * 100)
        : 0,
    }));

    // 3. Growth Percentage (compare current month vs previous month)
    const previousMonthIncome = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'Income',
          date: { $gte: startOfPrevMonth, $lt: endOfPrevMonth },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const prevIncome = previousMonthIncome.length > 0 ? previousMonthIncome[0].total : 0;
    let growthPercentage = 0;

    if (prevIncome > 0) {
      growthPercentage = parseFloat(
        (((monthlyIncome - prevIncome) / prevIncome) * 100).toFixed(2)
      );
    } else if (monthlyIncome > 0) {
      growthPercentage = 100; // If previous was 0 and current > 0
    }

    res.json({
      monthlyIncome,
      incomeSources: formattedSources,
      growthPercentage,
    });
  } catch (error) {
    console.error('Income Analytics Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};

// @desc    Expense Analytics
// @route   GET /api/analytics/expense
// @access  Private
export const getExpenseAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();

    // 1. Category Distribution
    const categoryDistribution = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'Expense',
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
        },
      },
      {
        $sort: { amount: -1 },
      },
    ]);

    const totalExpense = categoryDistribution.reduce((sum, item) => sum + item.amount, 0);
    const formattedCategories = categoryDistribution.map((item, index) => ({
      category: item._id,
      amount: item.amount,
      percentage: totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0,
    }));

    // 2. Highest Category
    const highestCategory = formattedCategories.length > 0 ? formattedCategories[0].category : 'N/A';

    // 3. Spending Trends (daily spending for the current month)
    const spendingTrends = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          type: 'Expense',
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedTrends = spendingTrends.map((item) => ({
      day: item._id,
      total: item.total,
      count: item.count,
    }));

    res.json({
      categoryDistribution: formattedCategories,
      spendingTrends: formattedTrends,
      highestCategory,
    });
  } catch (error) {
    console.error('Expense Analytics Error:', error.message);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
};