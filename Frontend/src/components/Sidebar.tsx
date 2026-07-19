import {
  Home,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Settings,
  ChevronDown,
  CreditCard,
} from 'lucide-react';
import type { PageId } from '../types';

interface SidebarProps {
  page: PageId;
  onNavigate: (p: PageId) => void;
}

const NAV: { id: PageId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'income', label: 'Income', icon: TrendingUp },
  { id: 'expenses', label: 'Expenses', icon: TrendingDown },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'budget', label: 'Budget & Goals', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ page, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L4 7v5c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V7l-8-4z"
              fill="currentColor"
              opacity="0.9"
            />
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="brand-meta">
          <span className="brand-label">Agency</span>
          <span className="brand-name">Expense Meter</span>
        </div>
      </div>

      <nav className="nav-section" aria-label="Main">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon strokeWidth={1.75} />
              {item.label}
            </button>
          );
        })}

        <div className="nav-group-label">Workflows</div>
        <button type="button" className="nav-item" onClick={() => onNavigate('expenses')}>
          <CreditCard strokeWidth={1.75} />
          Bill Pay
          <ChevronDown className="chevron" />
        </button>
        <button type="button" className="nav-item" onClick={() => onNavigate('income')}>
          <TrendingUp strokeWidth={1.75} />
          Invoicing
          <ChevronDown className="chevron" />
        </button>
        <button type="button" className="nav-item" onClick={() => onNavigate('budget')}>
          <Target strokeWidth={1.75} />
          Reimbursements
        </button>
        <button type="button" className="nav-item" onClick={() => onNavigate('analytics')}>
          <PieChart strokeWidth={1.75} />
          Accounting
        </button>
      </nav>

      <div className="sidebar-promo">
        <div className="promo-chip">
          <CreditCard size={13} strokeWidth={2} aria-hidden />
          GlobalLink
        </div>
        <p className="promo-title">Accept credit cards and bank payment</p>
        <button type="button" className="promo-btn" onClick={() => onNavigate('settings')}>
          Set up now
        </button>
      </div>
    </aside>
  );
}
