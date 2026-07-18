'use client';

import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, PaymentMethod } from '@/lib/mock-data';

interface TransactionFormProps {
  initialData?: Partial<Transaction>;
  onSubmit: (data: Partial<Transaction>) => void;
  onCancel: () => void;
  title: string;
  description: string;
}

export function TransactionForm({ initialData, onSubmit, onCancel, title, description }: TransactionFormProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>(initialData || {});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="text-center mb-2">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500 text-sm mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Title</label>
          <input
            required
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Amount</label>
          <input
            required
            type="number"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Merchant</label>
          <input
            required
            type="text"
            value={formData.merchant || ''}
            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Category</label>
          <select
            value={formData.category || 'Other'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Salary">Salary</option>
            <option value="Investment">Investment</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Payment Method</label>
          <select
            value={formData.paymentMethod || 'Cash'}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Apple Pay">Apple Pay</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Date</label>
          <input
            required
            type="date"
            value={formData.date ? formData.date.split('T')[0] : new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          Save Transaction
        </button>
      </div>
    </form>
  );
}
