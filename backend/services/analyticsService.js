const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

const getDashboardSummary = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [incomeResult, expenseResult] = await Promise.all([
    Income.aggregate([
      { $match: { userId: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { userId: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const totalIncome = incomeResult[0]?.total || 0;
  const totalExpense = expenseResult[0]?.total || 0;
  const balance = totalIncome - totalExpense;
  const savings = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return { totalIncome, totalExpense, balance, savings: Math.round(savings) };
};

const getIncomeAnalytics = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [monthlyIncome, sourceDistribution, lastMonthIncome] = await Promise.all([
    Income.aggregate([
      { $match: { userId: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Income.aggregate([
      { $match: { userId: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: '$source', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } },
    ]),
    Income.aggregate([
      { $match: { userId: userId, date: { $gte: startOfLastMonth, $lt: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const totalMonthly = monthlyIncome[0]?.total || 0;
  const totalLastMonth = lastMonthIncome[0]?.total || 0;
  const totalAllSources = sourceDistribution.reduce((sum, s) => sum + s.amount, 0);

  const incomeSources = sourceDistribution.map(s => ({
    source: s._id,
    amount: s.amount,
    percentage: totalAllSources > 0 ? Math.round((s.amount / totalAllSources) * 100) : 0,
  }));

  const growthPercentage = totalLastMonth > 0 ? ((totalMonthly - totalLastMonth) / totalLastMonth) * 100 : 0;

  return {
    monthlyIncome: totalMonthly,
    incomeSources,
    growthPercentage: Math.round(growthPercentage * 10) / 10,
  };
};

const getExpenseAnalytics = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [categoryDistribution, monthlyTotal] = await Promise.all([
    Expense.aggregate([
      { $match: { userId: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: '$category', amount: { $sum: '$amount' } } },
      { $sort: { amount: -1 } },
    ]),
    Expense.aggregate([
      { $match: { userId: userId, date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const totalExpense = monthlyTotal[0]?.total || 0;
  const distribution = categoryDistribution.map(c => ({
    category: c._id,
    amount: c.amount,
    percentage: totalExpense > 0 ? Math.round((c.amount / totalExpense) * 100) : 0,
  }));

  return {
    categoryDistribution: distribution,
    highestCategory: distribution[0]?.category || 'None',
    totalExpense,
  };
};

const getBudgetStatus = async (userId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const budgets = await Budget.find({ userId, month, year });
  const statuses = await Promise.all(budgets.map(async (budget) => {
    const expenseResult = await Expense.aggregate([
      { $match: { userId, category: budget.category, date: { $gte: new Date(year, month - 1, 1), $lt: new Date(year, month, 1) } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const spent = expenseResult[0]?.total || 0;
    const percentage = budget.limitAmount > 0 ? (spent / budget.limitAmount) * 100 : 0;
    return {
      category: budget.category,
      limit: budget.limitAmount,
      spent,
      remaining: budget.limitAmount - spent,
      percentage: Math.round(percentage * 100) / 100,
    };
  }));

  return statuses;
};

module.exports = { getDashboardSummary, getIncomeAnalytics, getExpenseAnalytics, getBudgetStatus };
