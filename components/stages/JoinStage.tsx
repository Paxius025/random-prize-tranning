'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { ScreenTransition } from '../ui/ScreenTransition';
import { motion } from 'framer-motion';
import { ProgressBar } from '../ui/ProgressBar';

export function JoinStage({ 
  onJoin, 
  participantsCount,
  isJoined,
}: { 
  onJoin: (nickname: string) => void;
  participantsCount: number;
  isJoined: boolean;
}) {
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
        <div className="flex flex-col items-center justify-center text-center max-w-md w-full px-6 space-y-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4"
          >
            <div className="w-10 h-10 bg-primary rounded-full animate-pulse" />
          </motion.div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">You're In!</h2>
            <p className="text-muted-foreground text-lg">Waiting for friends to join...</p>
          </div>

          <div className="w-full space-y-3">
            <ProgressBar current={participantsCount} total={50} />
            <p className="text-sm font-medium text-muted-foreground">
              {participantsCount} / 50 participants joined
            </p>
          </div>
        </div>
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition id="join-form">
      <Card className="max-w-md w-full mx-auto border-none shadow-none bg-transparent">
        <CardHeader className="text-center space-y-4 mb-4">
          <div className="text-6xl mb-4">🎁</div>
          <CardTitle className="text-3xl font-bold tracking-tight">IoT Workshop Challenge</CardTitle>
          <CardDescription className="text-lg">
            Join the activity to unlock workshop rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter your nickname"
                className="w-full h-14 px-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={50}
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-lg" 
              size="lg"
              disabled={!nickname.trim() || loading}
            >
              Join Challenge
            </Button>
          </form>
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
