'use client';

import { useSocket } from '../../hooks/useSocket';
import { Stage, Participant } from '../../types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function AdminPage() {
  const { socket, isConnected } = useSocket(true);
  const [stage, setStage] = useState<Stage>(Stage.JOIN);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('stateSync', (data) => {
      setStage(data.stage);
    });

    socket.on('adminSync', (data) => {
      setStage(data.stage);
      setParticipants(data.participants);
    });

    return () => {
      socket.off('stateSync');
      socket.off('adminSync');
    };
  }, [socket]);

  const sendAction = (action: string, payload?: any) => {
    if (confirm(`Are you sure you want to: ${action}?`)) {
      socket?.emit('adminAction', action, payload);
    }
  };

  const getStageName = (s: Stage) => {
    return Stage[s];
  };

  const completedCount = participants.filter(p => p.completed && p.stage === stage).length;
  const totalCount = participants.length;

  if (!isConnected) {
    return <div className="p-8">Connecting to Admin Panel...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Facilitator Dashboard</h1>
            <p className="text-muted-foreground">Live session control and monitoring</p>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-sm border border-primary/20">
              Current: {getStageName(stage)}
            </span>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full font-medium text-sm border border-success/20">
              Socket: Connected
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalCount} <span className="text-lg text-muted-foreground font-normal">joined</span></div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{completedCount} <span className="text-lg text-muted-foreground font-normal">/ {totalCount}</span></div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalCount > 0 ? `${Math.round((completedCount/totalCount)*100)}% finished` : 'Waiting for joins'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stage Controls</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => sendAction('prevStage')} disabled={stage === Stage.JOIN}>Prev</Button>
              <Button size="sm" onClick={() => sendAction('nextStage')} disabled={stage === Stage.END}>Next Stage</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 my-4">
           <Button variant="outline" className="text-accent border-accent hover:bg-accent/10" onClick={() => sendAction('forceReveal')}>Force Reveal</Button>
           <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => sendAction('resetRoom')}>Reset Room</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Live Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Status</th>
                    <th className="px-4 py-3">Nickname</th>
                    <th className="px-4 py-3">Stage</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p) => {
                    const isDone = p.completed && p.stage === stage;
                    return (
                      <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.connected ? 'bg-success' : 'bg-red-500'}`} />
                            {isDone ? (
                              <span className="text-success font-medium">Ready</span>
                            ) : (
                              <span className="text-muted-foreground">Waiting</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nickname}</td>
                        <td className="px-4 py-3 text-muted-foreground">{getStageName(p.stage)}</td>
                        <td className="px-4 py-3 text-xs">
                          {p.hasPhoto && '📷 '}
                          {p.address?.province && `🏠 ${p.address.province} `}
                          {p.expectations[1] && '📝 '}
                        </td>
                        <td className="px-4 py-3">
                          {!isDone && (
                            <Button size="sm" variant="ghost" onClick={() => sendAction('markComplete', { id: p.id })}>
                              Mark Complete
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No participants have joined yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
