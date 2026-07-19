import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BudgetLimit, SavingsGoal, Transaction, UserProfile } from '../types';
import {
  SEED_BUDGETS,
  SEED_GOALS,
  SEED_PROFILE,
  SEED_TRANSACTIONS,
} from './seed';

/** Bump version when seed shape changes so demos reload fresh dynamic data. */
const STORAGE_KEY = 'expense-meter-v2';

interface AppState {
  transactions: Transaction[];
  budgets: BudgetLimit[];
  goals: SavingsGoal[];
  profile: UserProfile;
  monthlyBudget: number;
}

export interface LiveStats {
  /** All-time completed income */
  income: number;
  /** All-time completed expense */
  expense: number;
  balance: number;
  savingsPct: number;
  /** This month money in (income) — drives Transactions card */
  moneyIn: number;
  /** This month money out (expense) — drives Transactions card */
  moneyOut: number;
  /** This month net = moneyIn - moneyOut */
  netChange: number;
  /** @deprecated use moneyIn / moneyOut / netChange — kept as aliases for UI */
  photoIn: number;
  photoOut: number;
  photoNet: number;
  byCategory: Record<string, number>;
  byIncomeSource: Record<string, number>;
  /** Category spend this month only (for budget progress) */
  byCategoryMonth: Record<string, number>;
  topExpense: string;
  topIncome: string;
  monthIncome: number;
  monthExpense: number;
  prevMonthIncome: number;
  prevMonthExpense: number;
  incomeGrowthPct: number;
  expenseGrowthPct: number;
  dailyAvg: number;
  monthlyTrend: { month: string; income: number; expense: number; net: number }[];
  remainingBudget: number;
  budgetUsagePct: number;
  daysInMonth: number;
  activeCount: number;
  /** Increments when data changes — use as chart key for re-animation */
  revision: number;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as AppState;
    }
  } catch {
    /* ignore */
  }
  return {
    transactions: SEED_TRANSACTIONS,
    budgets: SEED_BUDGETS,
    goals: SEED_GOALS,
    profile: SEED_PROFILE,
    monthlyBudget: 50000,
  };
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function isActive(t: Transaction) {
  return t.status !== 'Canceled';
}

function inMonth(iso: string, month: number, year: number) {
  const d = new Date(iso);
  return d.getMonth() === month && d.getFullYear() === year;
}

function sum(list: Transaction[], type?: 'income' | 'expense') {
  return list
    .filter((t) => (type ? t.type === type : true) && isActive(t))
    .reduce((s, t) => s + t.amount, 0);
}

