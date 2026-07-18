import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { budgetAPI, savingsGoalAPI } from '../api/client';

// Currency Formatter (INR)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Category Emojis
const getCategoryIcon = (category) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('food')) return '🍔';
  if (cat.includes('transport')) return '🚗';
  if (cat.includes('housing')) return '🏠';
  if (cat.includes('bill')) return '💡';
  if (cat.includes('shopping')) return '🛍️';
  if (cat.includes('health')) return '🏥';
  if (cat.includes('education')) return '🎓';
  if (cat.includes('entertainment')) return '🍿';
  if (cat.includes('travel')) return '✈️';
  return '💸';
};

// Savings Goal SVG Icons
const GoalIcon = ({ type }) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('emergency')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (t.includes('device') || t.includes('laptop') || t.includes('phone')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="2" y1="20" x2="22" y2="20" />
        <line x1="12" y1="17" x2="12" y2="20" />
      </svg>
    );
  }
  if (t.includes('vacation') || t.includes('travel') || t.includes('trip')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    );
  }
  if (t.includes('invest')) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <path d="M2 20h20" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
};

const DEFAULT_GOALS = [
  { id: 'g_1', title: 'Emergency Fund', targetAmount: 50000, savedAmount: 15000, description: '3-6 months of living expenses' },
  { id: 'g_2', title: 'New Device', targetAmount: 80000, savedAmount: 24000, description: 'Next-gen laptop and phone upgrade' },
  { id: 'g_3', title: 'Vacation', targetAmount: 120000, savedAmount: 40000, description: 'Annual trip plan' },
  { id: 'g_4', title: 'Investment Goal', targetAmount: 2000000, savedAmount: 500000, description: 'Long-term equity & index funds' }
];

const DEFAULT_BUDGETS = [
  { id: 'b_1', category: 'Food', limitAmount: 6000, spentAmount: 4000 },
  { id: 'b_2', category: 'Transport', limitAmount: 3000, spentAmount: 2000 },
  { id: 'b_3', category: 'Shopping', limitAmount: 5000, spentAmount: 1200 }
];

