import type { Transaction } from '../types';

/** Case-insensitive match across common transaction fields. */
export function matchesSearch(t: Transaction, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    t.title,
    t.category,
    t.type,
    t.status,
    t.account,
    t.paymentMethod,
    t.methodLabel,
    t.glCode,
    t.description,
    t.merchant,
    t.notes,
    t.receiptName,
    String(t.amount),
    t.date,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

export function filterTransactions(list: Transaction[], query: string): Transaction[] {
  const q = query.trim();
  if (!q) return list;
  return list.filter((t) => matchesSearch(t, q));
}
