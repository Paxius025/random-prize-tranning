'use client';

import React from 'react';
import { ScreenTransition } from '../ui/ScreenTransition';
import { ProgressBar } from '../ui/ProgressBar';

export function WaitingScreen({ 
  completedCount, 
  totalCount, 
  title = "Submitted ✓",
  subtitle = "Waiting for friends..."
}: { 
  completedCount: number;
  totalCount: number;
  title?: string;
  subtitle?: string;
}) {
  return (
    <ScreenTransition id="waiting-screen">
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-6 space-y-8">
        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-success">{title}</h2>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>

        <div className="w-full space-y-3 pt-8">
          <ProgressBar current={completedCount} total={totalCount} />
          <p className="text-sm font-medium text-muted-foreground">
            {completedCount} / {totalCount} completed
          </p>
        </div>
      </div>
    </ScreenTransition>
  );
}
