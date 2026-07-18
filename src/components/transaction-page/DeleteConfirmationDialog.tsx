'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/mock-data';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
}

export function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, transaction }: DeleteConfirmationDialogProps) {
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
            className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 overflow-hidden"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-rose-100 rounded-full text-rose-600 mb-4">
                <Trash2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Delete Transaction?</h3>
              <p className="text-slate-500 text-sm mt-2">
                This action cannot be undone. Are you sure you want to delete <span className="font-bold text-slate-700">"{transaction.title}"</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