export default function Budget() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [monthlyLimit, setMonthlyLimit] = useState(50000);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [toast, setToast] = useState(null);

  // Modal states
  const [monthlyLimitModal, setMonthlyLimitModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [savingsGoalModal, setSavingsGoalModal] = useState(false);
  const [addSavingsModal, setAddSavingsModal] = useState(false);

  // Form states
  const [tempLimit, setTempLimit] = useState('');
  const [categoryForm, setCategoryForm] = useState({ category: 'Food', limitAmount: '' });
  const [goalForm, setGoalForm] = useState({ title: '', targetAmount: '', savedAmount: '', description: '' });
  const [savingsTopUp, setSavingsTopUp] = useState({ id: '', amount: '' });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    try {
      // Try to load from APIs
      const budgetRes = await budgetAPI.getAll({ month: currentMonth, year: currentYear });
      const budgetStatusRes = await budgetAPI.getStatus({ month: currentMonth, year: currentYear });
      const savingsRes = await savingsGoalAPI.getAll();

      setBudgets(budgetRes.data || []);
      setTotalSpent(budgetStatusRes.data?.summary?.totalSpent || 0);
      setSavingsGoals(savingsRes.data || []);

      // Overall monthly limit is fetched/computed from budget summary or profile setting, default to 50000
      const storedLimit = localStorage.getItem('monthly_spending_limit');
      if (storedLimit) setMonthlyLimit(Number(storedLimit));

      setIsMockMode(false);
    } catch (error) {
      console.warn('⚠️ Server offline, falling back to LocalStorage Mock Mode.');
      
      // Load offline budgets
      const localBuds = localStorage.getItem('local_budgets');
      if (localBuds) {
        setBudgets(JSON.parse(localBuds));
      } else {
        setBudgets(DEFAULT_BUDGETS);
        localStorage.setItem('local_budgets', JSON.stringify(DEFAULT_BUDGETS));
      }

      // Load offline savings goals
      const localGoals = localStorage.getItem('local_savings_goals');
      if (localGoals) {
        setSavingsGoals(JSON.parse(localGoals));
      } else {
        setSavingsGoals(DEFAULT_GOALS);
        localStorage.setItem('local_savings_goals', JSON.stringify(DEFAULT_GOALS));
      }

      // Load offline monthly spending limit
      const storedLimit = localStorage.getItem('monthly_spending_limit') || '50000';
      setMonthlyLimit(Number(storedLimit));

      // Calculate total spent based on local expenses
      const localExps = localStorage.getItem('local_expenses');
      let calculatedSpent = 0;
      let calculatedCategorySpent = {};

      if (localExps) {
        const parsedExps = JSON.parse(localExps);
        parsedExps.forEach((exp) => {
          const expDate = new Date(exp.date);
          if (expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear) {
            calculatedSpent += Number(exp.amount);
            calculatedCategorySpent[exp.category] = (calculatedCategorySpent[exp.category] || 0) + Number(exp.amount);
          }
        });
      }
      setTotalSpent(calculatedSpent);

      // Re-map spentAmount to current budgets
      setBudgets(prev => {
        const updated = prev.map(b => ({
          ...b,
          spentAmount: calculatedCategorySpent[b.category] || 0
        }));
        localStorage.setItem('local_budgets', JSON.stringify(updated));
        return updated;
      });

      setIsMockMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Overall Monthly Limit Handling
  const handleSaveMonthlyLimit = () => {
    const limit = Number(tempLimit);
    if (isNaN(limit) || limit <= 0) {
      showToast('error', 'Please enter a valid spending limit.');
      return;
    }
    setMonthlyLimit(limit);
    localStorage.setItem('monthly_spending_limit', limit);
    setMonthlyLimitModal(false);
    showToast('success', 'Monthly spending limit updated!');
  };

  // Add/Edit Category Budget
  const handleSaveCategoryBudget = async (e) => {
    e.preventDefault();
    const limit = Number(categoryForm.limitAmount);
    if (isNaN(limit) || limit <= 0) {
      showToast('error', 'Please enter a valid limit amount.');
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (!isMockMode) {
      try {
        await budgetAPI.create({
          category: categoryForm.category,
          limitAmount: limit,
          month: currentMonth,
          year: currentYear
        });
        showToast('success', `${categoryForm.category} budget created!`);
        setCategoryModal(false);
        setCategoryForm({ category: 'Food', limitAmount: '' });
        loadData();
      } catch (err) {
        showToast('error', err.response?.data?.error || 'Failed to save budget.');
      }
    } else {
      // Mock Mode Save
      const exists = budgets.find(b => b.category === categoryForm.category);
      if (exists) {
        showToast('error', `Budget for ${categoryForm.category} already exists.`);
        return;
      }

      // Calculate current month's spent amount for this category
      const localExps = localStorage.getItem('local_expenses');
      let spent = 0;
      if (localExps) {
        JSON.parse(localExps).forEach((exp) => {
          const expDate = new Date(exp.date);
          if (exp.category === categoryForm.category && expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear) {
            spent += Number(exp.amount);
          }
        });
      }

      const newBudget = {
        id: 'mock_b_' + Date.now(),
        category: categoryForm.category,
        limitAmount: limit,
        spentAmount: spent
      };

      const updated = [...budgets, newBudget];
      setBudgets(updated);
      localStorage.setItem('local_budgets', JSON.stringify(updated));
      showToast('success', `${categoryForm.category} budget created locally!`);
      setCategoryModal(false);
      setCategoryForm({ category: 'Food', limitAmount: '' });
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!isMockMode) {
      try {
        await budgetAPI.delete(id);
        showToast('success', 'Budget deleted.');
        loadData();
      } catch (err) {
        showToast('error', 'Failed to delete budget.');
      }
    } else {
      const updated = budgets.filter(b => b.id !== id);
      setBudgets(updated);
      localStorage.setItem('local_budgets', JSON.stringify(updated));
      showToast('success', 'Budget deleted locally.');
    }
  };

  // Add/Edit Savings Goal
  const handleSaveSavingsGoal = async (e) => {
    e.preventDefault();
    const target = Number(goalForm.targetAmount);
    const saved = Number(goalForm.savedAmount || 0);

    if (!goalForm.title || isNaN(target) || target <= 0) {
      showToast('error', 'Please provide a title and valid target amount.');
      return;
    }

    if (!isMockMode) {
      try {
        await savingsGoalAPI.create({
          title: goalForm.title,
          targetAmount: target,
          savedAmount: saved,
          description: goalForm.description
        });
        showToast('success', 'Savings goal created!');
        setSavingsGoalModal(false);
        setGoalForm({ title: '', targetAmount: '', savedAmount: '', description: '' });
        loadData();
      } catch (err) {
        showToast('error', 'Failed to save savings goal.');
      }
    } else {
      const newGoal = {
        id: 'mock_g_' + Date.now(),
        title: goalForm.title,
        targetAmount: target,
        savedAmount: saved,
        description: goalForm.description
      };

      const updated = [...savingsGoals, newGoal];
      setSavingsGoals(updated);
      localStorage.setItem('local_savings_goals', JSON.stringify(updated));
      showToast('success', 'Savings goal created locally!');
      setSavingsGoalModal(false);
      setGoalForm({ title: '', targetAmount: '', savedAmount: '', description: '' });
    }
  };

  const handleTopUpSavings = async (e) => {
    e.preventDefault();
    const topUpVal = Number(savingsTopUp.amount);
    if (isNaN(topUpVal) || topUpVal <= 0) {
      showToast('error', 'Please enter a valid amount to save.');
      return;
    }

    if (!isMockMode) {
      try {
        await savingsGoalAPI.update(savingsTopUp.id, { addAmount: topUpVal });
        showToast('success', 'Added money to goal!');
        setAddSavingsModal(false);
        setSavingsTopUp({ id: '', amount: '' });
        loadData();
      } catch (err) {
        showToast('error', 'Failed to update goal.');
      }
    } else {
      const updated = savingsGoals.map(g => {
        if (g.id === savingsTopUp.id) {
          return { ...g, savedAmount: g.savedAmount + topUpVal };
        }
        return g;
      });
      setSavingsGoals(updated);
      localStorage.setItem('local_savings_goals', JSON.stringify(updated));
      showToast('success', 'Added money to mock goal!');
      setAddSavingsModal(false);
      setSavingsTopUp({ id: '', amount: '' });
    }
  };

  const handleDeleteGoal = async (id) => {
    if (!isMockMode) {
      try {
        await savingsGoalAPI.delete(id);
        showToast('success', 'Goal deleted.');
        loadData();
      } catch (err) {
        showToast('error', 'Failed to delete goal.');
      }
    } else {
      const updated = savingsGoals.filter(g => g.id !== id);
      setSavingsGoals(updated);
      localStorage.setItem('local_savings_goals', JSON.stringify(updated));
      showToast('success', 'Goal deleted locally.');
    }
  };

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', animation: 'pulse 1.5s infinite ease-in-out' }}>🎯</div>
        <h3>Loading Budgets & Goals...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Configuring financial plan</p>
      </div>
    );
  }

  // overall stats
  const overallRemaining = Math.max(0, monthlyLimit - totalSpent);
  const overallPercentage = Math.round((totalSpent / monthlyLimit) * 100);
  const limitStatus = overallPercentage >= 100 ? 'danger' : overallPercentage >= 80 ? 'warning' : 'safe';

  return (
    <div className="page-body">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Budget & Goals</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create financial discipline through custom limits and savings goals.</p>
        </div>
        {isMockMode && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid var(--orange)', color: 'var(--orange)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>⚡ Offline Storage Mode</span>
          </div>
        )}
      </div>

      {/* Overview Cards Row */}
      <div className="grid-2" style={{ marginBottom: '28px' }}>
        
        {/* Card 1: Monthly spending limit tracking */}
        <div className="card" style={{ borderTop: `5px solid var(--${limitStatus === 'danger' ? 'red' : limitStatus === 'warning' ? 'orange' : 'green'})`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="sc-label" style={{ letterSpacing: '0.05em', fontWeight: 700, fontSize: '0.8rem' }}>MONTHLY BUDGET LIMIT</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>{formatCurrency(monthlyLimit)}</h2>
              </div>
              <button className="btn btn-sm btn-outline" onClick={() => { setTempLimit(monthlyLimit.toString()); setMonthlyLimitModal(true); }}>
                ✏️ Edit Limit
              </button>
            </div>
            
            <div className="budget-progress" style={{ margin: '16px 0 8px' }}>
              <div className="bp-header" style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>Total Spent: <strong>{formatCurrency(totalSpent)}</strong></span>
                <span style={{ color: 'var(--text-secondary)' }}>{overallPercentage}% Used</span>
              </div>
              <div className="bp-bar" style={{ height: '10px' }}>
                <div className={`bp-fill ${limitStatus}`} style={{ width: `${Math.min(100, overallPercentage)}%` }} />
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
            <span>Remaining: <strong>{formatCurrency(overallRemaining)}</strong></span>
            <span style={{ 
              color: limitStatus === 'danger' ? 'var(--red)' : limitStatus === 'warning' ? 'var(--orange)' : 'var(--green)',
              fontWeight: 700 
            }}>
              {limitStatus === 'danger' ? 'Budget Exceeded!' : limitStatus === 'warning' ? 'Approaching Limit' : 'Safe Spending'}
            </span>
          </div>
        </div>

        {/* Card 2: Savings Goals overview */}
        <div className="card" style={{ borderTop: '5px solid var(--blue)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="sc-label" style={{ letterSpacing: '0.05em', fontWeight: 700, fontSize: '0.8rem' }}>SAVINGS GOALS PROGRESS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px' }}>
              {formatCurrency(savingsGoals.reduce((acc, curr) => acc + curr.savedAmount, 0))}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              Saved across {savingsGoals.length} goal cards
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {savingsGoals.slice(0, 4).map((g, idx) => {
                const pct = g.targetAmount > 0 ? Math.round((g.savedAmount / g.targetAmount) * 100) : 0;
                return (
                  <div key={idx} style={{ flex: 1, background: 'var(--bg)', borderRadius: '8px', padding: '10px', textAlign: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>
                      <GoalIcon type={g.title} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{g.title}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)' }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Sections Side-by-Side Grid */}
      <div className="grid-2">
        
        {/* Category Budget Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Category Budgets</h3>
            <button className="btn btn-sm btn-primary" onClick={() => setCategoryModal(true)}>
              ➕ Add Budget
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {budgets.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 0' }}>
                <div className="empty-icon" style={{ fontSize: '2.5rem' }}>💸</div>
                <p>No category budgets configured.</p>
                <button className="btn btn-sm btn-outline" style={{ marginTop: '12px' }} onClick={() => setCategoryModal(true)}>Set Category Limit</button>
              </div>
            ) : (
              budgets.map((b) => {
                const pct = b.limitAmount > 0 ? Math.round((b.spentAmount / b.limitAmount) * 100) : 0;
                const statusClass = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'safe';
                return (
                  <div key={b.id} className="budget-progress" style={{ margin: 0, paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{getCategoryIcon(b.category)}</span>
                        <div>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--text)' }}>{b.category}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            Spent {formatCurrency(b.spentAmount)} of {formatCurrency(b.limitAmount)}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '3px 8px', 
                          borderRadius: '50px',
                          background: pct >= 100 ? 'var(--red-light)' : pct >= 80 ? 'var(--orange-light)' : 'var(--green-light)',
                          color: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--orange)' : 'var(--green)'
                        }}>
                          {pct}%
                        </span>
                        <button 
                          className="btn btn-icon btn-sm btn-outline" 
                          style={{ width: '26px', height: '26px', fontSize: '0.8rem', border: 'none', color: 'var(--text-muted)' }} 
                          onClick={() => handleDeleteBudget(b.id)}
                          title="Delete budget"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="bp-bar" style={{ height: '7px' }}>
                      <div className={`bp-fill ${statusClass}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Savings Goals Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Savings Goals</h3>
              <button className="btn btn-sm btn-primary" onClick={() => setSavingsGoalModal(true)}>
                ➕ Add Goal
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {savingsGoals.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <div className="empty-icon" style={{ fontSize: '2.5rem' }}>🎯</div>
                  <p>No savings goals set.</p>
                  <button className="btn btn-sm btn-outline" style={{ marginTop: '12px' }} onClick={() => setSavingsGoalModal(true)}>Create Savings Target</button>
                </div>
              ) : (
                savingsGoals.map((g) => {
                  const pct = g.targetAmount > 0 ? Math.round((g.savedAmount / g.targetAmount) * 100) : 0;
                  const remaining = Math.max(0, g.targetAmount - g.savedAmount);
                  
                  return (
                    <div key={g.id} className="card" style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '16px', boxShadow: 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifycontent: 'center', border: '1px solid var(--border)', paddingLeft: '8px' }}>
                            <GoalIcon type={g.title} />
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.95rem' }}>{g.title}</strong>
                            {g.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{g.description}</div>}
                          </div>
                        </div>

                        <button 
                          className="btn btn-icon btn-sm btn-outline" 
                          style={{ border: 'none', color: 'var(--text-muted)' }} 
                          onClick={() => handleDeleteGoal(g.id)}
                          title="Delete Goal"
                        >
                          🗑️
                        </button>
                      </div>

                      <div style={{ margin: '14px 0 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          <span>Saved: <strong>{formatCurrency(g.savedAmount)}</strong></span>
                          <span>Target: {formatCurrency(g.targetAmount)}</span>
                        </div>
                        <div className="budget-progress" style={{ margin: 0 }}>
                          <div className="bp-bar" style={{ height: '8px' }}>
                            <div className="bp-fill safe" style={{ width: `${Math.min(100, pct)}%` }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          <span>Remaining: {formatCurrency(remaining)}</span>
                          <span>{pct}% complete</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => { setSavingsTopUp({ id: g.id, amount: '' }); setAddSavingsModal(true); }}>
                          💰 Add Savings
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* Modal 1: Edit Monthly Spending Limit */}
      {monthlyLimitModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Set Monthly Budget</h3>
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Total Spending Limit (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 50000"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={tempLimit} 
                onChange={(e) => setTempLimit(e.target.value)} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button className="btn btn-outline" onClick={() => setMonthlyLimitModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveMonthlyLimit}>Save Limit</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Create Category Budget Limit */}
      {categoryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSaveCategoryBudget} className="card" style={{ width: '420px', maxWidth: '90%', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Add Category Budget</h3>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Expense Category</label>
              <select 
                className="form-control" 
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={categoryForm.category}
                onChange={(e) => setCategoryForm({ ...categoryForm, category: e.target.value })}
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Spending Limit (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 6000"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={categoryForm.limitAmount}
                onChange={(e) => setCategoryForm({ ...categoryForm, limitAmount: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setCategoryModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Budget</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 3: Create Savings Goal Target */}
      {savingsGoalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleSaveSavingsGoal} className="card" style={{ width: '440px', maxWidth: '90%', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>New Savings Goal</h3>

            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Goal Title</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Emergency Fund"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Target Amount (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 50000"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={goalForm.targetAmount}
                onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Initial Savings (₹) (Optional)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 5000"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={goalForm.savedAmount}
                onChange={(e) => setGoalForm({ ...goalForm, savedAmount: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Description (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 3-6 months buffer"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setSavingsGoalModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Goal</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal 4: Add Savings Money */}
      {addSavingsModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handleTopUpSavings} className="card" style={{ width: '380px', maxWidth: '90%', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Add Money to Savings</h3>
            
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Savings Increment Amount (₹)</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="e.g. 5000"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
                value={savingsTopUp.amount}
                onChange={(e) => setSavingsTopUp({ ...savingsTopUp, amount: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn btn-outline" onClick={() => setAddSavingsModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Deposit</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
