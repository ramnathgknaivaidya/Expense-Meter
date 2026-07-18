'use client';

import React from 'react';
import {
  ChevronDown,
  Filter,
  Calendar,
  Wallet,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
  SortOption
} from '@/hooks/useTransactionManager';

interface FilterBarProps {
  filterType: TransactionType | 'all';
  setFilterType: (type: TransactionType | 'all') => void;
  filterCategory: TransactionCategory | 'all';
  setFilterCategory: (cat: TransactionCategory | 'all') => void;
  filterMethod: PaymentMethod | 'all';
  setFilterMethod: (method: PaymentMethod | 'all') => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const CATEGORIES: TransactionCategory[] = ['Food', 'Transport', 'Shopping', 'Salary', 'Investment', 'Health', 'Entertainment', 'Utilities', 'Other'];
const METHODS: PaymentMethod[] = ['Credit Card', 'Bank Transfer', 'Cash', 'UPI', 'Apple Pay'];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Amount', value: 'highest' },
  { label: 'Lowest Amount', value: 'lowest' },
];

export function FilterBar({
  filterType, setFilterType,
  filterCategory, setFilterCategory,
  filterMethod, setFilterMethod,
  sortOption, setSortOption
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400 mr-2">
        <Filter className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full">
        {/* Type Filter */}
        <div className="relative group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="relative group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>

        {/* Method Filter */}
        <div className="relative group">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value as any)}
            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
          >
            <option value="all">All Methods</option>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

        {/* Sort Filter */}
        <div className="relative group">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer hover:bg-slate-100"
          >
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
