'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { ScreenTransition } from '../ui/ScreenTransition';
import { motion } from 'framer-motion';
import { ProgressBar } from '../ui/ProgressBar';
import { Gift } from 'lucide-react';
import { RewardCarousel } from '../ui/RewardCarousel';

interface JoinStageProps {
  onJoin: (nickname: string) => void;
  participantsCount: number;
  isJoined: boolean;
  maxParticipants?: number;
}

export function JoinStage({ onJoin, participantsCount, isJoined, maxParticipants = 50 }: JoinStageProps) {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      setLoading(true);
      onJoin(nickname.trim());
    }
  };

  if (isJoined) {
    return (
      <ScreenTransition id="join-waiting">
        <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-6 py-4 space-y-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2"
          >
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse" />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-primary">ลงทะเบียนสำเร็จ</h2>
            <p className="text-muted-foreground text-base">กำลังรอผู้เข้าร่วมท่านอื่น...</p>
          </div>

          <div className="w-full space-y-2 pb-4 border-b border-border/50">
            <ProgressBar current={participantsCount} total={maxParticipants} />
            <p className="text-sm font-medium text-muted-foreground">
              {participantsCount} จาก {maxParticipants} ท่าน เข้าร่วมแล้ว
            </p>
          </div>

          <div className="w-full">
            <p className="text-sm font-semibold text-accent animate-pulse mb-2">
              อย่าออกจากกิจกรรม ยังมีการสุ่มรางวัลในช่วงท้าย
            </p>
            <RewardCarousel />
          </div>
        </div>
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition id="join-form">
      <Card className="max-w-md w-full mx-auto border-none shadow-none bg-transparent">
        <CardHeader className="text-center flex flex-col items-center space-y-2 mb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">ลงทะเบียนเข้าร่วมกิจกรรม</CardTitle>
          <CardDescription className="text-base">
            กรุณากรอกข้อมูลเพื่อเข้าร่วมกิจกรรมและรับสิทธิ์
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RewardCarousel />
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="ชื่อเล่นสำหรับเข้าร่วมกิจกรรม"
                className="w-full h-14 px-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
                required
                disabled={loading || participantsCount >= maxParticipants}
              />
            </div>
            {participantsCount >= maxParticipants ? (
              <Button 
                type="button" 
                className="w-full text-lg" 
                size="lg"
                disabled
                variant="secondary"
              >
                ห้องเต็มแล้ว (Room is full)
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="w-full text-lg" 
                size="lg"
                disabled={!nickname.trim() || loading}
              >
                {loading ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าร่วมกิจกรรม'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
