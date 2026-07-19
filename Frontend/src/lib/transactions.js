export const CATEGORY_CONFIGS = {
  food: { name: 'Food & Dining', icon: '🍔', color: '#f97316', bg: '#fff7ed' },
  transport: { name: 'Transportation', icon: '🚗', color: '#3b82f6', bg: '#eff6ff' },
  shopping: { name: 'Shopping', icon: '🛍️', color: '#ec4899', bg: '#fdf2f8' },
  entertainment: { name: 'Entertainment', icon: '🎬', color: '#a855f7', bg: '#faf5ff' },
  bills: { name: 'Bills & Utilities', icon: '💡', color: '#eab308', bg: '#fefce8' },
  health: { name: 'Health', icon: '🏥', color: '#ef4444', bg: '#fef2f2' },
  education: { name: 'Education', icon: '📚', color: '#6366f1', bg: '#eef2ff' },
  travel: { name: 'Travel', icon: '✈️', color: '#06b6d4', bg: '#ecfeff' },
  salary: { name: 'Salary', icon: '💰', color: '#22c55e', bg: '#f0fdf4' },
  investment: { name: 'Investment', icon: '📈', color: '#10b981', bg: '#ecfdf5' },
  gift: { name: 'Gift', icon: '🎁', color: '#f43f5e', bg: '#fff1f2' },
  other: { name: 'Other', icon: '📦', color: '#6b7280', bg: '#f9fafb' },
}

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'card', label: 'Card', icon: '💳' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'digital_wallet', label: 'Digital Wallet', icon: '📱' },
  { value: 'check', label: 'Check', icon: '📝' },
  { value: 'other', label: 'Other', icon: '🔹' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest_amount', label: 'Highest Amount' },
  { value: 'lowest_amount', label: 'Lowest Amount' },
  { value: 'category_az', label: 'Category (A-Z)' },
  { value: 'category_za', label: 'Category (Z-A)' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'newest_edited', label: 'Recently Edited' },
]

export const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
]

export const TRANSACTION_STATUS = {
  completed: { label: 'Completed', color: '#22c55e' },
  pending: { label: 'Pending', color: '#eab308' },
  failed: { label: 'Failed', color: '#ef4444' },
  cancelled: { label: 'Cancelled', color: '#6b7280' },
}

export function formatCurrency(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function formatRelativeTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now - d
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(d)
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce(func, wait) {
  let timeout = null
  return (...args) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

function startOfDay(d) { const r = new Date(d); r.setHours(0,0,0,0); return r }
function endOfDay(d) { const r = new Date(d); r.setHours(23,59,59,999); return r }

export function getDateRange(range, customStart, customEnd) {
  const now = new Date()
  switch (range) {
    case 'today': return { start: startOfDay(now), end: endOfDay(now) }
    case 'yesterday': {
      const y = new Date(now); y.setDate(y.getDate() - 1)
      return { start: startOfDay(y), end: endOfDay(y) }
    }
    case 'this_week': {
      const d = new Date(now); const day = d.getDay()
      const start = new Date(d); start.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
      const end = new Date(start); end.setDate(start.getDate() + 6)
      return { start: startOfDay(start), end: endOfDay(end) }
    }
    case 'last_week': {
      const d = new Date(now); const day = d.getDay()
      const mon = new Date(d); mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1) - 7)
      const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
      return { start: startOfDay(mon), end: endOfDay(sun) }
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return { start: startOfDay(start), end: endOfDay(end) }
    }
    case 'last_month': {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return { start: startOfDay(start), end: endOfDay(end) }
    }
    case 'custom':
      return {
        start: customStart ? startOfDay(customStart) : startOfDay(now),
        end: customEnd ? endOfDay(customEnd) : endOfDay(now),
      }
    default: return { start: startOfDay(now), end: endOfDay(now) }
  }
}

