import { useState, useEffect } from 'react';
import api from '../api/client';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const MOCK_TRANSACTIONS = [
  { id: 'tx_1', date: '2026-07-20', description: 'July salary credited', category: 'Salary', type: 'income', paymentMethod: 'Bank Transfer', amount: 50000, status: 'completed' },
  { id: 'tx_2', date: '2026-07-19', description: 'Swiggy food order', category: 'Food', type: 'expense', paymentMethod: 'UPI', amount: 450, status: 'completed' },
  { id: 'tx_3', date: '2026-07-18', description: 'Uber ride to office', category: 'Transport', type: 'expense', paymentMethod: 'UPI', amount: 320, status: 'completed' },
  { id: 'tx_4', date: '2026-07-17', description: 'Freelance web project', category: 'Freelance', type: 'income', paymentMethod: 'Bank Transfer', amount: 12000, status: 'completed' },
  { id: 'tx_5', date: '2026-07-16', description: 'Netflix subscription', category: 'Entertainment', type: 'expense', paymentMethod: 'Credit Card', amount: 649, status: 'completed' },
  { id: 'tx_6', date: '2026-07-15', description: 'Electricity bill', category: 'Bills', type: 'expense', paymentMethod: 'UPI', amount: 1800, status: 'completed' },
  { id: 'tx_7', date: '2026-07-14', description: 'Amazon shopping', category: 'Shopping', type: 'expense', paymentMethod: 'Credit Card', amount: 3200, status: 'completed' },
  { id: 'tx_8', date: '2026-07-13', description: 'Dividend income', category: 'Investment', type: 'income', paymentMethod: 'Bank Transfer', amount: 3000, status: 'completed' },
  { id: 'tx_9', date: '2026-07-12', description: 'Petrol refill', category: 'Transport', type: 'expense', paymentMethod: 'Cash', amount: 2500, status: 'completed' },
  { id: 'tx_10', date: '2026-07-11', description: 'Coursera course purchase', category: 'Education', type: 'expense', paymentMethod: 'Debit Card', amount: 4500, status: 'completed' },
  { id: 'tx_11', date: '2026-07-10', description: 'Side business revenue', category: 'Business', type: 'income', paymentMethod: 'UPI', amount: 8000, status: 'completed' },
  { id: 'tx_12', date: '2026-07-09', description: 'Gym membership', category: 'Healthcare', type: 'expense', paymentMethod: 'UPI', amount: 1500, status: 'completed' },
  { id: 'tx_13', date: '2026-07-08', description: 'Cafe coffee day', category: 'Food', type: 'expense', paymentMethod: 'Cash', amount: 280, status: 'completed' },
  { id: 'tx_14', date: '2026-07-07', description: 'Mobile recharge', category: 'Bills', type: 'expense', paymentMethod: 'UPI', amount: 599, status: 'completed' },
  { id: 'tx_15', date: '2026-07-06', description: 'Performance bonus', category: 'Bonus', type: 'income', paymentMethod: 'Bank Transfer', amount: 5000, status: 'completed' },
  { id: 'tx_16', date: '2026-07-05', description: 'Zomato dinner', category: 'Food', type: 'expense', paymentMethod: 'UPI', amount: 780, status: 'completed' },
  { id: 'tx_17', date: '2026-07-04', description: 'Water bill payment', category: 'Bills', type: 'expense', paymentMethod: 'UPI', amount: 400, status: 'completed' },
  { id: 'tx_18', date: '2026-07-03', description: 'Flipkart electronics', category: 'Shopping', type: 'expense', paymentMethod: 'Credit Card', amount: 5600, status: 'completed' },
];

const CATEGORIES = ['All', 'Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Education', 'Healthcare'];
const ITEMS_PER_PAGE = 8;

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', type: 'all', category: 'All', search: '' });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      try {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.type !== 'all') params.type = filters.type;
        if (filters.category !== 'All') params.category = filters.category;
        params.limit = 50;

        const res = await api.get('/transactions', { params });
        setTransactions(res.data.results || res.data || []);
      } catch (err) {
        console.warn('API offline, using mock transactions');
        setTransactions(MOCK_TRANSACTIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Client-side filtering
  const filtered = transactions.filter(tx => {
    if (filters.type !== 'all' && tx.type !== filters.type) return false;
    if (filters.category !== 'All' && tx.category !== filters.category) return false;
    if (filters.startDate && tx.date < filters.startDate) return false;
    if (filters.endDate && tx.date > filters.endDate) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!tx.description?.toLowerCase().includes(q) && !tx.category?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Transaction History</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>View and filter all your income and expense records</p>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ marginBottom: '18px', padding: '16px' }}>
        <div className="filter-bar">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="End Date"
          />
          <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ flex: 1, minWidth: '180px' }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No transactions found matching your filters</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(tx => (
                    <tr key={tx.id}>
                      <td>{formatDate(tx.date)}</td>
                      <td style={{ fontWeight: 500 }}>{tx.description}</td>
                      <td>{tx.category}</td>
                      <td>{tx.paymentMethod}</td>
                      <td style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </td>
                      <td>
                        <span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.status || 'completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <span>Showing {paginated.length} of {filtered.length} transactions</span>
        <span>
          Total: <strong style={{ color: 'var(--green)' }}>
            +{formatCurrency(filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))}
          </strong>
          {' / '}
          <strong style={{ color: 'var(--red)' }}>
            -{formatCurrency(filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
          </strong>
        </span>
      </div>
    </div>
  );
}
