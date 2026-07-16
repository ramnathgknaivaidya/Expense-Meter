import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Income', 'Expense'],
    },
    // Polymorphic reference to the original Income or Expense document
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'referenceModel',
    },
    referenceModel: {
      type: String,
      required: true,
      enum: ['Income', 'Expense'],
    },
    // ---------- DENORMALIZED FIELDS (for fast queries & display) ----------
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'],
    },
    merchantOrSource: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ---------- INDEXES (for filter performance) ----------
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, paymentMethod: 1 });
transactionSchema.index({ userId: 1, amount: 1 }); // For amount range queries

// Ensure we don't duplicate a transaction for the same source document
transactionSchema.index(
  { userId: 1, referenceId: 1 },
  { unique: true, partialFilterExpression: { referenceId: { $exists: true } } }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;