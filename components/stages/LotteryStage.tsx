'use client';

import React, { useEffect, useState } from 'react';
import { ScreenTransition } from '../ui/ScreenTransition';
import { motion } from 'framer-motion';

const LOADING_PHRASES = [
  "Checking eligibility...",
  "Verifying submissions...",
  "Selecting winners...",
  "Finalizing results..."
];

export function LotteryStage({ countdown }: { countdown: number }) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex(prev => (prev + 1) % LOADING_PHRASES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenTransition id="lottery-stage">
      <div className="flex flex-col items-center justify-center h-full w-full bg-foreground text-background px-6 text-center absolute inset-0 z-50">
        
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-6xl mb-8"
        >
          🎉
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-medium tracking-wide mb-12 text-muted">
          Preparing reward draw
        </h1>

        <motion.div
          key={countdown}
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-8xl md:text-9xl font-bold tabular-nums mb-16 tracking-tighter"
        >
          {countdown}
        </motion.div>

        <motion.div
          key={phraseIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl md:text-2xl font-mono text-accent"
        >
          {LOADING_PHRASES[phraseIndex]}
        </motion.div>
        
      </div>
    </ScreenTransition>
  );
}
