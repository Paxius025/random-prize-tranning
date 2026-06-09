'use client';

import React from 'react';
import { ScreenTransition } from '../ui/ScreenTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';

type StatusType = 'info' | 'warning' | 'error' | 'success';

export function LotteryStage({ countdown }: { countdown: number }) {
  const getStatusFromCountdown = (c: number): { text: string; type: StatusType } => {
    // Normal operation initially
    if (c > 50) return { text: "กำลังดึงข้อมูลรายชื่อผู้เข้าร่วมทั้งหมด...", type: "info" };
    if (c > 45) return { text: "กำลังตรวจสอบสิทธิ์ตามเงื่อนไข...", type: "info" };
    
    // Simulating network instability between 30-45s
    if (c > 42) return { text: "ตรวจพบความหน่วงของเครือข่าย (High Latency)...", type: "warning" };
    if (c > 38) return { text: "ขาดการเชื่อมต่อกับเซิร์ฟเวอร์หลัก", type: "error" };
    if (c > 32) return { text: "กำลังพยายามเชื่อมต่อใหม่... (ครั้งที่ 1/3)", type: "warning" };
    if (c > 30) return { text: "เชื่อมต่อกับฐานข้อมูลสำเร็จ", type: "success" };
    
    // Normal operation resumes under 30s
    if (c > 20) return { text: "ประมวลผลการสุ่มด้วยอัลกอริทึม (RNG)...", type: "info" };
    if (c > 10) return { text: "กำลังวิเคราะห์ข้อมูลเชิงลึกของผู้เข้าร่วม...", type: "info" };
    if (c > 3) return { text: "กำลังสุ่มรายชื่อผู้ได้รับรางวัล...", type: "info" };
    return { text: "กำลังยืนยันข้อมูลและเตรียมแสดงผล...", type: "success" };
  };

  const currentStatus = getStatusFromCountdown(countdown);

  return (
    <ScreenTransition id="lottery-stage">
      <div className="flex flex-col items-center justify-center h-full w-full bg-background text-foreground px-6 text-center absolute inset-0 z-50">
        
        {/* Header */}
        <div className="mb-10 space-y-4">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShieldCheck size={40} className="text-primary" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            กำลังเตรียมการสุ่มรางวัล
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-sm mx-auto">
            ระบบกำลังตรวจสอบสิทธิ์และประมวลผลข้อมูลผู้เข้าร่วม
          </p>
        </div>

        {/* Countdown Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-14">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className={`absolute inset-0 rounded-full border-[3px] border-dashed ${currentStatus.type === 'error' ? 'border-red-500/40' : 'border-primary/40'} transition-colors duration-500`}
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
            className={`absolute inset-4 rounded-full border ${currentStatus.type === 'error' ? 'border-red-500/20' : 'border-primary/20'} transition-colors duration-500`}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-card rounded-full shadow-2xl z-10 scale-90 border-4 border-background">
            <motion.div
              key={countdown}
              initial={{ opacity: 0.5, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-8xl md:text-9xl font-bold tabular-nums tracking-tighter text-foreground"
            >
              {countdown}
            </motion.div>
          </div>
        </div>

        {/* Console / Status Box */}
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-5 shadow-md flex items-center gap-4 text-left">
          {currentStatus.type === 'info' && <Loader2 className="w-8 h-8 text-primary animate-spin flex-shrink-0" />}
          {currentStatus.type === 'warning' && <AlertTriangle className="w-8 h-8 text-accent animate-pulse flex-shrink-0" />}
          {currentStatus.type === 'error' && <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse flex-shrink-0" />}
          {currentStatus.type === 'success' && <CheckCircle2 className="w-8 h-8 text-success flex-shrink-0" />}
          
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">System Status</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStatus.text}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className={`text-sm md:text-base font-medium truncate ${
                  currentStatus.type === 'error' ? 'text-red-500' :
                  currentStatus.type === 'warning' ? 'text-accent' :
                  currentStatus.type === 'success' ? 'text-success' :
                  'text-foreground'
                }`}
              >
                {currentStatus.text}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </ScreenTransition>
  );
}
