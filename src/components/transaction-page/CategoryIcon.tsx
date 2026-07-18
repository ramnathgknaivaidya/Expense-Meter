'use client';

import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Wallet,
  TrendingUp,
  HeartPulse,
  Gamepad2,
  Zap,
  HelpCircle
} from 'lucide-react';
import { TransactionCategory } from '@/hooks/useTransactionManager';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<TransactionCategory, React.ElementType> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Salary: Wallet,
  Investment: TrendingUp,
  Health: HeartPulse,
  Entertainment: Gamepad2,
  Utilities: Zap,
  Other: HelpCircle,
};

const COLOR_MAP: Record<TransactionCategory, string> = {
  Food: 'bg-orange-100 text-orange-600',
  Transport: 'bg-blue-100 text-blue-600',
  Shopping: 'bg-purple-100 text-purple-600',
  Salary: 'bg-emerald-100 text-emerald-600',
  Investment: 'bg-indigo-100 text-indigo-600',
  Health: 'bg-rose-100 text-rose-600',
  Entertainment: 'bg-amber-100 text-amber-600',
  Utilities: 'bg-slate-100 text-slate-600',
  Other: 'bg-gray-100 text-gray-600',
};

export function CategoryIcon({ category }: { category: TransactionCategory }) {
  const Icon = ICON_MAP[category] || HelpCircle;
  const colorClass = COLOR_MAP[category] || COLOR_MAP.Other;

  return (
    <div className={cn("p-2 rounded-xl", colorClass)}>
      <Icon className="h-5 w-5" />
    </div>
  );
}
