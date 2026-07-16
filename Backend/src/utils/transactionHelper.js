import Transaction from '../models/Transaction.js';

export const syncIncomeToTransaction = async (income) => {
  const transactionData = {
    userId: income.userId,
    type: 'Income',
    referenceId: income._id,
    referenceModel: 'Income',
    amount: income.amount,
    category: income.source,          // Income uses 'source'
    paymentMethod: income.paymentMethod,
    merchantOrSource: income.source,
    description: income.description,
    date: income.date,
  };

  // Upsert: create or update
  return Transaction.findOneAndUpdate(
    { userId: income.userId, referenceId: income._id },
    transactionData,
    { upsert: true, new: true, runValidators: true }
  );
};

export const syncExpenseToTransaction = async (expense) => {
  const transactionData = {
    userId: expense.userId,
    type: 'Expense',
    referenceId: expense._id,
    referenceModel: 'Expense',
    amount: expense.amount,
    category: expense.category,
    paymentMethod: expense.paymentMethod,
    merchantOrSource: expense.merchant || '',
    description: expense.description,
    date: expense.date,
  };

  return Transaction.findOneAndUpdate(
    { userId: expense.userId, referenceId: expense._id },
    transactionData,
    { upsert: true, new: true, runValidators: true }
  );
};

export const deleteTransactionByReference = async (userId, referenceId) => {
  return Transaction.findOneAndDelete({ userId, referenceId });
};