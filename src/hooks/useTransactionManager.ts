import { useState, useMemo, useCallback } from 'react';
import { Transaction, MOCK_TRANSACTIONS, TransactionType, TransactionCategory, PaymentMethod } from '@/lib/mock-data';

export type { Transaction, TransactionType, TransactionCategory, PaymentMethod };

export type DateRange = 'today' | 'week' | 'month' | 'custom';
export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export function useTransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'all'>('all');
  const [filterMethod, setFilterMethod] = useState<PaymentMethod | 'all'>('all');
  const [filterDateRange, setFilterDateRange] = useState<DateRange>('custom');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(term) ||
        t.merchant.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    // Type Filter
    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    // Category Filter
    if (filterCategory !== 'all') {
      result = result.filter(t => t.category === filterCategory);
    }

    // Method Filter
    if (filterMethod !== 'all') {
      result = result.filter(t => t.paymentMethod === filterMethod);
    }

    // Date Range Filter
    if (filterDateRange !== 'custom') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;
      const oneMonthAgo = today - 30 * 24 * 60 * 60 * 1000;

      result = result.filter(t => {
        const tDate = new Date(t.date).getTime();
        if (filterDateRange === 'today') return tDate >= today;
        if (filterDateRange === 'week') return tDate >= oneWeekAgo;
        if (filterDateRange === 'month') return tDate >= oneMonthAgo;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === 'highest') return b.amount - a.amount;
      if (sortOption === 'lowest') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, filterCategory, filterMethod, filterDateRange, sortOption]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const duplicateTransaction = useCallback((transaction: Transaction) => {
    const duplicated = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setTransactions(prev => [duplicated, ...prev]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  return {
    transactions: filteredTransactions,
    searchTerm, setSearchTerm,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    filterMethod, setFilterMethod,
    filterDateRange, setFilterDateRange,
    sortOption, setSortOption,
    deleteTransaction,
    duplicateTransaction,
    updateTransaction,
    addTransaction,
  };
}
