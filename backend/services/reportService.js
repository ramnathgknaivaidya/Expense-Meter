const Income = require('../models/Income');
const Expense = require('../models/Expense');

const getMonthlyReport = async (userId, month, year) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const [incomeResult, expenseResult] = await Promise.all([
    Income.aggregate([
      { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Expense.aggregate([
      { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ]);

  const income = incomeResult[0]?.total || 0;
  const expense = expenseResult[0]?.total || 0;
  const savings = income - expense;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return {
    month: monthNames[month - 1],
    year,
    income,
    expense,
    savings,
    savingsRate: Math.round(savingsRate * 100) / 100,
  };
};

const getYearlyReport = async (userId, year) => {
  const monthlyReports = [];
  for (let month = 1; month <= 12; month++) {
    const report = await getMonthlyReport(userId, month, year);
    monthlyReports.push(report);
  }
  const totalIncome = monthlyReports.reduce((sum, r) => sum + r.income, 0);
  const totalExpense = monthlyReports.reduce((sum, r) => sum + r.expense, 0);
  return { year, totalIncome, totalExpense, totalSavings: totalIncome - totalExpense, monthlyReports };
};

const getIncomeReport = async (userId, from, to) => {
  const filter = { userId, date: {} };
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);
  if (!from && !to) delete filter.date;

  const incomes = await Income.find(filter).sort({ date: -1 });
  const total = incomes.reduce((sum, i) => sum + i.amount, 0);
  const bySource = {};
  incomes.forEach(i => { bySource[i.source] = (bySource[i.source] || 0) + i.amount; });

  return { total, count: incomes.length, records: incomes, bySource };
};

const getExpenseReport = async (userId, from, to) => {
  const filter = { userId, date: {} };
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);
  if (!from && !to) delete filter.date;

  const expenses = await Expense.find(filter).sort({ date: -1 });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  expenses.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });

  return { total, count: expenses.length, records: expenses, byCategory };
};

module.exports = { getMonthlyReport, getYearlyReport, getIncomeReport, getExpenseReport };
