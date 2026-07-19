export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'Completed' | 'Canceled' | 'Pending Review';

export type IncomeSource =
  | 'Salary'
  | 'Freelance'
  | 'Business'
  | 'Investment'
  | 'Bonus'
  | 'Rental Income'
  | 'Other';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Bills'
  | 'Shopping'
  | 'Healthcare'
  | 'Education'
  | 'Entertainment'
  | 'Travel'
  | 'Other';

export type PaymentMethod =
  | 'Bank Transfer'
  | 'Cash'
  | 'UPI'
  | 'Card'
  | 'Debit Card'
  | 'Credit Card'
  | 'Wire';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMethod: string;
  account: string;
  methodLabel: string;
  glCode: string;
  status: TransactionStatus;
  description?: string;
  merchant?: string;
  notes?: string;
  receiptName?: string;
}

export interface BudgetLimit {
  category: string;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  avatar?: string;
  darkMode: boolean;
  notifications: {
    budgetAlerts: boolean;
    expenseReminders: boolean;
    incomeReminders: boolean;
  };
}

export type PageId =
  | 'home'
  | 'transactions'
  | 'income'
  | 'expenses'
  | 'analytics'
  | 'budget'
  | 'settings';
