import express from 'express';
import {
  getDashboardSummary,
  getIncomeAnalytics,
  getExpenseAnalytics,
} from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All analytics routes require authentication
router.use(protect);

// Dashboard summary
router.get('/dashboard', getDashboardSummary);

// Analytics endpoints
router.get('/analytics/income', getIncomeAnalytics);
router.get('/analytics/expense', getExpenseAnalytics);

export default router;