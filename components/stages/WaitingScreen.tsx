'use client';

import React from 'react';
import { ScreenTransition } from '../ui/ScreenTransition';
import { ProgressBar } from '../ui/ProgressBar';
import { RewardCarousel } from '../ui/RewardCarousel';

export function WaitingScreen({ 
  completedCount, 
  totalCount, 
  title = "บันทึกข้อมูลสำเร็จ ✓",
  subtitle = "กำลังรอผู้เข้าร่วมท่านอื่น..."
}: { 
  completedCount: number;
  totalCount: number;
  title?: string;
  subtitle?: string;
}) {
  return (
    <ScreenTransition id="waiting-screen">
      <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-6 py-4 space-y-6">
        <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-2">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-success">{title}</h2>
          <p className="text-muted-foreground text-base">{subtitle}</p>
        </div>

        <div className="w-full space-y-2 pb-4 border-b border-border/50">
          <ProgressBar current={completedCount} total={totalCount} />
          <p className="text-sm font-medium text-muted-foreground">
            {completedCount} จาก {totalCount} ท่าน ดำเนินการเสร็จสิ้น
          </p>
          <p className="text-xs text-muted-foreground mt-2 opacity-80">
            เมื่อทุกคนดำเนินการเสร็จ ระบบจะพาไปขั้นตอนถัดไปโดยอัตโนมัติ
          </p>
        </div>

        <div className="w-full">
          <p className="text-sm font-semibold text-accent animate-pulse mb-2">
            ผู้ที่อยู่ร่วมกิจกรรมจนจบ มีสิทธิ์ลุ้นรับรางวัลกิจกรรม
          </p>
          <RewardCarousel />
        </div>
      </div>
    </ScreenTransition>
  );
}