export function computeStats(
  transactions: Transaction[],
  monthlyBudget: number,
  revision = 0
): LiveStats {
  const active = transactions.filter(isActive);
  const income = sum(active, 'income');
  const expense = sum(active, 'expense');
  const balance = income - expense;
  const savingsPct = income > 0 ? ((income - expense) / income) * 100 : 0;

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const prev = new Date(year, month - 1, 1);
  const prevMonth = prev.getMonth();
  const prevYear = prev.getFullYear();

  const thisMonth = active.filter((t) => inMonth(t.date, month, year));
  const lastMonth = active.filter((t) => inMonth(t.date, prevMonth, prevYear));

  const monthIncome = sum(thisMonth, 'income');
  const monthExpense = sum(thisMonth, 'expense');
  const prevMonthIncome = sum(lastMonth, 'income');
  const prevMonthExpense = sum(lastMonth, 'expense');

  const moneyIn = monthIncome;
  const moneyOut = monthExpense;
  const netChange = moneyIn - moneyOut;

  const byCategory: Record<string, number> = {};
  const byCategoryMonth: Record<string, number> = {};
  const byIncomeSource: Record<string, number> = {};

  active.forEach((t) => {
    if (t.type === 'expense') {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      if (inMonth(t.date, month, year)) {
        byCategoryMonth[t.category] = (byCategoryMonth[t.category] || 0) + t.amount;
      }
    } else {
      byIncomeSource[t.category] = (byIncomeSource[t.category] || 0) + t.amount;
    }
  });

  const topExpense =
    Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const topIncome =
    Object.entries(byIncomeSource).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const dailyAvg = dayOfMonth > 0 ? monthExpense / dayOfMonth : 0;

  const incomeGrowthPct =
    prevMonthIncome > 0
      ? ((monthIncome - prevMonthIncome) / prevMonthIncome) * 100
      : monthIncome > 0
        ? 100
        : 0;
  const expenseGrowthPct =
    prevMonthExpense > 0
      ? ((monthExpense - prevMonthExpense) / prevMonthExpense) * 100
      : monthExpense > 0
        ? 100
        : 0;

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(year, month - (5 - i), 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    const label = d.toLocaleString('en', { month: 'short' });
    const list = active.filter((t) => inMonth(t.date, m, y));
    const inc = sum(list, 'income');
    const exp = sum(list, 'expense');
    return { month: label, income: inc, expense: exp, net: inc - exp };
  });

  const remainingBudget = monthlyBudget - monthExpense;
  const budgetUsagePct =
    monthlyBudget > 0 ? Math.min(100, (monthExpense / monthlyBudget) * 100) : 0;

  return {
    income,
    expense,
    balance,
    savingsPct,
    moneyIn,
    moneyOut,
    netChange,
    photoIn: moneyIn,
    photoOut: moneyOut,
    photoNet: netChange,
    byCategory,
    byCategoryMonth,
    byIncomeSource,
    topExpense,
    topIncome,
    monthIncome,
    monthExpense,
    prevMonthIncome,
    prevMonthExpense,
    incomeGrowthPct,
    expenseGrowthPct,
    dailyAvg,
    monthlyTrend,
    remainingBudget,
    budgetUsagePct,
    daysInMonth,
    activeCount: active.length,
    revision,
  };
}

export type MutationResult = {
  transaction?: Transaction;
  alerts: string[];
};

