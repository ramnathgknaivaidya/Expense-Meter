const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, getIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/', addIncome);
router.get('/', getIncomes);
router.get('/:id', getIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

module.exports = router;
