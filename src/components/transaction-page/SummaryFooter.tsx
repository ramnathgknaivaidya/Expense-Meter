'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, List } from 'lucide-react';

interface SummaryFooterProps {
  transactions: Transaction[];
}

export function SummaryFooter({ transactions }: SummaryFooterProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-slate-700/50 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar"
      >
        <StatTile
          icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
          label="Income"
          value={totalIncome}
          color="text-emerald-400"
        />
        <div className="h-8 w-px bg-slate-700 hidden sm:block" />
        <StatTile
          icon={<TrendingDown className="h-4 w-4 text-rose-400" />}
          label="Expense"
          value={totalExpense}
          color="text-rose-400"
        />
        <div className="h-8 w-px bg-slate-700 hidden sm:block" />
        <StatTile
          icon={<Wallet className="h-4 w-4 text-blue-400" />}
          label="Balance"
          value={netBalance}
          color="text-blue-400"
          isBalance
        />
        <div className="h-8 w-px bg-slate-700 hidden sm:block" />
        <StatTile
          icon={<List className="h-4 w-4 text-slate-400" />}
          label="Count"
          value={transactions.length}
          color="text-slate-400"
          isCount
        />
      </motion.div>
    </div>
  );
}

function StatTile({ icon, label, value, color, isBalance, isCount }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  isBalance?: boolean;
  isCount?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 min-w-max px-2">
      <div className="p-1.5 bg-slate-800 rounded-lg">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{label}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn("text-sm font-bold", color)}
        >
          {isCount ? value : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
        </motion.span>
      </div>
    </div>
  );
}
