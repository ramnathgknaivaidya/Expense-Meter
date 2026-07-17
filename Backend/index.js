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

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...'); 
});


app.use('/api/auth', authRoutes);
app.use('/api/income', incomeRoutes); 
app.use('/api/expense', expenseRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api', analyticsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/reports', reportRoutes);

import { protect } from './src/middlewares/authMiddleware.js';

app.get('/api/dashboard', protect, (req, res) => {
  // req.user is now available from the middleware
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user, // Contains id, name, email, currency, etc. (without password)
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`); 
});

