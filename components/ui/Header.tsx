'use client';

import React from 'react';

export function Header() {
  return (
    <header className="w-full bg-primary text-primary-foreground py-4 px-6 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
            IoT
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-bold leading-tight">โครงการอบรมเทคโนโลยี IoT</h1>
            <p className="text-xs text-primary-foreground/80">กิจกรรมการเรียนรู้และการออกแบบผลิตภัณฑ์</p>
          </div>
        </div>
        <div className="hidden md:flex items-center">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
            กิจกรรมประจำวันนี้
          </span>
        </div>
      </div>
    </header>
  );
}