export const mockTransactions = [
  { id: generateId(), title: 'Grocery Shopping', description: 'Weekly grocery run at Whole Foods', amount: 156.78, type: 'expense', category: 'food', paymentMethod: 'card', merchant: 'Whole Foods Market', date: new Date('2026-07-15'), createdAt: new Date('2026-07-15'), updatedAt: new Date('2026-07-15'), currency: 'USD', tags: ['groceries', 'weekly'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Monthly Salary', description: 'January salary payment', amount: 5000.00, type: 'income', category: 'salary', paymentMethod: 'bank_transfer', merchant: 'Acme Corp', date: new Date('2026-07-01'), createdAt: new Date('2026-07-01'), updatedAt: new Date('2026-07-01'), currency: 'USD', tags: ['salary', 'monthly'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Uber Ride', description: 'Ride to downtown meeting', amount: 24.50, type: 'expense', category: 'transport', paymentMethod: 'digital_wallet', merchant: 'Uber', date: new Date('2026-07-14'), createdAt: new Date('2026-07-14'), updatedAt: new Date('2026-07-14'), currency: 'USD', tags: ['transport', 'business'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Netflix Subscription', description: 'Monthly subscription', amount: 15.99, type: 'expense', category: 'entertainment', paymentMethod: 'card', merchant: 'Netflix', date: new Date('2026-07-10'), createdAt: new Date('2026-07-10'), updatedAt: new Date('2026-07-10'), currency: 'USD', tags: ['subscription', 'entertainment'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Electric Bill', description: 'January electricity bill', amount: 89.45, type: 'expense', category: 'bills', paymentMethod: 'bank_transfer', merchant: 'City Power Co', date: new Date('2026-07-08'), createdAt: new Date('2026-07-08'), updatedAt: new Date('2026-07-08'), currency: 'USD', tags: ['utilities', 'bills'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Freelance Payment', description: 'Web design project payment', amount: 1200.00, type: 'income', category: 'other', paymentMethod: 'bank_transfer', merchant: 'Client XYZ', date: new Date('2026-07-12'), createdAt: new Date('2026-07-12'), updatedAt: new Date('2026-07-12'), currency: 'USD', tags: ['freelance', 'income'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Amazon Purchase', description: 'Books and office supplies', amount: 67.89, type: 'expense', category: 'shopping', paymentMethod: 'card', merchant: 'Amazon', date: new Date('2026-07-13'), createdAt: new Date('2026-07-13'), updatedAt: new Date('2026-07-13'), currency: 'USD', tags: ['shopping', 'office'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Doctor Visit', description: 'Annual checkup', amount: 150.00, type: 'expense', category: 'health', paymentMethod: 'card', merchant: 'City Medical Center', date: new Date('2026-07-09'), createdAt: new Date('2026-07-09'), updatedAt: new Date('2026-07-09'), currency: 'USD', tags: ['health', 'medical'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Online Course', description: 'React advanced patterns course', amount: 99.00, type: 'expense', category: 'education', paymentMethod: 'card', merchant: 'Udemy', date: new Date('2026-07-11'), createdAt: new Date('2026-07-11'), updatedAt: new Date('2026-07-11'), currency: 'USD', tags: ['education', 'learning'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Flight Booking', description: 'Flight to NYC for conference', amount: 350.00, type: 'expense', category: 'travel', paymentMethod: 'card', merchant: 'Delta Airlines', date: new Date('2026-07-07'), createdAt: new Date('2026-07-07'), updatedAt: new Date('2026-07-07'), currency: 'USD', tags: ['travel', 'business'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Stock Investment', description: 'AAPL stock purchase', amount: 500.00, type: 'income', category: 'investment', paymentMethod: 'bank_transfer', merchant: 'Robinhood', date: new Date('2026-07-06'), createdAt: new Date('2026-07-06'), updatedAt: new Date('2026-07-06'), currency: 'USD', tags: ['investment', 'stocks'], status: 'completed', userId: 'user-1' },
  { id: generateId(), title: 'Birthday Gift', description: 'Gift for sister', amount: 75.00, type: 'expense', category: 'gift', paymentMethod: 'card', merchant: 'Nordstrom', date: new Date('2026-07-05'), createdAt: new Date('2026-07-05'), updatedAt: new Date('2026-07-05'), currency: 'USD', tags: ['gift', 'personal'], status: 'completed', userId: 'user-1' },
]
