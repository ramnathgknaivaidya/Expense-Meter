import express from 'express';
import {
  getMonthlyReport,
  getYearlyReport,
  getIncomeReport,
  getExpenseReport,
} from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All report routes require authentication
router.use(protect);

// Report endpoints
router.get('/monthly', getMonthlyReport);
router.get('/yearly', getYearlyReport);
router.get('/income', getIncomeReport);
router.get('/expense', getExpenseReport);

export default router;