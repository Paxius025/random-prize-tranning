'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ScreenTransition } from '../ui/ScreenTransition';
import { WaitingScreen } from './WaitingScreen';

interface ExpectationStageProps {
  question: string;
  suggestions: string[];
  onSubmit: (text: string) => void;
  isCompleted: boolean;
  completedCount: number;
  totalCount: number;
}

export function ExpectationStage({
  question,
  suggestions,
  onSubmit,
  isCompleted,
  completedCount,
  totalCount
}: ExpectationStageProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (isCompleted) {
    return <WaitingScreen completedCount={completedCount} totalCount={totalCount} />;
  }

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAnswer = [...selectedOptions, text.trim()].filter(Boolean).join(', ');
    if (finalAnswer) {
      setLoading(true);
      onSubmit(finalAnswer);
    }
  };

  const isValid = selectedOptions.length > 0 || text.trim().length > 0;

  return (
    <ScreenTransition id={question}>
      <Card className="max-w-md w-full mx-auto border-none shadow-none bg-transparent flex flex-col my-auto">
        <CardHeader className="text-center mb-2">
          <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-primary">
            {question}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col pb-24 sm:pb-0">
          <form onSubmit={handleSubmit} className="flex flex-col">
            
            <div className="flex flex-col gap-3 mb-6">
              {suggestions.map((suggestion, i) => {
                const isSelected = selectedOptions.includes(suggestion);
                return (
                  <label
                    key={i}
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-border bg-card hover:bg-muted/50'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isSelected}
                      onChange={() => toggleOption(suggestion)}
                    />
                    <div className={`w-6 h-6 rounded flex-shrink-0 border flex items-center justify-center mr-3 transition-colors ${
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30 bg-background'
                    }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-foreground text-lg leading-tight">{suggestion}</span>
                  </label>
                );
              })}
            </div>

            <textarea
              className="w-full h-24 p-4 text-base rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              placeholder="อื่นๆ / เพิ่มเติม (ถ้ามี)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/90 backdrop-blur-md border-t border-border sm:relative sm:bg-transparent sm:border-none sm:p-0 sm:mt-6 z-10">
              <Button 
                type="submit" 
                className="w-full text-lg shadow-md" 
                size="lg"
                disabled={!isValid || loading}
              >
                {loading ? 'กำลังตรวจสอบข้อมูล...' : 'ยืนยันข้อมูล'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
