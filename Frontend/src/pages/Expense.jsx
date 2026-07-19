import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ExpenseCards from '../components/expense/expenseCards';
import ExpenseCategories from '../components/expense/expenseCategories';
import ExpenseForm from '../components/expense/expenseForm';
import ExpenseCharts from '../components/expense/expenseCharts';
import '../components/expense/expense.css';
import { IconCard, IconCheck, IconClose } from '../utils/icons';

export default function Expense() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState({ budgets: [], summary: { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 } });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expenseRes, budgetRes] = await Promise.all([
        api.get('/expense'),
        api.get('/budget/status'),
      ]);
      setExpenses(expenseRes.data || []);
      setBudgetStatus(budgetRes.data || { budgets: [], summary: { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 } });

      const months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ name: d.toLocaleString('default', { month: 'short' }), expense: 0 });
      }
      (expenseRes.data || []).forEach(exp => {
        const d = new Date(exp.date);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const entry = months.find(m => m.name === monthName);
        if (entry) entry.expense += exp.amount;
      });
      setTrends(months);
    } catch (err) {
      setError('Failed to load expense data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddExpense = async (expenseData) => {
    try {
      await api.post('/expense', expenseData);
      showToast('success', 'Expense logged successfully!');
      loadData();
    } catch (err) {
      showToast('error', 'Failed to save expense.');
    }
  };

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', animation: 'pulse 1.5s infinite ease-in-out', background: 'var(--orange)' }}><IconCard size={40} /></div>
        <h3>Loading expense ledger...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Gathering category distributions</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', background: 'var(--orange)' }}><IconCard size={40} /></div>
        <h3>Unable to load expense data</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button className="btn btn-primary" onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page-body expense-page">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <IconCheck size={16} /> : <IconClose size={16} />} {toast.message}
        </div>
      )}

      <div className="expense-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Control Your Spending</h1>
          <p>Record categories, compare budget thresholds, and inspect daily spending densities.</p>
        </div>
      </div>

      <ExpenseCards expenses={expenses} budgetStatus={budgetStatus} />

      <div className="expense-form-grid">
        <ExpenseForm onSubmit={handleAddExpense} onToast={showToast} />
        <ExpenseCategories />
      </div>

      <section className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px' }}>Visual Analytics & Threshold Comparisons</h3>
        <ExpenseCharts expenses={expenses} budgetStatus={budgetStatus} trends={trends} />
      </section>
    </div>
  );
}
