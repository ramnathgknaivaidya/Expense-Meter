'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAddClick: () => void;
}

export function Header({ searchTerm, setSearchTerm, onAddClick }: HeaderProps) {
  return (
    <header className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your financial flow</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddClick}
            aria-label="Add new transaction"
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors shadow-sm",
              "active:bg-slate-700"
            )}
          >
            <Plus className="h-4 w-4" />
            <span
>Add</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
