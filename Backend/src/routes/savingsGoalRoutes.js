import express from 'express';
import {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
} from '../controllers/savingsGoalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Require auth for all savings goals endpoints
router.use(protect);

router.route('/')
  .post(createSavingsGoal)
  .get(getSavingsGoals);

router.route('/:id')
  .put(updateSavingsGoal)
  .delete(deleteSavingsGoal);

export default router;
