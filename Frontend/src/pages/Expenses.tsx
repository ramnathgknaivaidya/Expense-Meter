import { useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Legend,
} from 'recharts';
import type { AppStore } from '../data/store';
import { EXPENSE_CATEGORIES, EXPENSE_PAYMENT_METHODS } from '../data/seed';
import { Modal } from '../components/Modal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { ExpenseCategoryIcon, ArrowDownRight } from '../components/icons';
import { formatShortDate } from '../utils/format';
import { filterTransactions } from '../utils/search';
import type { Transaction } from '../types';

const PIE_COLORS = [
  '#f97316',
  '#ef4444',
  '#eab308',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#84cc16',
  '#f43f5e',
  '#6366f1',
  '#64748b',
];

const CAT_META: Record<string, { desc: string }> = {
  Food: { desc: 'Restaurant, groceries, snacks' },
  Transport: { desc: 'Fuel, taxi, public transport' },
  Housing: { desc: 'Rent, maintenance' },
  Bills: { desc: 'Electricity, internet, subscriptions' },
  Shopping: { desc: 'Clothes, accessories' },
  Healthcare: { desc: 'Medicine, medical expenses' },
  Education: { desc: 'Courses, books' },
  Entertainment: { desc: 'Movies, games, events' },
  Travel: { desc: 'Trips and vacations' },
  Other: { desc: 'Miscellaneous expenses' },
};

interface Props {
  store: AppStore;
  onToast: (msg: string) => void;
  search?: string;
}

