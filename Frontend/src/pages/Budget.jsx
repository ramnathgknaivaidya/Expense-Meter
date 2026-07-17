import { useState, useEffect } from 'react';
import api from '../api/client';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const MOCK_BUDGETS = [
  { id: 'b1', category: 'Food', limitAmount: 6000, spent: 5200, month: 7, year: 2026 },
  { id: 'b2', category: 'Transport', limitAmount: 3000, spent: 2800, month: 7, year: 2026 },
  { id: 'b3', category: 'Shopping', limitAmount: 5000, spent: 3200, month: 7, year: 2026 },
  { id: 'b4', category: 'Entertainment', limitAmount: 2000, spent: 1600, month: 7, year: 2026 },
  { id: 'b5', category: 'Bills', limitAmount: 4000, spent: 3800, month: 7, year: 2026 },
];

const BUDGET_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Education', 'Healthcare', 'Housing', 'Investment', 'Other'];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBudget, setNewBudget] = useState({ category: 'Food', limitAmount: '' });
  const [adding, setAdding] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    async function fetchBudgets() {
      setLoading(true);
      try {
        const res = await api.get('/budget', { params: { month: currentMonth, year: currentYear } });
        const data = res.data.budgets || res.data || [];
        setBudgets(data.length > 0 ? data : MOCK_BUDGETS);
      } catch (err) {
        console.warn('API offline, using mock budgets');
        setBudgets(MOCK_BUDGETS);
      } finally {
        setLoading(false);
      }
    }
    fetchBudgets();
  }, []);

  const totalBudget = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const healthPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const getBudgetHealth = () => {
    if (healthPercent >= 90) return { label: 'Critical', color: 'var(--red)', emoji: '🔴' };
    if (healthPercent >= 70) return { label: 'Warning', color: 'var(--orange)', emoji: '🟡' };
    return { label: 'Healthy', color: 'var(--green)', emoji: '🟢' };
  };
  const health = getBudgetHealth();

  const getProgressClass = (spent, limit) => {
    const pct = (spent / limit) * 100;
    if (pct >= 90) return 'danger';
    if (pct >= 70) return 'warning';
    return 'safe';
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.limitAmount || Number(newBudget.limitAmount) <= 0) return;

    setAdding(true);
    try {
      const payload = {
        category: newBudget.category,
        limitAmount: Number(newBudget.limitAmount),
        month: currentMonth,
        year: currentYear,
      };
      const res = await api.post('/budget', payload);
      setBudgets(prev => [...prev, { ...payload, id: res.data._id || `b_new_${Date.now()}`, spent: 0 }]);
    } catch (err) {
      // Offline fallback: add locally
      setBudgets(prev => [...prev, {
        id: `b_local_${Date.now()}`,
        category: newBudget.category,
        limitAmount: Number(newBudget.limitAmount),
        spent: 0,
        month: currentMonth,
        year: currentYear,
      }]);
    } finally {
      setNewBudget({ category: 'Food', limitAmount: '' });
      setAdding(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    try {
      await api.delete(`/budget/${id}`);
    } catch (err) {
      // Offline — just remove locally
    }
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Budget Management</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Set spending limits and track your budget utilization</p>
      </div>

      {/* Summary Cards */}
      <div className="grid-4" style={{ marginBottom: '22px' }}>
        <div className="card summary-card" style={{ borderTop: '4px solid var(--blue)' }}>
          <div className="sc-icon icon-blue" style={{ marginBottom: '8px' }}>💰</div>
          <div className="sc-label">Total Budget</div>
          <div className="sc-value" style={{ fontSize: '1.3rem' }}>{formatCurrency(totalBudget)}</div>
        </div>
        <div className="card summary-card" style={{ borderTop: '4px solid var(--orange)' }}>
          <div className="sc-icon icon-orange" style={{ marginBottom: '8px' }}>💸</div>
          <div className="sc-label">Total Spent</div>
          <div className="sc-value" style={{ fontSize: '1.3rem' }}>{formatCurrency(totalSpent)}</div>
        </div>
        <div className="card summary-card" style={{ borderTop: '4px solid var(--green)' }}>
          <div className="sc-icon icon-green" style={{ marginBottom: '8px' }}>🏦</div>
          <div className="sc-label">Remaining</div>
          <div className="sc-value" style={{ fontSize: '1.3rem', color: remaining >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {formatCurrency(remaining)}
          </div>
        </div>
        <div className="card summary-card" style={{ borderTop: `4px solid ${health.color}` }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{health.emoji}</div>
          <div className="sc-label">Budget Health</div>
          <div className="sc-value" style={{ fontSize: '1.3rem', color: health.color }}>{health.label}</div>
          <div className="sc-change" style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>{healthPercent}% utilized</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Budget Items List */}
        <div className="card">
          <div className="card-header">
            <h3>Category Budgets</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{budgets.length} categories</span>
          </div>

          {budgets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <p>No budgets set. Add one to start tracking.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {budgets.map(budget => {
                const pct = Math.min(Math.round((budget.spent / budget.limitAmount) * 100), 100);
                const fillClass = getProgressClass(budget.spent, budget.limitAmount);
                const remaining = budget.limitAmount - budget.spent;

                return (
                  <div key={budget.id} style={{ paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{budget.category}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.limitAmount)}
                        </span>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleDeleteBudget(budget.id)}
                          style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="budget-progress">
                      <div className="bp-header">
                        <span style={{ color: remaining >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
                          {remaining >= 0 ? `${formatCurrency(remaining)} left` : `${formatCurrency(Math.abs(remaining))} over`}
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="bp-bar">
                        <div className={`bp-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add New Budget Form */}
        <div className="card">
          <div className="card-header">
            <h3>Add New Budget</h3>
          </div>
          <form onSubmit={handleAddBudget}>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget(prev => ({ ...prev, category: e.target.value }))}
              >
                {BUDGET_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Monthly Limit (₹)</label>
              <input
                type="number"
                placeholder="e.g. 5000"
                value={newBudget.limitAmount}
                onChange={(e) => setNewBudget(prev => ({ ...prev, limitAmount: e.target.value }))}
                min="1"
                required
              />
            </div>
            <div className="form-group" style={{ marginTop: '8px' }}>
              <label style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                Period: {new Date(currentYear, currentMonth - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={adding} style={{ width: '100%', justifyContent: 'center' }}>
              {adding ? 'Adding...' : '+ Add Budget'}
            </button>
          </form>

          {/* Budget Tips */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--blue-light)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--blue)' }}>💡 Budget Tips</h4>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Follow the 50/30/20 rule: Needs / Wants / Savings</li>
              <li>Review budgets weekly to stay on track</li>
              <li>Adjust limits based on actual spending patterns</li>
              <li>Set alerts at 80% utilization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
