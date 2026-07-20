import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import IncomeCards from '../components/income/incomeCards';
import IncomeCategories from '../components/income/incomeCategories';
import IncomeForm from '../components/income/incomeForm';
import IncomeCharts from '../components/income/incomeCharts';
import '../components/income/income.css';
import { IconCard, IconCheck, IconClose, IconEdit, IconDelete } from '../utils/icons';

export default function Income() {
  const { user } = useAuth();
  const [income, setIncomes] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState({ budgets: [], summary: { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 } });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incomeRes, budgetRes] = await Promise.all([
        api.get('/income'),
        api.get('/budget/status'),
      ]);
      setIncomes(incomeRes.data || []);
      setBudgetStatus(budgetRes.data || { budgets: [], summary: { totalBudget: 0, totalSpent: 0, totalRemaining: 0, overallPercentage: 0 } });

      const months = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ name: d.toLocaleString('default', { month: 'short' }), income: 0 });
      }
      (incomeRes.data || []).forEach(inc => {
        const d = new Date(inc.date);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const entry = months.find(m => m.name === monthName);
        if (entry) entry.income += inc.amount;
      });
      setTrends(months);
    } catch (err) {
      setError('Failed to load income data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddIncome = async (incomeData) => {
    try {
      await api.post('/income', incomeData);
      showToast('success', 'Income logged successfully!');
      loadData();
    } catch (err) {
      showToast('error', 'Failed to save income.');
    }
  };

  const handleEditIncome = (income) => {
    setEditingIncome(income);
  };

  const handleCancelEdit = () => {
    setEditingIncome(null);
  };

  const handleUpdateIncome = async (incomeData) => {
    try {
      const { id, ...data } = incomeData;
      await api.put(`/income/${id}`, data);
      showToast('success', 'Income updated successfully!');
      setEditingIncome(null);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to update income.');
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await api.delete(`/income/${id}`);
      showToast('success', 'Income deleted successfully!');
      setDeletingId(null);
      loadData();
    } catch (err) {
      showToast('error', 'Failed to delete income.');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const sourceIcons = {
    Salary: '💰', Freelance: '💻', Business: '🏢', Investment: '📈',
    Bonus: '🎁', Rental: '🏠', Other: '📋'
  };

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', animation: 'pulse 1.5s infinite ease-in-out', background: 'var(--orange)' }}><IconCard size={40} /></div>
        <h3>Loading income ledger...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Gathering source and trend insights</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', background: 'var(--orange)' }}><IconCard size={40} /></div>
        <h3>Unable to load income data</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button className="btn btn-primary" onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page-body income-page">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <IconCheck size={16} /> : <IconClose size={16} />} {toast.message}
        </div>
      )}

      <div className="income-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Track Your Income</h1>
          <p>Record your income sources and monitor your financial health.</p>
        </div>
      </div>

      <section className="income-action-panel card">
        <div>
          <h2>Ready to log a new income?</h2>
          <p>Use the quick entry below to capture amount, source, date, payment method, and description in one polished flow.</p>
        </div>
      </section>

      <IncomeCards income={income} budgetStatus={budgetStatus} />

      <div className="income-form-grid">
        <IncomeForm
          onSubmit={editingIncome ? handleUpdateIncome : handleAddIncome}
          onToast={showToast}
          editingIncome={editingIncome}
          onCancelEdit={handleCancelEdit}
        />
        <IncomeCategories />
      </div>

      <section className="card">
        <div className="card-header">
          <h3>Income History</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{income.length} entries</span>
        </div>
        {income.length === 0 ? (
          <div className="empty-state">
            <p>No income entries recorded yet.</p>
          </div>
        ) : (
          <div>
              {income.slice().reverse().map((inc) => (
              <div key={inc.id} className="transaction-card">
                <div className="tx-icon" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                  {sourceIcons[inc.source] || '💰'}
                </div>
                <div className="tx-info">
                  <div className="tx-title">{inc.source}</div>
                  <div className="tx-meta">
                    <span>{formatDate(inc.date)}</span>
                    <span>{inc.paymentMethod}</span>
                    {inc.description && <span>{inc.description}</span>}
                  </div>
                </div>
                <div className="tx-amount income">{formatCurrency(inc.amount)}</div>
                <div className="tx-actions">
                  <button className="btn btn-sm btn-outline" onClick={() => handleEditIncome(inc)} title="Edit">
                    <IconEdit size={16} />
                  </button>
                  {deletingId === inc.id ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteIncome(inc.id)}>
                        Confirm
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => setDeletingId(null)}>
                        <IconClose size={14} />
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-outline" style={{ color: 'var(--red)' }} onClick={() => setDeletingId(inc.id)} title="Delete">
                      <IconDelete size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card income-analytics-card">
        <div className="card-header" style={{ padding: 0 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0' }}>Visual Analytics & Trend Insights</h3>
        </div>
        <IncomeCharts income={income} trends={trends} />
      </section>
    </div>
  );
}
