import { useEffect, useRef, useState } from 'react';
import { Bell, Search, X, Settings } from 'lucide-react';
import type { UserProfile } from '../types';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read?: boolean;
}

interface TopbarProps {
  profile: UserProfile;
  search: string;
  onSearch: (v: string) => void;
  resultCount?: number | null;
  notifications?: AppNotification[];
  onOpenSettings: () => void;
  onClearNotifications?: () => void;
}

export function Topbar({
  profile,
  search,
  onSearch,
  resultCount,
  notifications = [],
  onOpenSettings,
  onClearNotifications,
}: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const hasQuery = search.trim().length > 0;
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!notifOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [notifOpen]);

  return (
    <header className="topbar">
      <div className={`search-box ${hasQuery ? 'has-query' : ''}`}>
        <Search size={15} strokeWidth={1.75} />
        <input
          type="text"
          placeholder="Search transactions, categories, amounts..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search transactions"
          autoComplete="off"
          spellCheck={false}
        />
        {hasQuery && resultCount != null && (
          <span className="search-count" title="Matching results">
            {resultCount}
          </span>
        )}
        {hasQuery ? (
          <button
            type="button"
            className="search-clear"
            onClick={() => onSearch('')}
            aria-label="Clear search"
          >
            <X size={14} strokeWidth={2} />
          </button>
        ) : (
          <span className="kbd-hint">Ctrl K</span>
        )}
      </div>

      <div className="topbar-actions">
        <div className="notif-wrap" ref={notifRef}>
          <button
            type="button"
            className={`icon-btn ${notifOpen ? 'active' : ''}`}
            aria-label="Notifications"
            aria-expanded={notifOpen}
            aria-haspopup="true"
            onClick={() => setNotifOpen((o) => !o)}
          >
            <Bell size={16} strokeWidth={1.75} />
            {unread > 0 && <span className="notif-dot" aria-hidden />}
          </button>

          {notifOpen && (
            <div className="notif-dropdown" role="menu">
              <div className="notif-dropdown-header">
                <span>Notifications</span>
                {notifications.length > 0 && onClearNotifications && (
                  <button type="button" className="notif-clear-all" onClick={onClearNotifications}>
                    Clear all
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <div className="notif-empty-icon">
                    <Bell size={22} strokeWidth={1.5} />
                  </div>
                  <p className="notif-empty-title">No notifications</p>
                  <p className="notif-empty-sub">You’re all caught up. New alerts will show here.</p>
                </div>
              ) : (
                <ul className="notif-list">
                  {notifications.map((n) => (
                    <li key={n.id} className={n.read ? 'read' : ''}>
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-body">{n.body}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="profile-btn"
          onClick={onOpenSettings}
          title={`${profile.name} — Settings`}
          aria-label="Open profile settings"
        >
          {profile.avatar ? (
            <img className="avatar" src={profile.avatar} alt="" />
          ) : (
            <div className="avatar-fallback">{initials}</div>
          )}
          <span className="profile-btn-meta">
            <span className="profile-btn-name">{profile.name.split(' ')[0]}</span>
            <Settings size={12} strokeWidth={2} className="profile-btn-gear" aria-hidden />
          </span>
        </button>
      </div>
    </header>
  );
}
