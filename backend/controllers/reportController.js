const analyticsService = require('../services/analyticsService');
const reportService = require('../services/reportService');

const getDashboard = async (req, res) => {
  try {
    const summary = await analyticsService.getDashboardSummary(req.user._id);
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIncomeAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getIncomeAnalytics(req.user._id);
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExpenseAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getExpenseAnalytics(req.user._id);
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBudgetStatusReport = async (req, res) => {
  try {
    const statuses = await analyticsService.getBudgetStatus(req.user._id);
    res.json({ success: true, data: statuses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || (new Date().getMonth() + 1);
    const y = parseInt(year) || new Date().getFullYear();
    const report = await reportService.getMonthlyReport(req.user._id, m, y);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getYearlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const report = await reportService.getYearlyReport(req.user._id, y);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIncomeReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const report = await reportService.getIncomeReport(req.user._id, from, to);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getExpenseReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const report = await reportService.getExpenseReport(req.user._id, from, to);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getIncomeAnalytics, getExpenseAnalytics, getBudgetStatusReport, getMonthlyReport, getYearlyReport, getIncomeReport, getExpenseReport };
