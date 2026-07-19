import type { TransactionStatus } from '../types';

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const cls =
    status === 'Completed' ? 'completed' : status === 'Canceled' ? 'canceled' : 'pending';
  return <span className={`badge ${cls}`}>{status}</span>;
}
