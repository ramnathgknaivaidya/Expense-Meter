'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Eye, Edit2, Trash2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/mock-data';
import { CategoryIcon } from './CategoryIcon';

interface TransactionCardProps {
  transaction: Transaction;
  onView: (t: Transaction) => void;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onDuplicate: (t: Transaction) => void;
}

export function TransactionCard({
  transaction,
  onView,
  onEdit,
  onDelete,
  onDuplicate
}: TransactionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isIncome = transaction.type === 'income';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CategoryIcon category={transaction.category} />
          <div>
            <h4 className="font-semibold text-slate-900 text-sm leading-tight">
              {transaction.title}
            </h4>
            <p className="text-slate-500 text-xs mt-0.5">
              {transaction.merchant} • {transaction.paymentMethod}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={cn(
            "text-right font-bold text-sm",
            isIncome ? "text-emerald-600" : "text-slate-900"
          )}>
            {isIncome ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-label="Transaction actions"
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); onView(transaction); setMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Eye className="h-3 w-3" /> View Details
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(transaction); setMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDuplicate(transaction); setMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Copy className="h-3 w-3" /> Duplicate
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(transaction.id); setMenuOpen(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 uppercase font-medium tracking-wider">
        <span>{transaction.date.split('T')[0]}</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded-md">{transaction.category}</span>
      </div>
    </motion.div>
  );
}
