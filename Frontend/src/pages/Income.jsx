import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import IncomeCards from '../components/income/incomeCards';
import IncomeCategories from '../components/income/incomeCategories';
import IncomeForm from '../components/income/incomeForm';
import IncomeCharts from '../components/income/incomeCharts';
import '../components/income/income.css';

const MOCK_INCOMES = [
  { id: 'tx_1', type: 'income', amount: 50000, source: 'Salary', paymentMethod: 'Bank Transfer', description: 'July salary credited', date: '2026-07-20T00:00:00.000Z' },
  { id: 'tx_2', type: 'income', amount: 12500, source: 'Freelance', paymentMethod: 'UPI', description: 'Design consulting', date: '2026-07-18T00:00:00.000Z' },
  { id: 'tx_3', type: 'income', amount: 8200, source: 'Investment', paymentMethod: 'Bank Transfer', description: 'Dividend payout', date: '2026-07-16T00:00:00.000Z' },
  { id: 'tx_4', type: 'income', amount: 7200, source: 'Business', paymentMethod: 'Card', description: 'Project milestone payment', date: '2026-07-14T00:00:00.000Z' },
  { id: 'tx_5', type: 'income', amount: 4200, source: 'Bonus', paymentMethod: 'Bank Transfer', description: 'Performance bonus', date: '2026-07-12T00:00:00.000Z' },
  { id: 'tx_6', type: 'income', amount: 15000, source: 'Rental', paymentMethod: 'Bank Transfer', description: 'Apartment rent income', date: '2026-06-25T00:00:00.000Z' },
  { id: 'tx_7', type: 'income', amount: 4000, source: 'Other', paymentMethod: 'Cash', description: 'One-time consulting fee', date: '2026-06-10T00:00:00.000Z' },
  { id: 'tx_8', type: 'income', amount: 22000, source: 'Salary', paymentMethod: 'Bank Transfer', description: 'June salary transfer', date: '2026-06-01T00:00:00.000Z' },
];

const MOCK_BUDGET_STATUS = {
  budgets: [
    { category: 'Housing', limit: 15000, spent: 15000, remaining: 0, percentage: 100, status: 'Exceeded' },
    { category: 'Food', limit: 6000, spent: 5500, remaining: 500, percentage: 92, status: 'Warning' },
    { category: 'Transport', limit: 3000, spent: 5500, remaining: -2500, percentage: 183, status: 'Exceeded' },
    { category: 'Shopping', limit: 5000, spent: 2500, remaining: 2500, percentage: 50, status: 'On Track' },
    { category: 'Bills', limit: 4000, spent: 3000, remaining: 1000, percentage: 75, status: 'On Track' },
  ],
  summary: {
    totalBudget: 33000,
    totalSpent: 31500,
    totalRemaining: 1500,
    overallPercentage: 95,
  },
};

const MOCK_TRENDS = [
  { name: 'Feb', income: 32000 },
  { name: 'Mar', income: 34000 },
  { name: 'Apr', income: 39000 },
  { name: 'May', income: 36000 },
  { name: 'Jun', income: 37500 },
  { name: 'Jul', income: 39500 },
];

export default function Income() {
  const { user } = useAuth();
  const [income, setIncomes] = useState([]);
  const [budgetStatus, setBudgetStatus] = useState(MOCK_BUDGET_STATUS);
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const incomeRes = await api.get('/income');
      const budgetRes = await api.get('/budget/status');
      setIncomes(incomeRes.data || []);
      setBudgetStatus(budgetRes.data || MOCK_BUDGET_STATUS);
      setTrends(MOCK_TRENDS);
      setIsMockMode(false);
    } catch (error) {
      console.warn('⚠️ Server connection offline, setting up Mock Storage Mode.');
      const local = localStorage.getItem('local_income');
      if (local) {
        setIncomes(JSON.parse(local));
      } else {
        setIncomes(MOCK_INCOMES);
        localStorage.setItem('local_income', JSON.stringify(MOCK_INCOMES));
      }
      setBudgetStatus(MOCK_BUDGET_STATUS);
      setTrends(MOCK_TRENDS);
      setIsMockMode(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddIncome = async (incomeData) => {
    if (!isMockMode) {
      try {
        await api.post('/income', incomeData);
        showToast('success', 'Income logged successfully!');
        loadData();
      } catch (err) {
        console.error(err);
        showToast('error', 'API submission failed. Saved to local mock db.');
        saveLocal(incomeData);
      }
    } else {
      saveLocal(incomeData);
    }
  };

  const saveLocal = (incomeData) => {
    const newTx = {
      id: `tx_local_${Date.now()}`,
      type: 'income',
      amount: incomeData.amount,
      source: incomeData.source,
      paymentMethod: incomeData.paymentMethod,
      description: incomeData.description,
      date: incomeData.date,
    };

    const updated = [newTx, ...income];
    setIncomes(updated);
    localStorage.setItem('local_income', JSON.stringify(updated));

    const monthName = new Date(incomeData.date).toLocaleString('default', { month: 'short' });
    const updatedTrends = trends.map((t) => {
      if (t.name === monthName) {
        return { ...t, income: t.income + incomeData.amount };
      }
      return t;
    });
    setTrends(updatedTrends);

    showToast('success', 'Income saved in offline mock database!');
  };

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px' }}>
        <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '2rem', animation: 'pulse 1.5s infinite ease-in-out', background: 'var(--orange)' }}>💳</div>
        <h3>Loading income ledger...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Gathering source and trend insights</p>
      </div>
    );
  }

  return (
    <div className="page-body income-page">
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      <div className="income-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Track Your Income</h1>
          <p>Record your income sources and monitor your financial health.</p>
        </div>
        {isMockMode && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid var(--orange)', color: 'var(--orange)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>⚡ Offline mock mode active</span>
          </div>
        )}
      </div>

      <section className="income-action-panel card">
        <div>
          <h2>Ready to log a new income?</h2>
          <p>Use the quick entry below to capture amount, source, date, payment method, and description in one polished flow.</p>
        </div>
        <button type="button" className="btn btn-primary">Start new entry</button>
      </section>

      <IncomeCards income={income} budgetStatus={budgetStatus} />

      <div className="income-form-grid">
        <IncomeForm onSubmit={handleAddIncome} onToast={showToast} />
        <IncomeCategories />
      </div>

      <section className="card income-analytics-card">
        <div className="card-header" style={{ padding: 0 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0' }}>Visual Analytics & Trend Insights</h3>
        </div>
        <IncomeCharts income={income} trends={trends} />
      </section>
    </div>
  );
}
