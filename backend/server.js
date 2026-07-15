const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { port } = require('./config/environment');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const Income = require('./models/Income');
const Expense = require('./models/Expense');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { success: false, message: 'Too many requests, please try again later' } });
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { message: 'Expense Meter API is running', version: '1.0.0', timestamp: new Date().toISOString() } });
});

app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

async function seedDemoData(userId) {
  const existingIncome = await Income.findOne({ userId });
  if (existingIncome) return;

  const incomes = [
    { amount: 50000, source: 'Salary', paymentMethod: 'Bank Transfer', date: new Date(2026, 6, 1), description: 'July salary' },
    { amount: 12000, source: 'Freelance', paymentMethod: 'UPI', date: new Date(2026, 6, 5), description: 'Web dev project' },
    { amount: 3000, source: 'Investment', paymentMethod: 'Bank Transfer', date: new Date(2026, 6, 10), description: 'Stock dividends' },
    { amount: 8000, source: 'Business', paymentMethod: 'Card', date: new Date(2026, 6, 15), description: 'Side business revenue' },
    { amount: 2000, source: 'Bonus', paymentMethod: 'Bank Transfer', date: new Date(2026, 6, 20), description: 'Performance bonus' },
  ];
  const expenses = [
    { amount: 4500, category: 'Food', paymentMethod: 'UPI', merchant: 'Swiggy', date: new Date(2026, 6, 2), description: 'Monthly food delivery' },
    { amount: 2000, category: 'Transport', paymentMethod: 'UPI', merchant: 'Uber', date: new Date(2026, 6, 3), description: 'Cab rides' },
    { amount: 15000, category: 'Housing', paymentMethod: 'Bank Transfer', merchant: 'Landlord', date: new Date(2026, 6, 1), description: 'Monthly rent' },
    { amount: 3000, category: 'Bills', paymentMethod: 'Debit Card', merchant: 'Electricity Board', date: new Date(2026, 6, 5), description: 'Electricity bill' },
    { amount: 2500, category: 'Shopping', paymentMethod: 'Credit Card', merchant: 'Amazon', date: new Date(2026, 6, 8), description: 'Clothes purchase' },
    { amount: 1500, category: 'Healthcare', paymentMethod: 'Cash', merchant: 'Apollo Pharmacy', date: new Date(2026, 6, 12), description: 'Medicine' },
    { amount: 5000, category: 'Education', paymentMethod: 'UPI', merchant: 'Coursera', date: new Date(2026, 6, 14), description: 'Online course' },
    { amount: 2000, category: 'Entertainment', paymentMethod: 'Debit Card', merchant: 'Netflix', date: new Date(2026, 6, 16), description: 'Subscriptions' },
    { amount: 1000, category: 'Food', paymentMethod: 'Cash', merchant: 'Local Cafe', date: new Date(2026, 6, 18), description: 'Lunch' },
    { amount: 3500, category: 'Transport', paymentMethod: 'UPI', merchant: 'Indian Oil', date: new Date(2026, 6, 20), description: 'Fuel' },
  ];

  for (const inc of incomes) {
    const created = await Income.create({ userId, ...inc });
    await Transaction.create({ userId, type: 'income', referenceId: created._id, amount: inc.amount, category: inc.source, paymentMethod: inc.paymentMethod, description: inc.description, date: inc.date });
  }
  for (const exp of expenses) {
    const created = await Expense.create({ userId, ...exp });
    await Transaction.create({ userId, type: 'expense', referenceId: created._id, amount: exp.amount, category: exp.category, paymentMethod: exp.paymentMethod, description: exp.description, date: exp.date });
  }
  await Budget.create({ userId, category: 'Food', limitAmount: 6000, month: 7, year: 2026 });
  await Budget.create({ userId, category: 'Transport', limitAmount: 3000, month: 7, year: 2026 });
  await Budget.create({ userId, category: 'Shopping', limitAmount: 5000, month: 7, year: 2026 });
  console.log('Demo data seeded successfully');
}

connectDB().then(async () => {
  let demoUser = await User.findOne({ email: 'demo@expense.com' });
  if (!demoUser) {
    demoUser = await User.create({ name: 'Demo User', email: 'demo@expense.com', password: 'password123', currency: 'INR' });
    console.log('Demo user created: demo@expense.com / password123');
  }
  await seedDemoData(demoUser._id);
  app.listen(port, () => {
    console.log(`Expense Meter server running on port ${port}`);
  });
});
