'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Wallet, MapPin, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Transaction } from '@/lib/mock-data';

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function ViewTransactionModal({ isOpen, onClose, transaction }: ViewTransactionModalProps) {
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

            <div className="flex flex-col gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-2xl text-slate-600 mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{transaction.title}</h3>
                <div className={cn(
                  "text-3xl font-black mt-2",
                  transaction.type === 'income' ? "text-emerald-600" : "text-slate-900"
                )}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem icon={<Calendar className="h-4 w-4" />} label="Date" value={transaction.date.split('T')[0]} />
                <DetailItem icon={<Tag className="h-4 w-4" />} label="Category" value={transaction.category} />
                <DetailItem icon={<Wallet className="h-4 w-4" />} label="Payment Method" value={transaction.paymentMethod} />
                <DetailItem icon={<MapPin className="h-4 w-4" />} label="Merchant" value={transaction.merchant} />
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Description</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{transaction.description}</p>
                </div>
                {transaction.notes && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Notes</span>
                    <p className="text-slate-600 text-sm leading-relaxed">{transaction.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-medium">
                No receipt attached
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
        {icon}
      </div>
      <div>
        <span className="text-xs text-slate-400 block font-medium">{label}</span>
        <span className="text-sm font-semibold text-slate-700">{value}</span>
      </div>
    </div>
  );
}
