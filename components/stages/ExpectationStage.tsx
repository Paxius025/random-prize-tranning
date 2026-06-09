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
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (isCompleted) {
    return <WaitingScreen completedCount={completedCount} totalCount={totalCount} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      setLoading(true);
      onSubmit(text.trim());
    }
  };

  return (
    <ScreenTransition id={question}>
      <Card className="max-w-md w-full mx-auto border-none shadow-none bg-transparent flex flex-col h-full">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-3xl font-bold tracking-tight leading-tight">
            {question}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <textarea
              className="w-full h-40 p-4 text-lg rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none mb-6"
              placeholder="Type your answer here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              required
            />
            
            <div className="flex flex-wrap gap-2 mb-auto pb-20">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loading}
                  onClick={() => setText(suggestion)}
                  className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 text-foreground rounded-full text-sm font-medium transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border sm:relative sm:bg-transparent sm:border-none sm:p-0">
              <Button 
                type="submit" 
                className="w-full text-lg shadow-md" 
                size="lg"
                disabled={!text.trim() || loading}
              >
                Submit Answer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ScreenTransition>
  );
}
