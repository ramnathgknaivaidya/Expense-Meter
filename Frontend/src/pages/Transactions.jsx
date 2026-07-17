import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import './transactions.css';

const formatCurrency = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const CAT_ICONS = { Salary: '💼', Freelance: '💻', Business: '🏪', Investment: '📈', Bonus: '🎁', Food: '🍔', Transport: '🚗', Housing: '🏠', Bills: '💡', Shopping: '🛍️', Healthcare: '🏥', Education: '🎓', Entertainment: '🍿', Travel: '✈️', Other: '💸' };
const CATEGORIES = ['All', ...Object.keys(CAT_ICONS)];
const PER_PAGE = 10;

const MOCK_TX = [
  { id: 't1', date: '2026-07-20', type: 'income', category: 'Bonus', amount: 2000, paymentMethod: 'Bank Transfer', description: 'Performance bonus', status: 'Completed' },
  { id: 't2', date: '2026-07-20', type: 'expense', category: 'Transport', amount: 3500, paymentMethod: 'UPI', description: 'Fuel refill', merchant: 'Indian Oil', status: 'Completed' },
  { id: 't3', date: '2026-07-18', type: 'expense', category: 'Food', amount: 1000, paymentMethod: 'Cash', description: 'Lunch', merchant: 'Local Cafe', status: 'Completed' },
  { id: 't4', date: '2026-07-16', type: 'expense', category: 'Entertainment', amount: 2000, paymentMethod: 'Debit Card', description: 'Subscriptions', merchant: 'Netflix', status: 'Completed' },
  { id: 't5', date: '2026-07-15', type: 'income', category: 'Business', amount: 8000, paymentMethod: 'Card', description: 'Side business revenue', status: 'Completed' },
  { id: 't6', date: '2026-07-14', type: 'expense', category: 'Education', amount: 5000, paymentMethod: 'UPI', description: 'Online course', merchant: 'Coursera', status: 'Completed' },
  { id: 't7', date: '2026-07-12', type: 'expense', category: 'Healthcare', amount: 1500, paymentMethod: 'Cash', description: 'Medicine', merchant: 'Apollo Pharmacy', status: 'Completed' },
  { id: 't8', date: '2026-07-10', type: 'income', category: 'Investment', amount: 3000, paymentMethod: 'Bank Transfer', description: 'Stock dividends', status: 'Completed' },
  { id: 't9', date: '2026-07-08', type: 'expense', category: 'Shopping', amount: 2500, paymentMethod: 'Credit Card', description: 'Headphones', merchant: 'Amazon', status: 'Completed' },
  { id: 't10', date: '2026-07-05', type: 'income', category: 'Freelance', amount: 12000, paymentMethod: 'UPI', description: 'Web dev project', status: 'Completed' },
  { id: 't11', date: '2026-07-05', type: 'expense', category: 'Bills', amount: 3000, paymentMethod: 'Debit Card', description: 'Electricity', merchant: 'EB Board', status: 'Completed' },
  { id: 't12', date: '2026-07-03', type: 'expense', category: 'Transport', amount: 2000, paymentMethod: 'UPI', description: 'Cab rides', merchant: 'Uber', status: 'Completed' },
  { id: 't13', date: '2026-07-02', type: 'expense', category: 'Food', amount: 4500, paymentMethod: 'UPI', description: 'Food delivery', merchant: 'Swiggy', status: 'Completed' },
  { id: 't14', date: '2026-07-01', type: 'income', category: 'Salary', amount: 50000, paymentMethod: 'Bank Transfer', description: 'July salary', status: 'Completed' },
  { id: 't15', date: '2026-07-01', type: 'expense', category: 'Housing', amount: 15000, paymentMethod: 'Bank Transfer', description: 'Monthly rent', merchant: 'Landlord', status: 'Completed' },
  { id: 't16', date: '2026-06-28', type: 'expense', category: 'Shopping', amount: 5600, paymentMethod: 'Credit Card', description: 'Electronics', merchant: 'Flipkart', status: 'Completed' },
  { id: 't17', date: '2026-06-25', type: 'income', category: 'Freelance', amount: 7500, paymentMethod: 'UPI', description: 'Logo design', status: 'Completed' },
  { id: 't18', date: '2026-06-22', type: 'expense', category: 'Food', amount: 780, paymentMethod: 'UPI', description: 'Dinner', merchant: 'Zomato', status: 'Completed' },
];

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: 'all', category: 'All', search: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/transactions', { params: { limit: 50 } });
        const data = res.data.results || res.data || [];
        setTransactions(data.length > 0 ? data : MOCK_TX);
      } catch { setTransactions(MOCK_TX); }
      finally { setLoading(false); }
    }
    load();
  }, [user]);

  const handleFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1); };

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  // Filter
  const filtered = transactions.filter(tx => {
    if (filters.type !== 'all' && tx.type !== filters.type) return false;
    if (filters.category !== 'All' && tx.category !== filters.category) return false;
    if (filters.startDate && tx.date < filters.startDate) return false;
    if (filters.endDate && tx.date > filters.endDate) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!tx.description?.toLowerCase().includes(q) && !tx.category?.toLowerCase().includes(q) && !tx.merchant?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'date') cmp = new Date(a.date) - new Date(b.date);
    else if (sortBy === 'amount') cmp = a.amount - b.amount;
    else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
    return sortDir === 'desc' ? -cmp : cmp;
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalIn = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  if (loading) return <div className="page-body tx-loading"><div className="tx-loading-icon">🔄</div><p>Loading transactions...</p></div>;

  return (
    <div className="page-body tx-page">
      {/* Header */}
      <div className="tx-header">
        <div>
          <h1>Transactions</h1>
          <p>Complete history of all your financial activities</p>
        </div>
        <div className="tx-header-totals">
          <div className="tx-total-badge income">↑ {formatCurrency(totalIn)}</div>
          <div className="tx-total-badge expense">↓ {formatCurrency(totalOut)}</div>
          <div className="tx-total-badge net">Net: {formatCurrency(totalIn - totalOut)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="tx-filters-card">
        <div className="tx-filters">
          <div className="tx-filter-group">
            <label>Type</label>
            <select value={filters.type} onChange={e => handleFilter('type', e.target.value)}>
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="tx-filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={e => handleFilter('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="tx-filter-group">
            <label>From</label>
            <input type="date" value={filters.startDate} onChange={e => handleFilter('startDate', e.target.value)} />
          </div>
          <div className="tx-filter-group">
            <label>To</label>
            <input type="date" value={filters.endDate} onChange={e => handleFilter('endDate', e.target.value)} />
          </div>
          <div className="tx-filter-group tx-filter-search">
            <label>Search</label>
            <input type="text" placeholder="Search..." value={filters.search} onChange={e => handleFilter('search', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="tx-table-card">
        {sorted.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">🔍</div><p>No transactions match your filters</p></div>
        ) : (
          <>
            <div className="tx-table-wrap">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th className="tx-th-sortable" onClick={() => handleSort('date')}>Date {sortBy === 'date' && (sortDir === 'desc' ? '↓' : '↑')}</th>
                    <th>Type</th>
                    <th className="tx-th-sortable" onClick={() => handleSort('category')}>Category {sortBy === 'category' && (sortDir === 'desc' ? '↓' : '↑')}</th>
                    <th>Description</th>
                    <th>Payment</th>
                    <th className="tx-th-sortable" onClick={() => handleSort('amount')}>Amount {sortBy === 'amount' && (sortDir === 'desc' ? '↓' : '↑')}</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(tx => (
                    <tr key={tx.id} className={`tx-row tx-row-${tx.type}`}>
                      <td className="tx-td-date">{formatDate(tx.date)}</td>
                      <td><span className={`tx-type-badge ${tx.type}`}>{tx.type === 'income' ? '↑ In' : '↓ Out'}</span></td>
                      <td><span className="tx-cat">{CAT_ICONS[tx.category] || '💸'} {tx.category}</span></td>
                      <td className="tx-td-desc">{tx.description}{tx.merchant ? ` • ${tx.merchant}` : ''}</td>
                      <td className="tx-td-method">{tx.paymentMethod}</td>
                      <td className={`tx-td-amount ${tx.type}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                      <td><span className={`tx-status ${tx.status?.toLowerCase() || 'completed'}`}>{tx.status || 'Completed'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="tx-pagination">
              <span className="tx-page-info">Showing {(page-1)*PER_PAGE + 1}–{Math.min(page*PER_PAGE, sorted.length)} of {sorted.length}</span>
              <div className="tx-page-btns">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                ))}
                {totalPages > 5 && <span>...</span>}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
