import { useMemo, useState } from 'react';
import {
  ChevronDown,
  Download,
  Filter,
  LayoutGrid,
  Calendar,
  Hash,
  DollarSign,
  Plus,
  Receipt,
  MoreHorizontal,
  Menu,
  ArrowUpRight,
  IndianRupee,
} from 'lucide-react';
import type { AppStore } from '../data/store';
import { StatusBadge } from '../components/StatusBadge';
import { EntityLogo } from '../components/EntityLogo';
import { Modal } from '../components/Modal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { formatShortDate } from '../utils/format';
import { filterTransactions } from '../utils/search';
import type { Transaction, TransactionStatus } from '../types';

interface Props {
  store: AppStore;
  globalSearch: string;
  onToast: (msg: string) => void;
}

type StatusFilter = 'all' | TransactionStatus;

export function Transactions({ store, globalSearch, onToast }: Props) {
  const { transactions, stats, profile, deleteTransaction, duplicateTransaction, exportCSV } =
    store;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    let list = filterTransactions(transactions, globalSearch);
    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      list = list.filter((t) => t.type === typeFilter);
    }
    if (amountMin) {
      list = list.filter((t) => t.amount >= Number(amountMin));
    }
    if (amountMax) {
      list = list.filter((t) => t.amount <= Number(amountMax));
    }
    if (dateFrom) {
      list = list.filter((t) => t.date >= dateFrom);
    }
    if (dateTo) {
      list = list.filter((t) => t.date <= dateTo);
    }
    return list;
  }, [transactions, globalSearch, statusFilter, typeFilter, amountMin, amountMax, dateFrom, dateTo]);

  const allChecked = filtered.length > 0 && filtered.every((t) => selected.has(t.id));

  const toggleAll = () => {
    if (allChecked) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((t) => t.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const cur = profile.currency;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>
            Manage your accounts and balances
            {globalSearch.trim() ? (
              <span className="search-active-hint">
                {' '}
                · filtering “{globalSearch.trim()}” ({filtered.length})
              </span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => onToast('Match Receipts — upload a receipt to auto-match')}
        >
          <Receipt size={15} />
          Match Receipts
        </button>
      </div>

      {/* Live summary cards — recompute from all transactions */}
      <div className="summary-grid" key={`sum-${stats.revision}`}>
        <div className="summary-card grad-net">
          <div className="card-icon soft-icon" aria-hidden>
            <Menu size={15} strokeWidth={1.75} color="#64748b" />
          </div>
          <div className="amount">
            <AnimatedNumber
              value={Math.abs(stats.netChange)}
              prefix={stats.netChange >= 0 ? '+' : '-'}
              suffix={` ${cur}`}
            />
          </div>
          <div className="label">
            Net change this month
            {stats.incomeGrowthPct !== 0 && (
              <span style={{ marginLeft: 6, opacity: 0.85 }}>
                · income {stats.incomeGrowthPct >= 0 ? '↑' : '↓'}
                {Math.abs(stats.incomeGrowthPct).toFixed(0)}% vs last mo
              </span>
            )}
          </div>
        </div>
        <div className="summary-card grad-in">
          <div className="card-icon soft-icon" aria-hidden>
            <ArrowUpRight size={15} strokeWidth={1.75} color="#0d9488" />
          </div>
          <div className="amount">
            <AnimatedNumber value={stats.moneyIn} prefix="+" suffix={` ${cur}`} />
          </div>
          <div className="label">Money In (this month)</div>
        </div>
        <div className="summary-card grad-out">
          <div className="card-icon soft-icon" aria-hidden>
            <IndianRupee size={15} strokeWidth={1.75} color="#c2410c" />
          </div>
          <div className="amount">
            <AnimatedNumber value={stats.moneyOut} prefix="-" suffix={` ${cur}`} />
          </div>
          <div className="label">Money Out (this month)</div>
        </div>
      </div>

      <div className="panel anim-slide-up anim-delay-1">
        <div className="panel-header">
          <h2>Transactions</h2>
          <div className="filter-bar">
            <button type="button" className="filter-chip">
              <LayoutGrid size={14} />
              Data Views
              <ChevronDown size={12} />
            </button>
            <button
              type="button"
              className={`filter-chip ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <Filter size={14} />
              Filters
            </button>
            <button
              type="button"
              className={`filter-chip ${typeFilter !== 'all' ? 'active' : ''}`}
              onClick={() =>
                setTypeFilter((t) =>
                  t === 'all' ? 'income' : t === 'income' ? 'expense' : 'all'
                )
              }
            >
              <Calendar size={14} />
              {typeFilter === 'all' ? 'Date' : typeFilter === 'income' ? 'Income' : 'Expense'}
              <ChevronDown size={12} />
            </button>
            <button
              type="button"
              className={`filter-chip ${statusFilter !== 'all' ? 'active' : ''}`}
              onClick={() =>
                setStatusFilter((s) =>
                  s === 'all'
                    ? 'Completed'
                    : s === 'Completed'
                      ? 'Pending Review'
                      : s === 'Pending Review'
                        ? 'Canceled'
                        : 'all'
                )
              }
            >
              <Hash size={14} />
              {statusFilter === 'all' ? 'Keywords' : statusFilter}
              <ChevronDown size={12} />
            </button>
            <button type="button" className="filter-chip">
              <DollarSign size={14} />
              Amount
              <ChevronDown size={12} />
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                exportCSV();
                onToast('Exported CSV successfully');
              }}
            >
              <Download size={14} />
              Export All
            </button>
          </div>
        </div>

        {showFilters && (
          <div
            className="anim-slide-down filters-expand"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              padding: '0 18px 14px',
              animation: 'slideDown 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label>Date from</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Date to</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Min amount</label>
              <input
                type="number"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Max amount</label>
              <input
                type="number"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                placeholder="∞"
              />
            </div>
          </div>
        )}

        <div className="table-wrap">
          <table className="data-table anim-rows" key={`${statusFilter}-${typeFilter}-${globalSearch}`}>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th>Due date</th>
                <th>To/From</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Account</th>
                <th>Method</th>
                <th>GL Code</th>
                <th>Attachment</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selected.has(t.id)}
                      onChange={() => toggleOne(t.id)}
                      aria-label={`Select ${t.title}`}
                    />
                  </td>
                  <td className="date-cell">{formatShortDate(t.date)}</td>
                  <td>
                    <div className="entity-cell">
                      <EntityLogo title={t.title} />
                      <span className="entity-name">{t.title}</span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="amount-cell">
                    ${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="account-cell">{t.account}</td>
                  <td>
                    <span className="method-chip">
                      <span className="dot" />
                      {t.methodLabel}
                    </span>
                  </td>
                  <td>
                    <span className="gl-select">
                      {t.glCode} <ChevronDown size={12} style={{ opacity: 0.5 }} />
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="attach-btn"
                      aria-label="Add attachment"
                      onClick={() => onToast('Attachment picker opened')}
                    >
                      <Plus size={14} />
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="attach-btn"
                      aria-label="Actions"
                      onClick={() => setDetail(t)}
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10}>
                    <div className="empty-state">No transactions match your filters.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {filtered.length === 0 ? 0 : 1}–{filtered.length} of {filtered.length} results
          {' · '}
          {stats.activeCount} active · Balance{' '}
          {stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {cur}
        </div>
      </div>

      <Modal open={!!detail} title="Transaction Details" onClose={() => setDetail(null)}>
        {detail && (
          <>
            <div className="form-group">
              <label>Title</label>
              <div style={{ fontWeight: 600 }}>{detail.title}</div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <div style={{ textTransform: 'capitalize' }}>{detail.type}</div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <StatusBadge status={detail.status} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Amount</label>
                <div style={{ fontWeight: 650 }}>
                  ${detail.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="form-group">
                <label>Date</label>
                <div>{formatShortDate(detail.date)}</div>
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <div>{detail.category}</div>
            </div>
            <div className="form-group">
              <label>Payment method</label>
              <div>{detail.paymentMethod}</div>
            </div>
            <div className="form-group">
              <label>Account</label>
              <div>{detail.account}</div>
            </div>
            {detail.description && (
              <div className="form-group">
                <label>Description</label>
                <div>{detail.description}</div>
              </div>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  duplicateTransaction(detail.id);
                  onToast('Transaction duplicated');
                  setDetail(null);
                }}
              >
                Duplicate
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  deleteTransaction(detail.id);
                  onToast('Transaction deleted');
                  setDetail(null);
                }}
              >
                Delete
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setDetail(null)}>
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
