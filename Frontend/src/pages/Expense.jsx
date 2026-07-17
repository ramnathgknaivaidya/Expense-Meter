import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ExpenseCards from '../components/expense/expenseCards';
import ExpenseCategories from '../components/expense/expenseCategories';
import ExpenseForm from '../components/expense/expenseForm';
import ExpenseCharts from '../components/expense/expenseCharts';
import '../components/expense/expense.css';

const MOCK_EXPENSES = [
  { id: 'tx_2', type: 'expense', amount: 3500, category: 'Transport', paymentMethod: 'UPI', merchant: 'Indian Oil', description: 'Fuel refill', date: '2026-07-20T00:00:00.000Z' },
  { id: 'tx_3', type: 'expense', amount: 1000, category: 'Food', paymentMethod: 'Cash', merchant: 'Local Cafe', description: 'Lunch', date: '2026-07-18T00:00:00.000Z' },
  { id: 'tx_4', type: 'expense', amount: 2000, category: 'Entertainment', paymentMethod: 'Debit Card', merchant: 'Netflix', description: 'Subscriptions', date: '2026-07-16T00:00:00.000Z' },
  { id: 'tx_6', type: 'expense', amount: 5000, category: 'Education', paymentMethod: 'UPI', merchant: 'Coursera', description: 'Online course', date: '2026-07-14T00:00:00.000Z' },
  { id: 'tx_7', type: 'expense', amount: 1500, category: 'Healthcare', paymentMethod: 'Cash', merchant: 'Apollo Pharmacy', description: 'Medicine', date: '2026-07-12T00:00:00.000Z' },
  { id: 'tx_9', type: 'expense', amount: 2500, category: 'Shopping', paymentMethod: 'Credit Card', merchant: 'Amazon', description: 'Clothes purchase', date: '2026-07-08T00:00:00.000Z' },
  { id: 'tx_12', type: 'expense', amount: 4500, category: 'Food', paymentMethod: 'UPI', merchant: 'Swiggy', description: 'Monthly food delivery', date: '2026-07-02T00:00:00.000Z' },
  { id: 'tx_13', type: 'expense', amount: 2000, category: 'Transport', paymentMethod: 'UPI', merchant: 'Uber', description: 'Cab rides', date: '2026-07-03T00:00:00.000Z' },
  { id: 'tx_14', type: 'expense', amount: 15000, category: 'Housing', paymentMethod: 'Bank Transfer', merchant: 'Landlord', description: 'Monthly rent', date: '2026-07-01T00:00:00.000Z' },
  { id: 'tx_15', type: 'expense', amount: 3000, category: 'Bills', paymentMethod: 'Debit Card', merchant: 'Electricity Board', description: 'Electricity bill', date: '2026-07-05T00:00:00.000Z' },
];

const MOCK_BUDGET_STATUS = {
  budgets: [
    { category: 'Housing', limit: 15000, spent: 15000, remaining: 0, percentage: 100, status: 'Exceeded' },
    { category: 'Food', limit: 6000, spent: 5500, remaining: 500, percentage: 92, status: 'Warning' },
    { category: 'Transport', limit: 3000, spent: 5500, remaining: -2500, percentage: 183, status: 'Exceeded' },
    { category: 'Shopping', limit: 5000, spent: 2500, remaining: 2500, percentage: 50, status: 'On Track' },
    { category: 'Bills', limit: 4000, spent: 3000, remaining: 1000, percentage: 75, status: 'On Track' },
  ],
  summary: { totalBudget: 33000, totalSpent: 31500, totalRemaining: 1500, overallPercentage: 95 },
};

const MOCK_TRENDS = [
  { name: 'Feb', expense: 32000 },
  { name: 'Mar', expense: 34000 },
  { name: 'Apr', expense: 39000 },
  { name: 'May', expense: 36000 },
  { name: 'Jun', expense: 37500 },
  { name: 'Jul', expense: 39500 },
];

