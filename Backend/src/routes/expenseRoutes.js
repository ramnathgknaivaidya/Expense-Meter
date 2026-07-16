import express from 'express';
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary
} from '../controllers/expenseController.js';
import {protect} from '../middlewares/authMiddleware.js'
 
const router = express.Router();

// All expense routes require authentication
router.use(protect);

// Routes
router.route('/')
  .post(addExpense)      // POST /api/expense
  .get(getExpenses);    // GET /api/expense
 

router.route('/:id')
  .get(getExpenseById)   // GET /api/expense/:id
  .put(updateExpense)    // PUT /api/expense/:id
  .delete(deleteExpense); // DELETE /api/expense/:id

  router.get('/summary', getExpenseSummary);

export default router;