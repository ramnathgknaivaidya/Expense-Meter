import { useState } from 'react';
import { Shield, Laptop, Plane, TrendingUp, Target } from 'lucide-react';
import type { AppStore } from '../data/store';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface Props {
  store: AppStore;
  onToast: (msg: string) => void;
}

const ICONS: Record<string, typeof Shield> = {
  shield: Shield,
  laptop: Laptop,
  plane: Plane,
  trending: TrendingUp,
};

export function Budget({ store, onToast }: Props) {
  const {
    budgets,
    goals,
    monthlyBudget,
    stats,
    profile,
    setMonthlyBudget,
    updateBudget,
    updateGoal,
  } = store;
  const cur = profile.currency === 'INR' ? '₹' : '$';
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));

  const usagePct =
    monthlyBudget > 0 ? Math.min(100, (stats.monthExpense / monthlyBudget) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Budget Planning & Goals</h1>
          <p>Create financial discipline through budget limits and savings goals</p>
        </div>
      </div>

      <div className="summary-grid stagger" style={{ gridTemplateColumns: '1.2fr 1fr 1fr' }}>
        <div className="summary-card solid">
          <div className="label">Monthly Budget</div>
          <div className="amount">
            <AnimatedNumber value={monthlyBudget} prefix={cur} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--bg-main)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                const n = Number(budgetInput);
                if (n > 0) {
                  setMonthlyBudget(n);
                  onToast('Monthly budget updated');
                }
              }}
            >
              Set limit
            </button>
          </div>
          <div className="progress-track" style={{ marginTop: 14 }}>
            <div
              key={`usage-${usagePct.toFixed(0)}`}
              className={`progress-fill ${usagePct > 90 ? 'danger' : usagePct > 70 ? 'warn' : ''}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <div className="label" style={{ marginTop: 6 }}>
            Spent {cur}
            {stats.monthExpense.toLocaleString()} ·{' '}
            <AnimatedNumber value={usagePct} decimals={0} suffix="% used" duration={500} />
          </div>
        </div>
        <div className="summary-card solid">
          <div className="label">Remaining</div>
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
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Category Budget</h2>
      <div className="cards-grid stagger" style={{ marginBottom: 28 }}>
        {budgets.map((b) => {
          const spent = stats.byCategoryMonth[b.category] || 0;
          const pct = b.limit > 0 ? Math.min(100, (spent / b.limit) * 100) : 0;
          return (
            <div className="cat-card" key={b.category}>
              <h3>{b.category}</h3>
              <div className="desc">
                Spent {cur}
                {spent.toLocaleString()} / Limit {cur}
                {b.limit.toLocaleString()}
              </div>
              <div className="progress-track">
                <div
                  key={`${b.category}-${pct.toFixed(0)}`}
                  className={`progress-fill ${pct > 90 ? 'danger' : pct > 70 ? 'warn' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="pct" style={{ marginTop: 6 }}>
                Progress {pct.toFixed(0)}%
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <input
                  type="number"
                  defaultValue={b.limit}
                  onBlur={(e) => {
                    const n = Number(e.target.value);
                    if (n > 0 && n !== b.limit) {
                      updateBudget(b.category, n);
                      onToast(`${b.category} limit updated`);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-primary)',
                    fontSize: 12,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Savings Goals</h2>
      <div className="goals-grid stagger">
        {goals.map((g) => {
          const Icon = ICONS[g.icon] || TargetFallback;
          const pct = g.target > 0 ? Math.min(100, (g.saved / g.target) * 100) : 0;
          const remaining = Math.max(0, g.target - g.saved);
          return (
            <div className="goal-card" key={g.id}>
              <h3>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#d1fae5',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#059669',
                  }}
                >
                  <Icon size={16} />
                </span>
                {g.name}
              </h3>
              <div className="progress-track">
                <div
                  key={`${g.id}-${g.saved}`}
                  className="progress-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="goal-stats">
                <span>
                  Saved {cur}
                  {g.saved.toLocaleString()}
                </span>
                <span>{pct.toFixed(0)}%</span>
              </div>
              <div className="goal-stats">
                <span>
                  Target {cur}
                  {g.target.toLocaleString()}
                </span>
                <span>
                  Left {cur}
                  {remaining.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    updateGoal(g.id, { saved: Math.min(g.target, g.saved + 1000) });
                    onToast(`Added ${cur}1,000 to ${g.name}`);
                  }}
                >
                  +{cur}1,000
                </button>
                <button
                  type="button"
                  className="btn btn-green btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => {
                    updateGoal(g.id, { saved: g.target });
                    onToast(`${g.name} completed!`);
                  }}
                >
                  Complete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TargetFallback() {
  return <Target size={16} strokeWidth={1.75} />;
}
