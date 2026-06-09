import React from 'react';
import { motion } from 'framer-motion';

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = total === 0 ? 0 : Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full h-4 bg-muted rounded-full overflow-hidden relative">
      <motion.div
        className="absolute top-0 left-0 h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      />
    </div>
  );
}
