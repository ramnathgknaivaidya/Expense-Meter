const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, enum: ['Food', 'Transport', 'Housing', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Entertainment', 'Travel', 'Other'] },
  limitAmount: { type: Number, required: [true, 'Budget limit is required'], min: 0 },
  spentAmount: { type: Number, default: 0 },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
}, { timestamps: true });

budgetSchema.index({ userId: 1, month: 1, year: 1 });
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
