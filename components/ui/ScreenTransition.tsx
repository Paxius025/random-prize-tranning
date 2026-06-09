'use client';

import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

export function ScreenTransition({ children, id }: { children: React.ReactNode; id: string | number }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.98 }}
        transition={{ 
          duration: 0.35, 
          ease: [0.22, 1, 0.36, 1] // Custom apple-like ease out
        }}
        className="w-full flex-1 flex flex-col items-center justify-center"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
