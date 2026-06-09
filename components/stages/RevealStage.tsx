'use client';

import React from 'react';
import { ScreenTransition } from '../ui/ScreenTransition';
import { Card, CardContent } from '../ui/Card';
import { motion } from 'framer-motion';
import { AlertTriangle, Check } from 'lucide-react';

export function RevealStage() {
  return (
    <ScreenTransition id="reveal-stage">
      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-2 py-0 h-full max-h-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-2 mx-auto shrink-0"
        >
          <AlertTriangle size={28} className="text-accent" />
        </motion.div>

        <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-center mb-1 text-primary shrink-0">
          กิจกรรมจำลองสถานการณ์เสร็จสมบูรณ์
        </h1>
        
        <p className="text-sm text-center text-muted-foreground mb-3 font-medium leading-tight shrink-0">
          สิ่งที่ทุกท่านเพิ่งพบเจอ คือรูปแบบหนึ่งของ <br />
          <span className="text-foreground font-bold">“การหลอกลวงทางดิจิทัล” (Social Engineering)</span>
        </p>

        <Card className="w-full bg-card/50 backdrop-blur border-border/50 mb-3 shadow-sm shrink-0">
          <CardContent className="pt-3 pb-3 px-3">
            <h3 className="text-sm font-semibold mb-2 text-center">ข้อมูลที่ท่านได้ให้ไว้โดยไม่รู้ตัว:</h3>
            <ul className="space-y-1.5 mb-3">
              {[
                "ความเชื่อใจและความสนใจ",
                "สิทธิ์การเข้าถึงกล้องถ่ายภาพ",
                "ข้อมูลส่วนบุคคลเบื้องต้น",
                "ความคาดหวังส่วนตัว"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.2) }}
                  className="flex items-center text-xs bg-background p-2 rounded-lg shadow-sm border border-border"
                >
                  <Check className="text-success mr-2 flex-shrink-0" size={16} />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="bg-muted p-2.5 rounded-lg border border-border/50">
              <h4 className="font-semibold text-xs mb-1">ทำไมท่านถึงยอมเปิดเผยข้อมูล?</h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                เนื่องจาก <strong className="text-foreground">สิ่งล่อใจ (Rewards)</strong>, 
                <strong className="text-foreground"> ความเร่งด่วน (Urgency)</strong>, 
                และ <strong className="text-foreground">ความเชื่อใจ (Trust)</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center space-y-2 mt-4 shrink-0"
        >
          <div className="p-2.5 bg-success/10 text-success rounded-xl border border-success/20">
            <p className="font-semibold text-sm mb-0.5">สบายใจได้!</p>
            <p className="text-[11px] leading-tight">ไม่มีการบันทึกข้อมูลจริงของท่านลงฐานข้อมูล และไม่มีการเก็บข้อมูลที่ละเอียดอ่อนใดๆ</p>
          </div>
          
          <p className="text-[11px] font-medium text-foreground opacity-80 pt-1">
            ในการออกแบบ IoT เราต้องให้ความสำคัญกับ Privacy อย่างสูงสุด
          </p>
        </motion.div>
      </div>
    </ScreenTransition>
  );
}