export function useAppStore() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.profile.darkMode);
  }, [state.profile.darkMode]);

  const bump = useCallback(() => setRevision((r) => r + 1), []);

  const setTransactions = useCallback(
    (transactions: Transaction[]) => {
      setState((s) => ({ ...s, transactions }));
      bump();
    },
    [bump]
  );

  /** Add income/expense — cascades into all stats, budgets, optional goal drip. */
  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>): MutationResult => {
      const full: Transaction = { ...tx, id: uid('tx') };
      const alerts: string[] = [];

      setState((s) => {
        let goals = s.goals;
        const nextTx = [full, ...s.transactions];

        // Auto-save 5% of completed income into first incomplete goal
        if (
          full.type === 'income' &&
          full.status === 'Completed' &&
          full.amount > 0
        ) {
          const drip = Math.round(full.amount * 0.05 * 100) / 100;
          const idx = goals.findIndex((g) => g.saved < g.target);
          if (idx >= 0 && drip > 0) {
            goals = goals.map((g, i) =>
              i === idx
                ? { ...g, saved: Math.min(g.target, Math.round((g.saved + drip) * 100) / 100) }
                : g
            );
            alerts.push(
              `Auto-saved ${drip.toLocaleString()} toward “${goals[idx].name}” (5% of income)`
            );
          }
        }

        // Budget alerts on completed expense
        if (
          full.type === 'expense' &&
          full.status === 'Completed' &&
          s.profile.notifications.budgetAlerts
        ) {
          const now = new Date();
          const monthSpend =
            nextTx
              .filter(
                (t) =>
                  t.type === 'expense' &&
                  t.status !== 'Canceled' &&
                  t.category === full.category &&
                  inMonth(t.date, now.getMonth(), now.getFullYear())
              )
              .reduce((a, t) => a + t.amount, 0) + 0;

          const limit = s.budgets.find((b) => b.category === full.category)?.limit;
          if (limit && monthSpend > limit) {
            alerts.push(
              `Budget alert: ${full.category} is over limit (${monthSpend.toLocaleString()} / ${limit.toLocaleString()})`
            );
          } else if (limit && monthSpend > limit * 0.8) {
            alerts.push(
              `Warning: ${full.category} used ${Math.round((monthSpend / limit) * 100)}% of budget`
            );
          }

          const monthExpenseTotal = nextTx
            .filter(
              (t) =>
                t.type === 'expense' &&
                t.status !== 'Canceled' &&
                inMonth(t.date, now.getMonth(), now.getFullYear())
            )
            .reduce((a, t) => a + t.amount, 0);
          if (monthExpenseTotal > s.monthlyBudget) {
            alerts.push(
              `Monthly budget exceeded (${monthExpenseTotal.toLocaleString()} / ${s.monthlyBudget.toLocaleString()})`
            );
          }
        }

        return { ...s, transactions: nextTx, goals };
      });
      bump();
      return { transaction: full, alerts };
    },
    [bump]
  );

  const updateTransaction = useCallback(
    (id: string, patch: Partial<Transaction>) => {
      setState((s) => ({
        ...s,
        transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...patch } : t)),
      }));
      bump();
    },
    [bump]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        transactions: s.transactions.filter((t) => t.id !== id),
      }));
      bump();
    },
    [bump]
  );

  const duplicateTransaction = useCallback(
    (id: string) => {
      setState((s) => {
        const src = s.transactions.find((t) => t.id === id);
        if (!src) return s;
        const copy: Transaction = {
          ...src,
          id: uid('tx'),
          title: `${src.title} (copy)`,
          status: 'Pending Review',
          date: new Date().toISOString().slice(0, 10),
        };
        return { ...s, transactions: [copy, ...s.transactions] };
      });
      bump();
    },
    [bump]
  );

  const setBudgets = useCallback(
    (budgets: BudgetLimit[]) => {
      setState((s) => ({ ...s, budgets }));
      bump();
    },
    [bump]
  );

  const updateBudget = useCallback(
    (category: string, limit: number) => {
      setState((s) => ({
        ...s,
        budgets: s.budgets.map((b) => (b.category === category ? { ...b, limit } : b)),
      }));
      bump();
    },
    [bump]
  );

  const setMonthlyBudget = useCallback(
    (monthlyBudget: number) => {
      setState((s) => ({ ...s, monthlyBudget }));
      bump();
    },
    [bump]
  );

  const setGoals = useCallback(
    (goals: SavingsGoal[]) => {
      setState((s) => ({ ...s, goals }));
      bump();
    },
    [bump]
  );

  const updateGoal = useCallback(
    (id: string, patch: Partial<SavingsGoal>) => {
      setState((s) => ({
        ...s,
        goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
      }));
      bump();
    },
    [bump]
  );

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((s) => ({
      ...s,
      profile: {
        ...s.profile,
        ...patch,
        notifications: patch.notifications
          ? { ...s.profile.notifications, ...patch.notifications }
          : s.profile.notifications,
      },
    }));
  }, []);

  const resetData = useCallback(() => {
    const fresh = {
      transactions: SEED_TRANSACTIONS,
      budgets: SEED_BUDGETS,
      goals: SEED_GOALS,
      profile: SEED_PROFILE,
      monthlyBudget: 50000,
    };
    setState(fresh);
    saveState(fresh);
    bump();
  }, [bump]);

  const exportCSV = useCallback(() => {
    const headers = [
      'Type',
      'Title',
      'Category',
      'Amount',
      'Date',
      'Payment Method',
      'Account',
      'Status',
      'Description',
    ];
    const rows = state.transactions.map((t) =>
      [
        t.type,
        t.title,
        t.category,
        t.amount,
        t.date,
        t.paymentMethod,
        t.account,
        t.status,
        t.description ?? '',
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-meter-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.transactions]);

  const stats = useMemo(
    () => computeStats(state.transactions, state.monthlyBudget, revision),
    [state.transactions, state.monthlyBudget, revision]
  );

  return {
    ...state,
    stats,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    duplicateTransaction,
    setBudgets,
    updateBudget,
    setMonthlyBudget,
    setGoals,
    updateGoal,
    updateProfile,
    resetData,
    exportCSV,
  };
}

export type AppStore = ReturnType<typeof useAppStore>;
