'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'income' | 'expense') => void;
}

export function AddTransactionChoiceModal({ isOpen, onClose, onSelectType }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-900">New Transaction</h3>
              <p className="text-slate-500 text-sm mt-1">What would you like to add?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectType('income')}
                className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <ArrowUpCircle className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">Add Income</span>
                </div>
                <div className="text-emerald-600 font-medium text-sm">+</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectType('expense')}
                className="flex items-center justify-between p-4 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500 rounded-lg text-white">
                    <ArrowDownCircle className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-slate-700 group-hover:text-rose-700 transition-colors">Add Expense</span>
                </div>
                <div className="text-rose-600 font-medium text-sm">-</div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
