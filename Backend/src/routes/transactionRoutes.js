import express from 'express';
import { getTransactions, getTransactionById } from '../controllers/transactionController.js';
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// GET /api/transactions?startDate=...&endDate=...&type=income&category=Food&paymentMethod=UPI&minAmount=100&maxAmount=1000
router.route('/').get(getTransactions);

// GET /api/transactions/:id
router.route('/:id').get(getTransactionById);

export default router;