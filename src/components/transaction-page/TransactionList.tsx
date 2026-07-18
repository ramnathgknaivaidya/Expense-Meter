'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '@/lib/mock-data';
import { TransactionCard } from './TransactionCard';
import { Inbox } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onView: (t: Transaction) => void;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onDuplicate: (t: Transaction) => void;
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export function TransactionList({
  transactions,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  isLoading = false
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 w-full bg-slate-200 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No transactions found</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
          We couldn't find any transactions matching your current filters. Try adjusting them.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-3"
    >
      <AnimatePresence mode="popLayout">
        {transactions.map((t) => (
          <TransactionCard
            key={t.id}
            transaction={t}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
