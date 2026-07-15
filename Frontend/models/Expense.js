const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
  category: { type: String, required: true, enum: ['Food', 'Transport', 'Housing', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Travel', 'Other'] },
  paymentMethod: { type: String, required: true, enum: ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'] },
  merchant: { type: String, trim: true, default: '' },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, trim: true, default: '' },
  receipt: { type: String, default: '' },
}, { timestamps: true });

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
