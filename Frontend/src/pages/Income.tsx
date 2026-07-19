import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import type { AppStore } from '../data/store';
import { INCOME_PAYMENT_METHODS, INCOME_SOURCES } from '../data/seed';
import { Modal } from '../components/Modal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { IncomeCategoryIcon, ArrowUpRight } from '../components/icons';
import { formatShortDate } from '../utils/format';
import { filterTransactions } from '../utils/search';
import type { Transaction } from '../types';

const PIE_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#a7f3d0', '#065f46'];

const SOURCE_META: Record<string, { desc: string }> = {
  Salary: { desc: 'Regular employment income' },
  Freelance: { desc: 'Independent project earnings' },
  Business: { desc: 'Business revenue tracking' },
  Investment: { desc: 'Returns from investments' },
  Bonus: { desc: 'Extra earnings' },
  'Rental Income': { desc: 'Property income' },
  Other: { desc: 'Additional sources' },
};

interface Props {
  store: AppStore;
  onToast: (msg: string) => void;
  search?: string;
}

export function Income({ store, onToast, search = '' }: Props) {
  const { transactions, stats, profile, addTransaction, updateTransaction, deleteTransaction } =
    store;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Bank Transfer',
    description: '',
  });

  const incomeTx = useMemo(
    () => filterTransactions(transactions.filter((t) => t.type === 'income'), search),
    [transactions, search]
  );

  const total = stats.income;
  const monthly = stats.monthIncome;
  const avg =
    incomeTx.length > 0
      ? incomeTx.reduce((s, t) => s + t.amount, 0) /
        Math.max(1, new Set(incomeTx.map((t) => t.date.slice(0, 7))).size)
      : 0;

  const sourceCards = INCOME_SOURCES.map((src) => {
    const amount = stats.byIncomeSource[src] || 0;
    const pct = total > 0 ? (amount / total) * 100 : 0;
    return { src, amount, pct, ...SOURCE_META[src] };
  });

  const pieData = sourceCards
    .filter((s) => s.amount > 0)
    .map((s) => ({ name: s.src, value: s.amount }));

  const openAdd = () => {
    setEditing(null);
    setForm({
      amount: '',
      source: 'Salary',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Bank Transfer',
      description: '',
    });
    setOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setForm({
      amount: String(t.amount),
      source: t.category,
      date: t.date,
      paymentMethod: t.paymentMethod,
      description: t.description || '',
    });
    setOpen(true);
  };

  const save = () => {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      onToast('Enter a valid amount');
      return;
    }
    const payload = {
      type: 'income' as const,
      title: form.source,
      category: form.source,
      amount,
      date: form.date,
      paymentMethod: form.paymentMethod,
      account: 'Checking ...23456',
      methodLabel: `${form.paymentMethod} ****2345`,
      glCode: '4000 001',
      status: 'Completed' as const,
      description: form.description,
    };
    if (editing) {
      updateTransaction(editing.id, payload);
      onToast('Income updated — charts & balance refreshed');
    } else {
      const { alerts } = addTransaction(payload);
      onToast('Income saved — totals, charts & goals updated');
      alerts.forEach((a, i) => setTimeout(() => onToast(a), 900 + i * 700));
    }
    setOpen(false);
  };

  const cur = profile.currency === 'INR' ? '₹' : '$';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Track Your Income</h1>
          <p>Record, categorize, and analyze all incoming money sources</p>
        </div>
        <button type="button" className="btn btn-green" onClick={openAdd}>
          + Add Income
        </button>
      </div>

      <div className="summary-grid cols-4 stagger">
        <div className="summary-card solid">
          <div className="label">Total Income</div>
          <div className="amount" style={{ color: '#059669' }}>
            <AnimatedNumber value={total} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Monthly Income</div>
          <div className="amount">
            <AnimatedNumber value={monthly} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Average Income</div>
          <div className="amount">
            <AnimatedNumber value={avg} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Top Income Source</div>
          <div className="amount" style={{ fontSize: 16 }}>
            {stats.topIncome}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Income Categories</h2>
      <div className="cards-grid stagger">
        {sourceCards.map((s) => (
          <div className="cat-card" key={s.src}>
            <div className="cat-icon">
              <IncomeCategoryIcon name={s.src} box={40} />
            </div>
            <h3>{s.src}</h3>
            <div className="desc">{s.desc}</div>
            <div className="val">
              <AnimatedNumber value={s.amount} prefix={cur} duration={550} />
            </div>
            <div className="pct">{s.pct.toFixed(1)}% contribution</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${Math.min(100, s.pct)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid" key={`charts-${stats.revision}`}>
        <div className="chart-panel">
          <h3>Income Trend — Monthly growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.monthlyTrend}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                fill="url(#incGrad)"
                strokeWidth={2}
                isAnimationActive
                animationDuration={1000}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-panel anim-slide-up anim-delay-1">
          <h3>Source Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                isAnimationActive
                animationDuration={900}
                animationBegin={150}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-panel anim-slide-up" style={{ marginBottom: 20 }}>
        <h3>Yearly Comparison — Month-wise income</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
            <Tooltip />
            <Bar
              dataKey="income"
              fill="#059669"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel anim-slide-up">
        <div className="panel-header">
          <h2>Income Transactions</h2>
        </div>
        <div className="activity-list stagger-fast">
          {incomeTx.map((t) => (
            <div className="activity-item" key={t.id}>
              <div className="activity-icon income">
                <ArrowUpRight size={16} strokeWidth={2} />
              </div>
              <div className="activity-meta">
                <div className="title">{t.title}</div>
                <div className="sub">
                  {formatShortDate(t.date)} · {t.paymentMethod}
                </div>
              </div>
              <div className="activity-amount income">
                +{cur}
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
                    onToast('Income deleted');
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {incomeTx.length === 0 && <div className="empty-state">No income recorded yet</div>}
        </div>
      </div>

      <Modal
        open={open}
        title={editing ? 'Edit Income' : 'Add Income'}
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
          <label>Income Source</label>
          <select
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          >
            {INCOME_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
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
              {INCOME_PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional notes"
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-green" onClick={save}>
            Save Income
          </button>
        </div>
      </Modal>
    </div>
  );
}