export function Expenses({ store, onToast, search = '' }: Props) {
  const {
    transactions,
    stats,
    profile,
    budgets,
    monthlyBudget,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = store;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'UPI',
    merchant: '',
    notes: '',
    receiptName: '',
  });

  const expenseTx = useMemo(
    () => filterTransactions(transactions.filter((t) => t.type === 'expense'), search),
    [transactions, search]
  );

  const catCards = EXPENSE_CATEGORIES.map((cat) => {
    const amount = stats.byCategory[cat] || 0;
    const pct = stats.expense > 0 ? (amount / stats.expense) * 100 : 0;
    return { cat, amount, pct, ...CAT_META[cat] };
  });

  const pieData = catCards
    .filter((c) => c.amount > 0)
    .map((c) => ({ name: c.cat, value: c.amount }));

  const budgetCompare = budgets.map((b) => ({
    category: b.category,
    planned: b.limit,
    actual: stats.byCategory[b.category] || 0,
  }));

  // Simple spending heatmap (last 28 days intensity)
  const heatmap = useMemo(() => {
    const days: { day: number; total: number }[] = [];
    const now = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const total = expenseTx
        .filter((t) => t.date === key && t.status !== 'Canceled')
        .reduce((s, t) => s + t.amount, 0);
      days.push({ day: d.getDate(), total });
    }
    const max = Math.max(1, ...days.map((d) => d.total));
    return days.map((d) => ({ ...d, intensity: d.total / max }));
  }, [expenseTx]);

  const openAdd = () => {
    setEditing(null);
    setForm({
      amount: '',
      category: 'Food',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'UPI',
      merchant: '',
      notes: '',
      receiptName: '',
    });
    setOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({
      amount: String(t.amount),
      category: t.category,
      date: t.date,
      paymentMethod: t.paymentMethod,
      merchant: t.merchant || '',
      notes: t.notes || t.description || '',
      receiptName: t.receiptName || '',
    });
    setOpen(true);
  };

  const save = (asDraft: boolean) => {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      onToast('Enter a valid amount');
      return;
    }
    const payload = {
      type: 'expense' as const,
      title: form.merchant || form.category,
      category: form.category,
      amount,
      date: form.date,
      paymentMethod: form.paymentMethod,
      account: 'Checking ...23456',
      methodLabel: `${form.paymentMethod} ****8821`,
      glCode: '5100 100',
      status: (asDraft ? 'Pending Review' : 'Completed') as Transaction['status'],
      merchant: form.merchant,
      notes: form.notes,
      description: form.notes,
      receiptName: form.receiptName,
    };
    if (editing) {
      updateTransaction(editing.id, payload);
      onToast(asDraft ? 'Draft saved' : 'Expense updated — charts & budgets refreshed');
    } else {
      const { alerts } = addTransaction(payload);
      onToast(asDraft ? 'Draft saved' : 'Expense added — totals, charts & budgets updated');
      alerts.forEach((a, i) => setTimeout(() => onToast(a), 900 + i * 700));
    }
    setOpen(false);
  };

  const cur = profile.currency === 'INR' ? '₹' : '$';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Control Your Spending</h1>
          <p>Record, categorize, and analyze your expense habits</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          + Add Expense
        </button>
      </div>

      <div className="summary-grid cols-4 stagger">
        <div className="summary-card solid">
          <div className="label">Total Expense</div>
          <div className="amount" style={{ color: '#ea580c' }}>
            <AnimatedNumber value={stats.monthExpense} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Remaining Budget</div>
          <div
            className="amount"
            style={{ color: stats.remainingBudget >= 0 ? '#059669' : '#dc2626' }}
          >
            <AnimatedNumber value={stats.remainingBudget} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Daily Average</div>
          <div className="amount">
            <AnimatedNumber value={stats.dailyAvg} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Highest Spending Category</div>
          <div className="amount" style={{ fontSize: 16 }}>
            {stats.topExpense}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Expense Categories</h2>
      <div className="cards-grid stagger">
        {catCards.map((c) => (
          <div className="cat-card" key={c.cat}>
            <div className="cat-icon">
              <ExpenseCategoryIcon name={c.cat} box={40} />
            </div>
            <h3>{c.cat}</h3>
            <div className="desc">{c.desc}</div>
            <div className="val">
              <AnimatedNumber value={c.amount} prefix={cur} duration={550} />
            </div>
            <div className="pct">{c.pct.toFixed(1)}% of spending</div>
            <div className="progress-track">
              <div
                className={`progress-fill ${c.pct > 40 ? 'warn' : ''}`}
                style={{ width: `${Math.min(100, c.pct)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid" key={`charts-${stats.revision}`}>
        <div className="chart-panel">
          <h3>Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                label
                isAnimationActive
                animationDuration={900}
                animationBegin={100}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-panel anim-slide-up anim-delay-1">
          <h3>Monthly Expense Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#f97316"
                strokeWidth={2}
                dot
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-panel anim-slide-up" style={{ marginBottom: 20 }}>
        <h3>Budget Comparison — Planned vs Actual</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={budgetCompare}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="planned"
              fill="#c7d2fe"
              name="Planned"
              radius={[3, 3, 0, 0]}
              isAnimationActive
              animationDuration={800}
            />
            <Bar
              dataKey="actual"
              fill="#f97316"
              name="Actual"
              radius={[3, 3, 0, 0]}
              isAnimationActive
              animationDuration={900}
              animationBegin={120}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-panel anim-slide-up" style={{ marginBottom: 20 }}>
        <h3>Spending Heatmap — Last 28 days</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(14, 1fr)',
            gap: 6,
            marginTop: 8,
          }}
        >
          {heatmap.map((d, i) => (
            <div
              key={i}
              className="heat-cell"
              title={`Day ${d.day}: ${cur}${d.total.toFixed(0)}`}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                background:
                  d.intensity === 0
                    ? 'var(--border)'
                    : `rgba(249, 115, 22, ${0.15 + d.intensity * 0.85})`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 10,
                color: d.intensity > 0.5 ? 'white' : 'var(--text-muted)',
                fontWeight: 500,
                animationDelay: `${i * 18}ms`,
              }}
            >
              {d.day}
            </div>
          ))}
        </div>
        <p style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
          Monthly budget: {cur}
          {monthlyBudget.toLocaleString()} · Remaining: {cur}
          {stats.remainingBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Recent Expenses</h2>
        </div>
        <div className="activity-list stagger-fast">
          {expenseTx.map((t) => (
            <div className="activity-item" key={t.id}>
              <div className="activity-icon expense">
                <ArrowDownRight size={16} strokeWidth={2} />
              </div>
              <div className="activity-meta">
                <div className="title">{t.title}</div>
                <div className="sub">
                  {t.category} · {formatShortDate(t.date)} · {t.paymentMethod}
                </div>
              </div>
              <div className="activity-amount expense">
                -{cur}
                {t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="activity-actions" style={{ opacity: 1 }}>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEdit(t)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    deleteTransaction(t.id);
                    onToast('Expense deleted');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? 'Edit Expense' : 'Add Expense'}
        onClose={() => setOpen(false)}
      >
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder={`${cur}____`}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              {EXPENSE_PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Merchant Name</label>
          <input
            type="text"
            value={form.merchant}
            onChange={(e) => setForm({ ...form, merchant: e.target.value })}
            placeholder="Where did you spend?"
          />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Optional notes"
          />
        </div>
        <div className="form-group">
          <label>Receipt Upload</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) =>
              setForm({ ...form, receiptName: e.target.files?.[0]?.name || '' })
            }
          />
          {form.receiptName && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Attached: {form.receiptName}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={() => save(true)}>
            Save Draft
          </button>
          <button type="button" className="btn btn-primary" onClick={() => save(false)}>
            Add Expense
          </button>
        </div>
      </Modal>
    </div>
  );
}
