'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { ScreenTransition } from '../ui/ScreenTransition';
import { WaitingScreen } from './WaitingScreen';
import { Camera } from 'lucide-react';

interface PhotoStageProps {
  onSubmit: () => void;
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
}

export function PhotoStage({ onSubmit, isCompleted, completedCount, totalCount }: PhotoStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    if (isCompleted) return;
    
    let stream: MediaStream | null = null;
    
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (err) {
        console.warn("Camera access denied or unavailable", err);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCompleted]);

  if (isCompleted) {
    return <WaitingScreen completedCount={completedCount} totalCount={totalCount} />;
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // We only use this URL locally. It is NEVER sent to the server.
        setPhotoData(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  const handleSubmit = () => {
    // Only submit a boolean signal. Never transmit the photo per secure design rules.
    onSubmit();
  };

  return (
    <ScreenTransition id="photo-stage">
      <Card className="max-w-md w-full mx-auto border-none shadow-none bg-transparent">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">ยืนยันตัวตน</CardTitle>
          <CardDescription className="text-base mt-2">
            กรุณาถ่ายภาพเพื่อยืนยันตัวตนในการรับสิทธิ์
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-full aspect-square bg-muted rounded-2xl overflow-hidden relative mb-8 border-4 border-border shadow-inner">
            {!photoData ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                {!hasCamera && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Camera size={48} className="mb-2 opacity-50" />
                    <p>กำลังขออนุญาตเข้าถึงกล้อง...</p>
                  </div>
                )}
              </>
            ) : (
              <img src={photoData} alt="Selfie preview" className="w-full h-full object-cover" />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {!photoData ? (
            <Button 
              onClick={takePhoto} 
              size="lg" 
              className="w-full rounded-full h-16 shadow-lg text-lg"
              disabled={!hasCamera}
            >
              <Camera className="mr-2" /> ถ่ายภาพยืนยัน
            </Button>
          ) : (
            <div className="flex gap-4 w-full">
              <Button 
                variant="outline" 
                onClick={() => setPhotoData(null)} 
                className="flex-1 text-lg"
              >
                ถ่ายใหม่
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 shadow-md text-lg"
              >
                ดำเนินการต่อ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
