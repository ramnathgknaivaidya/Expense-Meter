import { useState, useMemo, useCallback } from 'react'
import { mockTransactions, getDateRange } from '../lib/transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: 'this_month',
    sortBy: 'newest',
  })

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      )
    }

    const { start, end } = getDateRange(filters.dateRange, filters.customDateStart, filters.customDateEnd)
    filtered = filtered.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end
    })

    if (filters.type) filtered = filtered.filter(t => t.type === filters.type)
    if (filters.category) filtered = filtered.filter(t => t.category === filters.category)
    if (filters.paymentMethod) filtered = filtered.filter(t => t.paymentMethod === filters.paymentMethod)
    if (filters.minAmount !== undefined) filtered = filtered.filter(t => t.amount >= filters.minAmount)
    if (filters.maxAmount !== undefined) filtered = filtered.filter(t => t.amount <= filters.maxAmount)

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest': return new Date(b.date) - new Date(a.date)
        case 'oldest': return new Date(a.date) - new Date(b.date)
        case 'highest_amount': return b.amount - a.amount
        case 'lowest_amount': return a.amount - b.amount
        case 'category_az': return a.category.localeCompare(b.category)
        case 'category_za': return b.category.localeCompare(a.category)
        case 'merchant': return a.merchant.localeCompare(b.merchant)
        case 'newest_edited': return new Date(b.updatedAt) - new Date(a.updatedAt)
        default: return 0
      }
    })

    return filtered
  }, [transactions, filters])

  const summary = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income')
    const expense = filteredTransactions.filter(t => t.type === 'expense')
    const totalIncome = income.reduce((s, t) => s + t.amount, 0)
    const totalExpense = expense.reduce((s, t) => s + t.amount, 0)
    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      transactionCount: filteredTransactions.length,
      averageExpense: expense.length > 0 ? totalExpense / expense.length : 0,
      averageIncome: income.length > 0 ? totalIncome / income.length : 0,
      highestExpense: expense.length > 0 ? Math.max(...expense.map(t => t.amount)) : 0,
      highestIncome: income.length > 0 ? Math.max(...income.map(t => t.amount)) : 0,
    }
  }, [filteredTransactions])

  const addTransaction = useCallback((transaction) => {
    setTransactions(prev => [{
      ...transaction,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, ...prev])
  }, [])

  const updateTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    ))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const duplicateTransaction = useCallback((id) => {
    const original = transactions.find(t => t.id === id)
    if (original) {
      setTransactions(prev => [{
        ...original,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }, ...prev])
    }
  }, [transactions])

  return {
    transactions: filteredTransactions,
    summary,
    filters,
    setFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    duplicateTransaction,
  }
}
