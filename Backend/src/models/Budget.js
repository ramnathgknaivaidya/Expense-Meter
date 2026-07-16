import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Speeds up queries filtering by user
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
    limitAmount: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0, 'Budget limit cannot be negative'],
    },
    spentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount cannot be negative'],
    },
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: [1, 'Month must be between 1 and 12'],
      max: [12, 'Month must be between 1 and 12'],
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [2000, 'Year must be 2000 or later'],
      max: [2100, 'Year must be 2100 or earlier'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ---------- INDEXES ----------

// Index 1: Performance - Fetch all budgets for a specific user in a specific month/year
// e.g., Get all budgets for User X in January 2026
budgetSchema.index({ userId: 1, month: 1, year: 1 });

// Index 2: Performance + Data Integrity (UNIQUE)
// Ensures a user can only have ONE budget per category per month/year
// e.g., Prevents creating two "Food" budgets for January 2026 for the same user
budgetSchema.index(
  { userId: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;