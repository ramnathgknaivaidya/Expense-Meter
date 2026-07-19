import dotenv from "dotenv"
dotenv.config();
import express from 'express'
import cors from 'cors'
import connectDB from "./src/config/database.js";

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

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Expense Meter Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   API:    http://localhost:${PORT}/api`);
  });
})();
