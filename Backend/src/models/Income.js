import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true, // Speeds up queries filtering by user
    },
    amount: {
      type: Number,
      required: [true, 'Income amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    source: {
      type: String,
      required: [true, 'Income source is required'],
      enum: {
        values: ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Rental', 'Other'],
        message: '{VALUE} is not a valid income source',
      },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['Bank Transfer', 'Cash', 'UPI', 'Card'],
        message: '{VALUE} is not a valid payment method',
      },
    },
    date: {
      type: Date,
      required: [true, 'Income date is required'],
      default: Date.now, // Defaults to today if not provided
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound index for efficient queries: Get all incomes for a user in a date range
incomeSchema.index({ userId: 1, date: -1 });

// Optional: Compound index for unique constraint if needed
// e.g., Prevent duplicate entries for same user, source, and date (adjust as needed)
// incomeSchema.index({ userId: 1, source: 1, date: 1 }, { unique: true });

const Income = mongoose.model('Income', incomeSchema);

export default Income;

