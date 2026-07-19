import { useState, useMemo, useCallback, useEffect } from 'react'
import { transactionAPI } from '../api/client'
import { getDateRange } from '../lib/transactions'

export function useTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: 'this_month',
    sortBy: 'newest',
  })

  const loadTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await transactionAPI.getAll()
      setTransactions(res.data.results || [])
    } catch (err) {
      setError('Failed to load transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        (t.category || '').toLowerCase().includes(q) ||
        (t.merchantOrSource || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        t.amount.toString().includes(q)
      )
    }

    const { start, end } = getDateRange(filters.dateRange, filters.customDateStart, filters.customDateEnd)
    filtered = filtered.filter(t => {
      const d = new Date(t.date)
      return d >= start && d <= end
    })

    if (filters.type) filtered = filtered.filter(t => t.type.toLowerCase() === filters.type)
    if (filters.category) filtered = filtered.filter(t => t.category.toLowerCase() === filters.category)
    if (filters.paymentMethod) filtered = filtered.filter(t => (t.paymentMethod || '').toLowerCase() === filters.paymentMethod)
    if (filters.minAmount !== undefined) filtered = filtered.filter(t => t.amount >= filters.minAmount)
    if (filters.maxAmount !== undefined) filtered = filtered.filter(t => t.amount <= filters.maxAmount)

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest': return new Date(b.date) - new Date(a.date)
        case 'oldest': return new Date(a.date) - new Date(b.date)
        case 'highest_amount': return b.amount - a.amount
        case 'lowest_amount': return a.amount - b.amount
        case 'category_az': return (a.category || '').localeCompare(b.category || '')
        case 'category_za': return (b.category || '').localeCompare(a.category || '')
        case 'merchant': return (a.merchantOrSource || '').localeCompare(b.merchantOrSource || '')
        case 'newest_edited': return new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date)
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

  return {
    transactions: filteredTransactions,
    summary,
    loading,
    error,
    filters,
    setFilters,
    refresh: loadTransactions,
  }
}