export default function Expense() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(MOCK_BUDGET_STATUS);
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState('form'); // 'form' | 'categories'

  const showToast = (type, message) => { setToast({ type, message }); setTimeout(() => setToast(null), 3000); };

  const loadData = async () => {
    setLoading(true);
    try {
      const expenseRes = await api.get('/expense');
      const budgetRes = await api.get('/budget/status');
      setExpenses(expenseRes.data || []);
      setBudgetStatus(budgetRes.data || MOCK_BUDGET_STATUS);
      setTrends(MOCK_TRENDS);
      setIsMockMode(false);
    } catch (error) {
      const local = localStorage.getItem('local_expenses');
      if (local) { setExpenses(JSON.parse(local)); }
      else { setExpenses(MOCK_EXPENSES); localStorage.setItem('local_expenses', JSON.stringify(MOCK_EXPENSES)); }
      setBudgetStatus(MOCK_BUDGET_STATUS);
      setTrends(MOCK_TRENDS);
      setIsMockMode(true);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleAddExpense = async (expenseData) => {
    if (!isMockMode) {
      try { await api.post('/expense', expenseData); showToast('success', 'Expense logged successfully!'); loadData(); return; }
      catch { showToast('error', 'API failed. Saved locally.'); }
    }
    saveLocal(expenseData);
  };

  const saveLocal = (expenseData) => {
    const newTx = { id: `tx_local_${Date.now()}`, type: 'expense', ...expenseData };
    const updated = [newTx, ...expenses];
    setExpenses(updated);
    localStorage.setItem('local_expenses', JSON.stringify(updated));
    const updatedBudgets = budgetStatus.budgets.map(b => {
      if (b.category === expenseData.category) {
        const spent = b.spent + expenseData.amount;
        const percentage = Math.round((spent / b.limit) * 100);
        return { ...b, spent, remaining: b.limit - spent, percentage, status: percentage >= 100 ? 'Exceeded' : percentage >= 80 ? 'Warning' : 'On Track' };
      }
      return b;
    });
    const totalSpent = updatedBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalBudget = updatedBudgets.reduce((sum, b) => sum + b.limit, 0);
    setBudgetStatus({ budgets: updatedBudgets, summary: { totalBudget, totalSpent, totalRemaining: totalBudget - totalSpent, overallPercentage: Math.round((totalSpent / totalBudget) * 100) } });
    setTrends(trends.map(t => t.name === 'Jul' ? { ...t, expense: t.expense + expenseData.amount } : t));
    showToast('success', 'Expense saved offline!');
  };

  if (loading) return (
    <div className="page-body exp-page-loading">
      <div className="exp-loader">💳</div>
      <h3>Loading expense data...</h3>
      <p>Analyzing spending patterns</p>
    </div>
  );

  return (
    <div className="page-body expense-page">
      {toast && <div className={`toast ${toast.type}`}>{toast.type === 'success' ? '✓' : '✕'} {toast.message}</div>}

      {/* ===== HEADER SECTION ===== */}
      <div className="exp-hero">
        <div className="exp-hero-content">
          <h1>Control Your Spending</h1>
          <p>Record categories, compare budget thresholds, and inspect daily spending densities.</p>
        </div>
        <div className="exp-hero-right">
          {isMockMode && <span className="exp-mode-badge">⚡ Offline Mode</span>}
        </div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <ExpenseCards expenses={expenses} budgetStatus={budgetStatus} />

      {/* ===== TABBED SECTION: Form / Categories ===== */}
      <section className="exp-tabbed-section">
        <div className="exp-tab-bar">
          <button className={`exp-tab ${activeSection === 'form' ? 'active' : ''}`} onClick={() => setActiveSection('form')}>
            🧾 Record Expense
          </button>
          <button className={`exp-tab ${activeSection === 'categories' ? 'active' : ''}`} onClick={() => setActiveSection('categories')}>
            📂 Categories
          </button>
        </div>
        <div className="exp-tab-content">
          <div className="exp-tab-panel" style={{ display: activeSection === 'form' ? 'block' : 'none' }}>
            <ExpenseForm onSubmit={handleAddExpense} onToast={showToast} />
          </div>
          <div className="exp-tab-panel" style={{ display: activeSection === 'categories' ? 'block' : 'none' }}>
            <ExpenseCategories />
          </div>
        </div>
      </section>

      {/* ===== ANALYTICS CHARTS ===== */}
      <section className="exp-analytics">
        <div className="exp-analytics-header">
          <h2>Visual Analytics</h2>
          <p>Threshold comparisons & spending density maps</p>
        </div>
        <ExpenseCharts expenses={expenses} budgetStatus={budgetStatus} trends={trends} />
      </section>
    </div>
  );
}
