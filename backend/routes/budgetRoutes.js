const express = require('express');
const router = express.Router();
const { createBudget, getBudgets, getBudgetStatus, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', createBudget);
router.get('/', getBudgets);
router.get('/status', getBudgetStatus);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
