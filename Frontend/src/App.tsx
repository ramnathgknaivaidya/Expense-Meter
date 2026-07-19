import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar, type AppNotification } from './components/Topbar';
import { PageTransition } from './components/PageTransition';
import { useAppStore } from './data/store';
import type { PageId } from './types';
import { filterTransactions } from './utils/search';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Income } from './pages/Income';
import { Expenses } from './pages/Expenses';
import { Analytics } from './pages/Analytics';
import { Budget } from './pages/Budget';
import { Settings } from './pages/Settings';

const SEARCHABLE: PageId[] = ['transactions', 'home', 'income', 'expenses'];

export default function App() {
  const store = useAppStore();
  const [page, setPage] = useState<PageId>('transactions');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [toastLeaving, setToastLeaving] = useState(false);
  /** Demo starts empty — “No notifications” until something adds one. */
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const pushNotification = (title: string, body: string) => {
    setNotifications((prev) =>
      [
        {
          id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          title,
          body,
          time: 'Just now',
          read: false,
        },
        ...prev,
      ].slice(0, 20)
    );
  };

  const onToast = (msg: string) => {
    setToastLeaving(false);
    setToast(msg);
    // Important alerts also land in the bell tray (demo starts empty)
    if (/budget|alert|auto-saved|over limit|warning|exceeded/i.test(msg)) {
      pushNotification(
        /auto-saved/i.test(msg) ? 'Savings' : 'Budget alert',
        msg
      );
    }
  };

  const resultCount = useMemo(() => {
    if (!search.trim()) return null;
    return filterTransactions(store.transactions, search).length;
  }, [search, store.transactions]);

  const handleSearch = (v: string) => {
    setSearch(v);
    // Jump to a page that shows matching rows so search feels live
    if (v.trim() && !SEARCHABLE.includes(page)) {
      setPage('transactions');
    }
  };

  useEffect(() => {
    if (!toast) return;
    const leave = setTimeout(() => setToastLeaving(true), 2200);
    const clear = setTimeout(() => {
      setToast(null);
      setToastLeaving(false);
    }, 2600);
    return () => {
      clearTimeout(leave);
      clearTimeout(clear);
    };
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const el = document.querySelector<HTMLInputElement>('.search-box input');
        el?.focus();
        el?.select();
      }
      if (e.key === 'Escape' && search) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [search]);

  const pageContent = (() => {
    switch (page) {
      case 'home':
        return (
          <Dashboard
            store={store}
            onNavigate={setPage}
            onToast={onToast}
            search={search}
          />
        );
      case 'transactions':
        return <Transactions store={store} globalSearch={search} onToast={onToast} />;
      case 'income':
        return <Income store={store} onToast={onToast} search={search} />;
      case 'expenses':
        return <Expenses store={store} onToast={onToast} search={search} />;
      case 'analytics':
        return <Analytics store={store} onToast={onToast} />;
      case 'budget':
        return <Budget store={store} onToast={onToast} />;
      case 'settings':
        return <Settings store={store} onToast={onToast} />;
      default:
        return null;
    }
  })();

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={setPage} />
      <div className="main-col">
        <Topbar
          profile={store.profile}
          search={search}
          onSearch={handleSearch}
          resultCount={resultCount}
          notifications={notifications}
          onOpenSettings={() => setPage('settings')}
          onClearNotifications={() => setNotifications([])}
        />
        <main className="content">
          <PageTransition pageKey={page}>{pageContent}</PageTransition>
        </main>
      </div>
      {toast && (
        <div className={`toast ${toastLeaving ? 'leaving' : ''}`} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
