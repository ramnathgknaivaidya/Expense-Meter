import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, FileText } from 'lucide-react';
import type { AppStore } from '../data/store';
import { EXPENSE_CATEGORIES } from '../data/seed';
import { AnimatedNumber } from '../components/AnimatedNumber';

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

interface Props {
  store: AppStore;
  onToast: (msg: string) => void;
}

export function Analytics({ store, onToast }: Props) {
  const { stats, profile, exportCSV } = store;
  const cur = profile.currency === 'INR' ? '₹' : '$';

  const pieData = EXPENSE_CATEGORIES.map((c) => ({
    name: c,
    value: stats.byCategory[c] || 0,
  })).filter((d) => d.value > 0);

  const topAreas = [...pieData].sort((a, b) => b.value - a.value).slice(0, 5);

  const exportPDF = () => {
    // Lightweight printable report (PDF via browser print)
    const w = window.open('', '_blank');
    if (!w) {
      onToast('Allow popups to export PDF report');
      return;
    }
    w.document.write(`
      <html><head><title>Expense Meter Report</title>
      <style>
        body{font-family:system-ui;padding:32px;color:#111}
        h1{margin:0 0 8px} .meta{color:#666;margin-bottom:24px}
        .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:24px}
        .card{border:1px solid #e5e7eb;border-radius:12px;padding:16px}
        .label{font-size:12px;color:#6b7280}.val{font-size:22px;font-weight:700;margin-top:4px}
        table{width:100%;border-collapse:collapse} th,td{text-align:left;padding:8px;border-bottom:1px solid #eee;font-size:13px}
      </style></head><body>
      <h1>Monthly Financial Report</h1>
      <div class="meta">Expense Meter · Generated ${new Date().toLocaleString()}</div>
      <div class="grid">
        <div class="card"><div class="label">Total Income</div><div class="val">${cur}${stats.income.toFixed(2)}</div></div>
        <div class="card"><div class="label">Total Expenses</div><div class="val">${cur}${stats.expense.toFixed(2)}</div></div>
        <div class="card"><div class="label">Savings</div><div class="val">${cur}${Math.max(0, stats.income - stats.expense).toFixed(2)}</div></div>
      </div>
      <h2>Highest Spending Areas</h2>
      <table><thead><tr><th>Category</th><th>Amount</th></tr></thead>
      <tbody>${topAreas.map((t) => `<tr><td>${t.name}</td><td>${cur}${t.value.toFixed(2)}</td></tr>`).join('')}</tbody></table>
      <script>window.print()</script>
      </body></html>
    `);
    w.document.close();
    onToast('PDF report opened for print/save');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Meaningful financial insights through charts, reports, and comparisons</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-outline" onClick={exportPDF}>
            <FileText size={15} />
            PDF Report
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              exportCSV();
              onToast('CSV data exported');
            }}
          >
            <Download size={15} />
            CSV Data
          </button>
        </div>
      </div>

      <div className="summary-grid cols-4 stagger">
        <div className="summary-card solid">
          <div className="label">Total Income</div>
          <div className="amount" style={{ color: '#059669' }}>
            <AnimatedNumber value={stats.income} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Total Expenses</div>
          <div className="amount" style={{ color: '#ea580c' }}>
            <AnimatedNumber value={stats.expense} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Savings</div>
          <div className="amount">
            <AnimatedNumber value={Math.max(0, stats.income - stats.expense)} prefix={cur} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Savings Rate</div>
          <div className="amount">
            <AnimatedNumber value={stats.savingsPct} decimals={1} suffix="%" duration={600} />
          </div>
        </div>
      </div>

      <div className="charts-grid" key={`charts-${stats.revision}`}>
        <div className="chart-panel">
          <h3>Income vs Expense Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Earnings"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationDuration={900}
                animationBegin={80}
              />
              <Bar
                dataKey="expense"
                fill="#f97316"
                name="Spending"
                radius={[4, 4, 0, 0]}
                isAnimationActive
                animationDuration={900}
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-panel anim-slide-up anim-delay-1">
          <h3>Spending Analysis</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                label
                isAnimationActive
                animationDuration={950}
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

      <div className="charts-grid">
        <div className="chart-panel anim-slide-up">
          <h3>Spending Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expense"
                isAnimationActive
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                name="Income"
                isAnimationActive
                animationDuration={1000}
                animationBegin={120}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="panel anim-slide-up anim-delay-1">
          <div className="panel-header">
            <h2>Highest Spending Areas</h2>
          </div>
          <div className="activity-list stagger-fast">
            {topAreas.map((a, i) => (
              <div className="activity-item" key={a.name}>
                <div
                  className="activity-icon expense"
                  style={{ background: `${PIE_COLORS[i]}22`, color: PIE_COLORS[i] }}
                >
                  {i + 1}
                </div>
                <div className="activity-meta">
                  <div className="title">{a.name}</div>
                  <div className="sub">
                    {stats.expense > 0
                      ? ((a.value / stats.expense) * 100).toFixed(1)
                      : 0}
                    % of total spending
                  </div>
                </div>
                <div className="activity-amount expense">
                  {cur}
                  {a.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
            {topAreas.length === 0 && <div className="empty-state">No spending data yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
