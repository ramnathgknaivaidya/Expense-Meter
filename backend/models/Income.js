const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: [true, 'Amount is required'], min: 0 },
  source: { type: String, required: true, enum: ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Rental', 'Other'] },
  paymentMethod: { type: String, required: true, enum: ['Bank Transfer', 'Cash', 'UPI', 'Card'] },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, trim: true, default: '' },
}, { timestamps: true });

incomeSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Income', incomeSchema);
