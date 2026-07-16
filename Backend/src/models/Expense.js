import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Speeds up queries filtering by user
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      enum: {
        values: [
          'Food',
          'Transport',
          'Housing',
          'Bills',
          'Shopping',
          'Healthcare',
          'Education',
          'Entertainment',
          'Travel',
          'Other',
        ],
        message: '{VALUE} is not a valid expense category',
      },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer'],
        message: '{VALUE} is not a valid payment method',
      },
    },
    merchant: {
      type: String,
      trim: true,
      maxlength: [100, 'Merchant name cannot exceed 100 characters'],
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now, // Defaults to today if not provided
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    receipt: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true; // null/empty is allowed
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp|pdf))$/i.test(v);
        },
        message: 'Please provide a valid receipt image URL',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index for efficient queries: Get all expenses for a user, sorted by date (newest first)
expenseSchema.index({ userId: 1, date: -1 });

// Optional: Index for category-based filtering (useful for dashboard charts)
expenseSchema.index({ userId: 1, category: 1 });

// Optional: Index for date range queries (if you frequently query by date alone)
// expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;