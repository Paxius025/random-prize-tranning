'use client';

import { useSocket } from '../hooks/useSocket';
import { Stage, Participant } from '../types';
import { JoinStage } from '../components/stages/JoinStage';
import { ExpectationStage } from '../components/stages/ExpectationStage';
import { PhotoStage } from '../components/stages/PhotoStage';
import { AddressStage } from '../components/stages/AddressStage';
import { LotteryStage } from '../components/stages/LotteryStage';
import { RevealStage } from '../components/stages/RevealStage';
import { useEffect, useState } from 'react';

import { Header } from '../components/ui/Header';

export default function Home() {
  const { socket, isConnected } = useSocket(false);
// ... [rest of the component state setup] ...

  const [stage, setStage] = useState<Stage>(Stage.JOIN);
  const [participantsCount, setParticipantsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [me, setMe] = useState<Participant | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('stateSync', (data) => {
      setStage(data.stage);
      setParticipantsCount(data.participantsCount);
      setCompletedCount(data.completedCount);
      if (data.countdown !== undefined) setCountdown(data.countdown);
      if (data.maxParticipants !== undefined) setMaxParticipants(data.maxParticipants);
      
      // Update our local completion state from server sync to handle admin forced completion
      setMe(prev => {
        if (!prev) return null;
        // The server stateSync doesn't contain individual participant data,
        // but if stage changes, we know we are no longer "completed" in the new stage
        if (prev.stage !== data.stage) {
          return { ...prev, stage: data.stage, completed: false };
        }
        return prev;
      });
    });

    return () => {
      socket.off('stateSync');
    };
  }, [socket]);

  const handleJoin = (nickname: string) => {
    socket?.emit('join', nickname, (res) => {
      if (res.success && res.me) {
        setMe(res.me);
      } else {
        alert(res.error || 'Failed to join');
      }
    });
  };

  const submitExpectation1 = (text: string) => {
    socket?.emit('submitExpectation1', text, (res) => {
      if (res.success && me) setMe({ ...me, completed: true });
    });
  };

  const submitExpectation2 = (text: string) => {
    socket?.emit('submitExpectation2', text, (res) => {
      if (res.success && me) setMe({ ...me, completed: true });
    });
  };

  const submitPhoto = () => {
    socket?.emit('submitPhoto', (res) => {
      if (res.success && me) setMe({ ...me, completed: true });
    });
  };

  const submitAddress = (province: string, reward: string) => {
    socket?.emit('submitAddress', province, reward, (res) => {
      if (res.success && me) setMe({ ...me, completed: true });
    });
  };

  if (!isConnected) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">กำลังเชื่อมต่อกับระบบ...</p>
        </div>
      </div>
    );
  }

  const isCompleted = me?.completed || false;

  return (
    <>
      <Header />
      <main className="flex h-[100dvh] flex-col items-center justify-center px-4 md:px-8 pt-16 pb-4 overflow-hidden bg-background">
        <div className="w-full max-w-xl mx-auto flex-1 flex flex-col relative py-2 justify-center">
          {stage === Stage.JOIN && (
            <JoinStage 
              onJoin={handleJoin} 
              participantsCount={participantsCount} 
              isJoined={!!me} 
              maxParticipants={maxParticipants}
            />
          )}
          
          {stage === Stage.EXPECTATION_1 && me && (
            <ExpectationStage 
              question="ท่านคาดหวังจะได้รับความรู้อะไรจากกิจกรรมในวันนี้?"
              suggestions={["การต่อวงจรอิเล็กทรอนิกส์", "เรียนรู้ระบบ IoT", "การออกแบบผลิตภัณฑ์", "การเขียนโปรแกรมเบื้องต้น", "ประสบการณ์ใหม่ๆ"]}
              onSubmit={submitExpectation1}
              isCompleted={isCompleted}
              completedCount={completedCount}
              totalCount={participantsCount}
            />
          )}

          {stage === Stage.EXPECTATION_2 && me && (
            <ExpectationStage 
              question="หากท่านสามารถสร้างอุปกรณ์อัจฉริยะได้ 1 ชิ้น สิ่งนั้นคืออะไร?"
              suggestions={["ระบบบ้านอัจฉริยะ (Smart Home)", "อุปกรณ์ติดตามสุขภาพ", "ระบบดูแลสวนอัตโนมัติ", "หุ่นยนต์ผู้ช่วยส่วนตัว"]}
              onSubmit={submitExpectation2}
              isCompleted={isCompleted}
              completedCount={completedCount}
              totalCount={participantsCount}
            />
          )}

          {stage === Stage.PHOTO && me && (
            <PhotoStage 
              onSubmit={submitPhoto}
              isCompleted={isCompleted}
              completedCount={completedCount}
              totalCount={participantsCount}
            />
          )}

          {stage === Stage.ADDRESS && me && (
            <AddressStage 
              onSubmit={submitAddress}
              isCompleted={isCompleted}
              completedCount={completedCount}
              totalCount={participantsCount}
            />
          )}

          {stage === Stage.LOTTERY && (
            <LotteryStage countdown={countdown} />
          )}

          {stage === Stage.REVEAL && (
            <RevealStage />
          )}
          
          {stage === Stage.END && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">กิจกรรมช่วงแรกเสร็จสิ้น</h1>
              <p className="text-xl text-muted-foreground">กรุณารอรับฟังคำบรรยายจากวิทยากรในลำดับถัดไป</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
