import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI, transactionAPI } from '../api/client';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [toggle, setToggle] = useState('income');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      reportAPI.getDashboard(),
      transactionAPI.getAll({ limit: 10 }),
    ]).then(([sumRes, txRes]) => {
      setSummary(sumRes.data.data);
      setTransactions(txRes.data.data.transactions);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-body"><p>Loading dashboard...</p></div>;

  const filteredTx = transactions.filter((t) => t.type === toggle);

  return (
    <div className="page-body">
      <div className="hero-section">
        <h1>Manage Your Money. Track Your Growth.</h1>
        <p>Expense Meter helps users track income, monitor expenses, analyze spending habits, and build better financial management practices through simple and visual financial insights.</p>
        <div className="hero-actions">
          <button className="btn btn-primary-hero" onClick={() => navigate('/income')}>+ Add Income</button>
          <button className="btn" onClick={() => navigate('/expense')}>- Add Expense</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card summary-card">
          <div className="sc-icon icon-green">💼</div>
          <div className="sc-label">Total Balance</div>
          <div className="sc-value">₹{(summary?.balance || 0).toLocaleString()}</div>
          <div className={`sc-change ${summary?.balance >= 0 ? 'positive' : 'negative'}`}>
            {summary?.balance >= 0 ? '↑' : '↓'} Healthy
          </div>
        </div>
        <div className="card summary-card">
          <div className="sc-icon icon-blue">📈</div>
          <div className="sc-label">Total Income</div>
          <div className="sc-value">₹{(summary?.totalIncome || 0).toLocaleString()}</div>
          <div className="sc-change positive">↑ This month</div>
        </div>
        <div className="card summary-card">
          <div className="sc-icon icon-red">📉</div>
          <div className="sc-label">Total Expense</div>
          <div className="sc-value">₹{(summary?.totalExpense || 0).toLocaleString()}</div>
          <div className="sc-change negative">↓ This month</div>
        </div>
        <div className="card summary-card">
          <div className="sc-icon icon-orange">🐷</div>
          <div className="sc-label">Savings Rate</div>
          <div className="sc-value">{summary?.savings || 0}%</div>
          <div className={`sc-change ${(summary?.savings || 0) >= 20 ? 'positive' : 'negative'}`}>
            {summary?.savings >= 20 ? '↑ On track' : '↓ Needs attention'}
          </div>
        </div>
      </div>

      <div className="toggle-section">
        <div className="toggle-header">
          <h3>Financial Overview</h3>
          <div className="toggle-switch">
            <div className={`toggle-slider ${toggle}`} />
            <button className={`toggle-btn income ${toggle === 'income' ? 'active' : ''}`} onClick={() => setToggle('income')}>Income</button>
            <button className={`toggle-btn expense ${toggle === 'expense' ? 'active' : ''}`} onClick={() => setToggle('expense')}>Expenditure</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Transactions</h3>
          <button className="btn btn-sm btn-outline" onClick={() => navigate('/transactions')}>View All</button>
        </div>
        {filteredTx.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{toggle === 'income' ? '💰' : '💳'}</div>
            <p>No {toggle} transactions yet. Add your first one!</p>
          </div>
        ) : (
          filteredTx.map((tx) => (
            <div key={tx._id} className="transaction-card">
              <div className={`tx-icon ${tx.type === 'income' ? 'icon-green' : 'icon-red'}`}>
                {tx.type === 'income' ? '💰' : '💳'}
              </div>
              <div className="tx-info">
                <div className="tx-title">{tx.category}</div>
                <div className="tx-meta">
                  <span>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>{tx.paymentMethod}</span>
                </div>
              </div>
              <div className={`tx-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
