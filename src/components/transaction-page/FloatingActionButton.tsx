'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FABProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-6 md:hidden z-40 p-4 bg-slate-900 text-white rounded-full shadow-2xl",
        "flex items-center justify-center active:bg-slate-800 transition-colors"
      )}
    >
      <Plus className="h-6 w-6" />
    </motion.button>
  );
}
