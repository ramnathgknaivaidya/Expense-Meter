'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Transaction } from '@/lib/mock-data';
import { TransactionForm } from './TransactionForm';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (updates: Partial<Transaction>) => void;
}

export function EditTransactionModal({ isOpen, onClose, transaction, onSave }: EditTransactionModalProps) {
  if (!transaction) return null;

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
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <TransactionForm
              title="Edit Transaction"
              description="Update the details of this transaction"
              initialData={transaction}
              onSubmit={(updates) => {
                onSave(updates);
                onClose();
              }}
              onCancel={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
