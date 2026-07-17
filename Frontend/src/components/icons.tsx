import type { CSSProperties } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  UtensilsCrossed,
  Car,
  Home,
  FileText,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Clapperboard,
  Plane,
  Package,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Gift,
  Sparkles,
  LayoutGrid,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  CreditCard,
  Target,
  Wallet,
  Banknote,
  CircleDollarSign,
} from 'lucide-react';

export type IconTone = 'green' | 'orange' | 'blue' | 'purple' | 'red' | 'slate' | 'teal' | 'pink';

const TONE_STYLES: Record<IconTone, { bg: string; fg: string; darkBg: string }> = {
  green: { bg: '#d1fae5', fg: '#059669', darkBg: '#064e3b' },
  orange: { bg: '#ffedd5', fg: '#ea580c', darkBg: '#7c2d12' },
  blue: { bg: '#dbeafe', fg: '#2563eb', darkBg: '#1e3a5f' },
  purple: { bg: '#ede9fe', fg: '#7c3aed', darkBg: '#4c1d95' },
  red: { bg: '#fee2e2', fg: '#dc2626', darkBg: '#7f1d1d' },
  slate: { bg: '#f1f5f9', fg: '#475569', darkBg: '#1e293b' },
  teal: { bg: '#ccfbf1', fg: '#0d9488', darkBg: '#134e4a' },
  pink: { bg: '#fce7f3', fg: '#db2777', darkBg: '#831843' },
};

export const INCOME_ICONS: Record<string, { Icon: LucideIcon; tone: IconTone }> = {
  Salary: { Icon: Briefcase, tone: 'green' },
  Freelance: { Icon: Laptop, tone: 'teal' },
  Business: { Icon: Building2, tone: 'blue' },
  Investment: { Icon: TrendingUp, tone: 'purple' },
  Bonus: { Icon: Gift, tone: 'orange' },
  'Rental Income': { Icon: Home, tone: 'slate' },
  Other: { Icon: Sparkles, tone: 'pink' },
};

export const EXPENSE_ICONS: Record<string, { Icon: LucideIcon; tone: IconTone }> = {
  Food: { Icon: UtensilsCrossed, tone: 'orange' },
  Transport: { Icon: Car, tone: 'blue' },
  Housing: { Icon: Home, tone: 'slate' },
  Bills: { Icon: FileText, tone: 'purple' },
  Shopping: { Icon: ShoppingBag, tone: 'pink' },
  Healthcare: { Icon: HeartPulse, tone: 'red' },
  Education: { Icon: GraduationCap, tone: 'teal' },
  Entertainment: { Icon: Clapperboard, tone: 'purple' },
  Travel: { Icon: Plane, tone: 'blue' },
  Other: { Icon: Package, tone: 'slate' },
};

interface SoftIconProps extends LucideProps {
  Icon: LucideIcon;
  tone?: IconTone;
  size?: number;
  box?: number;
  className?: string;
}

/** Soft rounded icon tile — matches screenshot fintech style (no emoji). */
export function SoftIcon({
  Icon,
  tone = 'slate',
  size = 18,
  box = 36,
  className = '',
  strokeWidth = 1.75,
  ...rest
}: SoftIconProps) {
  const t = TONE_STYLES[tone];
  return (
    <span
      className={`soft-icon ${className}`}
      style={
        {
          width: box,
          height: box,
          '--soft-bg': t.bg,
          '--soft-fg': t.fg,
          '--soft-dark-bg': t.darkBg,
        } as CSSProperties
      }
      aria-hidden
    >
      <Icon size={size} strokeWidth={strokeWidth} color={t.fg} {...rest} />
    </span>
  );
}

export function IncomeCategoryIcon({
  name,
  box = 40,
}: {
  name: string;
  box?: number;
}) {
  const meta = INCOME_ICONS[name] ?? { Icon: CircleDollarSign, tone: 'green' as IconTone };
  return <SoftIcon Icon={meta.Icon} tone={meta.tone} box={box} size={Math.round(box * 0.45)} />;
}

export function ExpenseCategoryIcon({
  name,
  box = 40,
}: {
  name: string;
  box?: number;
}) {
  const meta = EXPENSE_ICONS[name] ?? { Icon: Package, tone: 'orange' as IconTone };
  return <SoftIcon Icon={meta.Icon} tone={meta.tone} box={box} size={Math.round(box * 0.45)} />;
}

export {
  LayoutGrid,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  CreditCard,
  Target,
  Wallet,
  Banknote,
  CircleDollarSign,
};
