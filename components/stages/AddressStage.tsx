'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ScreenTransition } from '../ui/ScreenTransition';
import { WaitingScreen } from './WaitingScreen';

const PROVINCES = [
  "กรุงเทพมหานคร", "เชียงใหม่", "ภูเก็ต", "ชลบุรี", "ขอนแก่น", 
  "นครราชสีมา", "สงขลา", "อุดรธานี", "นนทบุรี", "อื่นๆ"
];

const REWARDS = [
  "ESP32 Starter Kit",
  "โควต้าปริ้น 3D ฟรี",
  "ชุดอุปกรณ์บัดกรี",
  "PCB Prototype Kit",
  "Mystery Electronics Box",
  "ของที่ระลึก Workshop"
];

interface AddressStageProps {
  onSubmit: (province: string, reward: string) => void;
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
}

export function AddressStage({ onSubmit, isCompleted, completedCount, totalCount }: AddressStageProps) {
  const [province, setProvince] = useState('');
  const [reward, setReward] = useState('');
  const [loading, setLoading] = useState(false);

  if (isCompleted) {
    return <WaitingScreen completedCount={completedCount} totalCount={totalCount} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (province && reward) {
      setLoading(true);
      onSubmit(province, reward);
    }
  };

  return (
    <ScreenTransition id="address-stage">
      <Card className="max-w-md w-full mx-auto border-none shadow-none bg-transparent">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">ข้อมูลสำหรับจัดส่งรางวัล</CardTitle>
          <CardDescription className="text-base mt-2">
            เพื่อความสะดวกในการจัดส่งรางวัล กรุณาระบุข้อมูลของท่าน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground text-left">
                ท่านพักอาศัยอยู่ในจังหวัดใด?
              </label>
              <select
                className="w-full h-14 px-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
                disabled={loading}
              >
                <option value="" disabled>เลือกจังหวัด...</option>
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground text-left">
                ของรางวัลที่ท่านสนใจมากที่สุดคืออะไร?
              </label>
              <select
                className="w-full h-14 px-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                required
                disabled={loading}
              >
                <option value="" disabled>เลือกของรางวัล...</option>
                {REWARDS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg shadow-md mt-4" 
              size="lg"
              disabled={!province || !reward || loading}
            >
              {loading ? 'กำลังประมวลผลข้อมูล...' : 'บันทึกข้อมูล'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
