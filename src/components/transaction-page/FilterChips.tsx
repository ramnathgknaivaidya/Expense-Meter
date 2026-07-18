'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DateRange } from '@/hooks/useTransactionManager';

interface FilterChipsProps {
  activeRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

const RANGES: { label: string; value: DateRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'custom' },
];

export function FilterChips({ activeRange, onRangeChange }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      {RANGES.map((range) => (
        <motion.button
          key={range.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRangeChange(range.value)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap",
            activeRange === range.value
              ? "bg-slate-900 text-white shadow-md"
              : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          {range.label}
        </motion.button>
      ))}
    </div>
  );
}
