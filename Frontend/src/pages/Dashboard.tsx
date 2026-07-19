import { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AppStore } from '../data/store';
import type { PageId } from '../types';
import { formatShortDate } from '../utils/format';
import { filterTransactions } from '../utils/search';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ModeToggle } from '../components/ModeToggle';
import { TogglePanel } from '../components/TogglePanel';

interface Props {
  store: AppStore;
  onNavigate: (p: PageId) => void;
  onToast: (msg: string) => void;
  search?: string;
}

export function Dashboard({ store, onNavigate, onToast, search = '' }: Props) {
  const { stats, transactions, profile, deleteTransaction } = store;
  const [mode, setMode] = useState<'income' | 'expense'>('income');
  const cur = profile.currency === 'INR' ? '₹' : '$';

  const visible = filterTransactions(transactions, search);
  const recent = visible.slice(0, 8);
  const list =
    mode === 'income'
      ? visible.filter((t) => t.type === 'income').slice(0, 6)
      : visible.filter((t) => t.type === 'expense').slice(0, 6);

  return (
    <div>
      <div className="hero-banner">
        <div>
          <h2>Manage Your Money. Track Your Growth.</h2>
          <p>
            Expense Meter helps users track income, monitor expenses, analyze spending habits, and
            build better financial management practices through simple and visual financial
            insights.
          </p>
          <div className="flow-pills">
            <span className="flow-pill">Income</span>
            <span className="flow-pill">→ Expense</span>
            <span className="flow-pill">→ Savings</span>
            <span className="flow-pill">→ Financial Growth</span>
          </div>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn btn-green" onClick={() => onNavigate('income')}>
            Add Income
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('expenses')}>
            Add Expense
          </button>
        </div>
      </div>

      <div className="summary-grid cols-4 stagger">
        <div className="summary-card solid">
          <div className="card-icon-wrap blue">
            <Wallet size={18} />
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            Total Balance
          </div>
          <div className="amount">
            <AnimatedNumber value={stats.balance} prefix={cur} />
          </div>
          <div className="label" style={{ marginTop: 4 }}>
            {stats.savingsPct >= 0 ? '+' : ''}
            {stats.savingsPct.toFixed(1)}% savings rate · this month net{' '}
            {stats.netChange >= 0 ? '+' : ''}
            {cur}
            {stats.netChange.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="summary-card solid">
          <div className="card-icon-wrap green">
            <ArrowUpRight size={18} />
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            Total Income
          </div>
          <div className="amount">
            <AnimatedNumber value={stats.income} prefix={cur} />
          </div>
          <div className="label" style={{ marginTop: 4 }}>
            Top: {stats.topIncome} ·{' '}
            {stats.incomeGrowthPct >= 0 ? '+' : ''}
            {stats.incomeGrowthPct.toFixed(0)}% MoM
          </div>
        </div>
        <div className="summary-card solid">
          <div className="card-icon-wrap red">
            <ArrowDownRight size={18} />
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            Total Expense
          </div>
          <div className="amount">
            <AnimatedNumber value={stats.expense} prefix={cur} />
          </div>
          <div className="label" style={{ marginTop: 4 }}>
            Top: {stats.topExpense} ·{' '}
            {stats.expenseGrowthPct >= 0 ? '+' : ''}
            {stats.expenseGrowthPct.toFixed(0)}% MoM
          </div>
        </div>
        <div className="summary-card solid">
          <div className="card-icon-wrap purple">
            <PiggyBank size={18} />
          </div>
          <div className="label" style={{ marginBottom: 4 }}>
            Savings
          </div>
          <div className="amount">
            <AnimatedNumber value={Math.max(0, stats.income - stats.expense)} prefix={cur} />
          </div>
          <div className="label" style={{ marginTop: 4 }}>
            {stats.savingsPct.toFixed(1)}% of income
          </div>
        </div>
      </div>

      <div className="toggle-wrap anim-slide-up">
        <h2 style={{ fontSize: 16, fontWeight: 650 }}>Financial Overview</h2>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      <TogglePanel mode={mode}>
        <div className="summary-grid cols-4 stagger" style={{ marginBottom: 20 }}>
          {mode === 'income' ? (
            <>
              <div className="summary-card solid">
                <div className="label">Total Income</div>
                <div className="amount" style={{ color: '#059669' }}>
                  <AnimatedNumber value={stats.income} prefix={cur} />
                </div>
              </div>
              <div className="summary-card solid">
                <div className="label">Income Sources</div>
                <div className="amount">
                  <AnimatedNumber
                    value={Object.keys(stats.byIncomeSource).length}
                    decimals={0}
                    duration={400}
                  />
                </div>
              </div>
              <div className="summary-card solid">
                <div className="label">Monthly Growth</div>
                <div className="amount" style={{ color: '#059669' }}>
                  <AnimatedNumber value={stats.monthIncome} prefix={cur} />
                </div>
              </div>
              <div className="summary-card solid">
                <div className="label">Top Source</div>
                <div className="amount" style={{ fontSize: 16 }}>
                  {stats.topIncome}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="summary-card solid">
                <div className="label">Total Spending</div>
                <div className="amount" style={{ color: '#ea580c' }}>
                  <AnimatedNumber value={stats.expense} prefix={cur} />
                </div>
              </div>
              <div className="summary-card solid">
                <div className="label">Expense Categories</div>
                <div className="amount">
                  <AnimatedNumber
                    value={Object.keys(stats.byCategory).length}
                    decimals={0}
                    duration={400}
                  />
                </div>
              </div>
              <div className="summary-card solid">
                <div className="label">Budget Usage</div>
                <div className="amount">
                  <AnimatedNumber
                    value={
                      store.monthlyBudget > 0
                        ? Math.min(100, (stats.monthExpense / store.monthlyBudget) * 100)
                        : 0
                    }
                    decimals={0}
                    suffix="%"
                    duration={500}
                  />
                </div>
              </div>
              <div className="summary-card solid">
                <div className="label">Highest Category</div>
                <div className="amount" style={{ fontSize: 16 }}>
                  {stats.topExpense}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="charts-grid" key={`charts-${stats.revision}`}>
          <div className="chart-panel anim-slide-up">
            <h3>Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                  }}
                />
                <Bar
                  dataKey="income"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Income"
                  isAnimationActive
                  animationDuration={900}
                  animationBegin={100}
                  animationEasing="ease-out"
                />
                <Bar
                  dataKey="expense"
                  fill="#f97316"
                  radius={[4, 4, 0, 0]}
                  name="Expense"
                  isAnimationActive
                  animationDuration={900}
                  animationBegin={220}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="panel anim-slide-up anim-delay-1">
            <div className="panel-header">
              <h2>{mode === 'income' ? 'Recent Income Transactions' : 'Recent Expenses'}</h2>
            </div>
            <div className="activity-list stagger-fast">
              {list.map((t) => (
                <div className="activity-item" key={`${mode}-${t.id}`}>
                  <div className={`activity-icon ${t.type}`}>
                    {t.type === 'income' ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                  </div>
                  <div className="activity-meta">
                    <div className="title">{t.title}</div>
                    <div className="sub">
                      {t.category} · {formatShortDate(t.date)}
                    </div>
                  </div>
                  <div className={`activity-amount ${t.type}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {cur}
                    {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
              {list.length === 0 && <div className="empty-state">No transactions yet</div>}
            </div>
          </div>
        </div>
      </TogglePanel>

      <div className="panel anim-slide-up anim-delay-2" style={{ marginTop: 14 }}>
        <div className="panel-header">
          <h2>Recent Transactions</h2>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate('transactions')}
          >
            View all
          </button>
        </div>
        <div className="activity-list stagger-fast">
          {recent.map((t) => (
            <div className="activity-item" key={t.id}>
              <div className={`activity-icon ${t.type}`}>
                {t.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
              <div className="activity-meta">
                <div className="title">{t.title}</div>
                <div className="sub">
                  {formatShortDate(t.date)} · {t.paymentMethod}
                </div>
              </div>
              <div className={`activity-amount ${t.type}`}>
                {t.type === 'income' ? '+' : '-'}
                {cur}
                {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="activity-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate('transactions')}
                  aria-label="View"
                >
                  <Eye size={14} />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => onNavigate(t.type === 'income' ? 'income' : 'expenses')}
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    deleteTransaction(t.id);
                    onToast('Transaction deleted');
                  }}
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
