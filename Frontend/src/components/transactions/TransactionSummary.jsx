import { formatCurrency } from '../../lib/transactions'
import { ArrowUp, ArrowDown, Wallet, Activity, TrendingUp, TrendingDown } from '../icons'

export default function TransactionSummary({ summary }) {
  const stats = [
    { label: 'Total Income', value: summary.totalIncome, icon: ArrowUp, cls: 'income', bg: 'icon-green' },
    { label: 'Total Expense', value: summary.totalExpense, icon: ArrowDown, cls: 'expense', bg: 'icon-red' },
    { label: 'Net Balance', value: summary.netBalance, icon: Wallet, cls: summary.netBalance >= 0 ? 'income' : 'expense', bg: summary.netBalance >= 0 ? 'icon-blue' : 'icon-red' },
    { label: 'Transactions', value: summary.transactionCount, icon: Activity, cls: '', bg: 'icon-orange' },
  ]

  const secondaryStats = [
    { label: 'Avg Income', value: summary.averageIncome, icon: TrendingUp },
    { label: 'Avg Expense', value: summary.averageExpense, icon: TrendingDown },
    { label: 'Highest Income', value: summary.highestIncome, icon: ArrowUp },
    { label: 'Highest Expense', value: summary.highestExpense, icon: ArrowDown },
  ]

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Summary</h3>
      <div className="grid-4" style={{ marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={s.label} className="summary-card" style={{ padding: '16px', animation: `fadeIn 0.3s ease ${i * 0.1}s both` }}>
            <div className={`sc-icon ${s.bg}`}>{s.icon ? <s.icon size={20} /> : null}</div>
            <div className="sc-label">{s.label}</div>
            <div className={`sc-value ${s.cls}`}>{typeof s.value === 'number' ? formatCurrency(s.value) : s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        {secondaryStats.map((s, i) => (
          <div key={s.label} style={{ animation: `fadeIn 0.3s ease ${0.4 + i * 0.1}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
              <s.icon size={12} /> {s.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{formatCurrency(s.value)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
