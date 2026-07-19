export function formatMoney(
  amount: number,
  currency = 'USD',
  opts?: { sign?: boolean; decimals?: number }
) {
  const decimals = opts?.decimals ?? 2;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '' : '';
  const suffix = currency === 'USD' ? ' USD' : currency === 'INR' ? '' : ` ${currency}`;
  const prefix =
    opts?.sign === false ? '' : amount > 0 ? '+' : amount < 0 ? '-' : '';
  if (currency === 'INR') {
    return `${prefix}₹${formatted}`;
  }
  if (currency === 'USD') {
    return `${prefix}${formatted}${suffix}`;
  }
  return `${prefix}${symbol}${formatted}${suffix}`;
}

export function formatDateDisplay(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export function formatShortDate(iso: string) {
  // Photo style: Oct 12-2026
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const mon = d.toLocaleString('en', { month: 'short' });
  const day = String(d.getDate()).padStart(2, '0');
  return `${mon} ${day}-${d.getFullYear()}`;
}
