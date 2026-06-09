'use client';

import React from 'react';
import { ScreenTransition } from '../ui/ScreenTransition';
import { Card, CardContent } from '../ui/Card';
import { motion } from 'framer-motion';

export function RevealStage() {
  return (
    <ScreenTransition id="reveal-stage">
      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto px-4 py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6"
        >
          <span className="text-5xl">⚠️</span>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          Surprise!
        </h1>
        
        <p className="text-xl md:text-2xl text-center text-muted-foreground mb-10 font-medium">
          You just experienced a <br />
          <span className="text-foreground font-bold">Social Engineering Simulation</span>.
        </p>

        <Card className="w-full bg-card/50 backdrop-blur border-border/50 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4 text-center">What you willingly gave away:</h3>
            <ul className="space-y-3 mb-6">
              {[
                "Trust & Attention",
                "Camera Permission",
                "Personal Information",
                "Your Expectations"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.2) }}
                  className="flex items-center text-lg bg-background p-3 rounded-xl shadow-sm border border-border"
                >
                  <span className="text-success mr-3 text-xl">✓</span>
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="bg-muted p-5 rounded-xl">
              <h4 className="font-semibold mb-2">Why did you share it?</h4>
              <p className="text-muted-foreground text-sm">
                People often share information because of <strong className="text-foreground">Rewards</strong>, 
                <strong className="text-foreground"> Urgency</strong>, <strong className="text-foreground">Pressure</strong>, 
                and <strong className="text-foreground">Trust</strong> in the platform.
              </p>
            </div>
          </CardContent>
        </Card>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center space-y-4"
        >
          <div className="p-4 bg-success/10 text-success rounded-xl border border-success/20">
            <p className="font-semibold">Don't worry!</p>
            <p className="text-sm">No real personal data was stored. Your image was never uploaded. No sensitive information was collected.</p>
          </div>
          
          <p className="text-lg font-medium mt-6">
            When building IoT products, <br/>we must protect user privacy.
          </p>
        </motion.div>
      </div>
    </ScreenTransition>
  );
}
