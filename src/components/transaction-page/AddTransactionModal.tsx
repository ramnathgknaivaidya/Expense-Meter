'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { TransactionType } from '@/lib/mock-data';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  onSave: (data: any) => void;
}

export function AddTransactionModal({ isOpen, onClose, type, onSave }: AddTransactionModalProps) {
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
              title={`Add ${type === 'income' ? 'Income' : 'Expense'}`}
              description={`Enter the details for this ${type} transaction`}
              initialData={{ type }}
              onSubmit={(data) => {
                onSave({ ...data, type });
              }}
              onCancel={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
