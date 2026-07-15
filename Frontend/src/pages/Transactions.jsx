import { useState, useEffect } from 'react';
import { transactionAPI } from '../api/client';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '', paymentMethod: '', from: '', to: '', minAmount: '', maxAmount: '' });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = () => {
    setLoading(true);
    const params = { page, limit: 20 };
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    transactionAPI.getAll(params)
      .then((res) => { setTransactions(res.data.data.transactions); setTotalPages(res.data.data.pages); })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleFilter = () => { setPage(1); load(); };

  return (
    <div>
      <div className="page-header">
        <h2>🔄 Transaction History</h2>
      </div>
      <div className="page-body">
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="filter-bar">
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              <optgroup label="Income Sources">
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Business">Business</option>
                <option value="Investment">Investment</option>
              </optgroup>
              <optgroup label="Expense Categories">
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Entertainment">Entertainment</option>
              </optgroup>
            </select>
            <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} placeholder="From" />
            <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} placeholder="To" />
            <input type="number" value={filters.minAmount} onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })} placeholder="Min amount" style={{ minWidth: 100 }} />
            <input type="number" value={filters.maxAmount} onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })} placeholder="Max amount" style={{ minWidth: 100 }} />
            <button className="btn btn-primary btn-sm" onClick={handleFilter}>Apply</button>
            <button className="btn btn-outline btn-sm" onClick={() => { setFilters({ type: '', category: '', paymentMethod: '', from: '', to: '', minAmount: '', maxAmount: '' }); setPage(1); }}>Clear</button>
          </div>
        </div>

        <div className="card">
          {loading ? <p>Loading...</p> : transactions.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🔄</div><p>No transactions found</p></div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Type</th><th>Category</th><th>Amount</th><th>Payment</th><th>Date</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td><span className={`badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>{tx.type}</span></td>
                        <td>{tx.category}</td>
                        <td style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{tx.paymentMethod || '-'}</td>
                        <td>{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td style={{ color: 'var(--text-secondary)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-sm btn-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                  <span style={{ padding: '6px 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
                  <button className="btn btn-sm btn-outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
