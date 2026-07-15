const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboard, getIncomeAnalytics, getExpenseAnalytics, getBudgetStatusReport,
  getMonthlyReport, getYearlyReport, getIncomeReport, getExpenseReport,
} = require('../controllers/reportController');

router.use(protect);
router.get('/dashboard', getDashboard);
router.get('/analytics/income', getIncomeAnalytics);
router.get('/analytics/expense', getExpenseAnalytics);
router.get('/budget/status', getBudgetStatusReport);
router.get('/monthly', getMonthlyReport);
router.get('/yearly', getYearlyReport);
router.get('/income', getIncomeReport);
router.get('/expense', getExpenseReport);

module.exports = router;
