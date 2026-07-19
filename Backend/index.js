import dotenv from "dotenv"
dotenv.config();
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import connectDB from "./src/config/database.js";
import User from './src/models/User.js';
import Income from './src/models/Income.js';
import Expense from './src/models/Expense.js';
import Transaction from './src/models/Transaction.js';
import Budget from './src/models/Budget.js';

import authRoutes from './src/routes/authRoutes.js'
import incomeRoutes from './src/routes/incomeRoutes.js'
import expenseRoutes from './src/routes/expenseRoutes.js'
import transactionRoutes from './src/routes/transactionRoutes.js'
import analyticsRoutes from './src/routes/analyticsRoutes.js'
import budgetRoutes from './src/routes/budgetRoutes.js'
import reportRoutes from './src/routes/reportRoutes.js'
import savingsGoalRoutes from './src/routes/savingsGoalRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...'); 
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { message: 'Expense Meter API is running', version: '1.0.0', timestamp: new Date().toISOString() } });
});

app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes); 
app.use('/api/expense', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);

import { protect } from './src/middlewares/authMiddleware.js';

app.get('/api/dashboard', protect, (req, res) => {
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Server error, please try again later' });
});

async function seedDemoData(userId) {
  const existingTransaction = await Transaction.findOne({ userId });
  if (existingTransaction) return;

  // Clean up any orphan records from a previous incomplete seed
  await Income.deleteMany({ userId });
  await Expense.deleteMany({ userId });
  await Budget.deleteMany({ userId });

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
    await Transaction.create({ userId, type: 'Income', referenceModel: 'Income', referenceId: created._id, amount: inc.amount, category: inc.source, paymentMethod: inc.paymentMethod, merchantOrSource: inc.source, description: inc.description, date: inc.date });
  }
  for (const exp of expenses) {
    const created = await Expense.create({ userId, ...exp });
    await Transaction.create({ userId, type: 'Expense', referenceModel: 'Expense', referenceId: created._id, amount: exp.amount, category: exp.category, paymentMethod: exp.paymentMethod, merchantOrSource: exp.merchant || '', description: exp.description, date: exp.date });
  }
  await Budget.create({ userId, category: 'Food', limitAmount: 6000, month: 7, year: 2026 });
  await Budget.create({ userId, category: 'Transport', limitAmount: 3000, month: 7, year: 2026 });
  await Budget.create({ userId, category: 'Shopping', limitAmount: 5000, month: 7, year: 2026 });
  console.log('✅ Demo data seeded successfully');
}

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  try {
    let demoUser = await User.findOne({ email: 'demo@expense.com' });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      demoUser = await User.create({ name: 'Demo User', email: 'demo@expense.com', password: hashedPassword, currency: 'INR' });
      console.log('✅ Demo user created: demo@expense.com / password123');
    }
    await seedDemoData(demoUser._id);
  } catch (err) {
    console.warn('⚠️ Seed data error —', err.message);
  }
  app.listen(PORT, () => {
    console.log(`🚀 Expense Meter Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   API:    http://localhost:${PORT}/api`);
  });
})();
