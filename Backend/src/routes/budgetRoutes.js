import express from 'express';
import {
  createBudget,
  getBudgets,
  getBudgetStatus,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All budget routes require authentication
router.use(protect);

// Status route MUST be defined before /:id to avoid conflict
router.get('/status', getBudgetStatus);

// CRUD routes
router.route('/')
  .post(createBudget)
  .get(getBudgets);

router.route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

export default router;