'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ScreenTransition } from '../ui/ScreenTransition';
import { WaitingScreen } from './WaitingScreen';

const PROVINCES = [
  "Bangkok", "Chiang Mai", "Phuket", "Chonburi", "Khon Kaen", 
  "Nakhon Ratchasima", "Songkhla", "Udon Thani", "Nonthaburi", "Other"
];

const REWARDS = [
  "Arduino kit",
  "Robot",
  "PCB starter kit",
  "Mystery box",
  "Gaming gear"
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
          <CardTitle className="text-3xl font-bold tracking-tight">Reward Details</CardTitle>
          <CardDescription className="text-base mt-2">
            If we were to send rewards, where should it go?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground text-left">
                Which province are you from?
              </label>
              <select
                className="w-full h-14 px-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
                disabled={loading}
              >
                <option value="" disabled>Select province...</option>
                {PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground text-left">
                What reward do you want most?
              </label>
              <select
                className="w-full h-14 px-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                required
                disabled={loading}
              >
                <option value="" disabled>Select reward...</option>
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
              Save Details
            </Button>
          </form>
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
