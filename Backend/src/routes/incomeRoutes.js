import express from 'express';
import {
  addIncome,
  getIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';


const router = express.Router();
import { protect } from '../middlewares/authMiddleware.js';

// All income routes require authentication
router.use(protect);

// Routes
router.route('/')
  .post(addIncome)      // POST /api/income
  .get(getIncomes);     // GET /api/income

router.route('/:id')
  .get(getIncomeById)   // GET /api/income/:id
  .put(updateIncome)    // PUT /api/income/:id
  .delete(deleteIncome); // DELETE /api/income/:id

export default router;