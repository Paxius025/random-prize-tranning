'use client';

import { useSocket } from '../../hooks/useSocket';
import { Stage, Participant } from '../../types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Camera, Home, FileText } from 'lucide-react';

export default function AdminPage() {
  const { socket, isConnected } = useSocket(true);
  const [stage, setStage] = useState<Stage>(Stage.JOIN);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    action: string | null;
    payload: any;
    title: string;
    description: string;
    isDestructive: boolean;
  }>({
    isOpen: false,
    action: null,
    payload: null,
    title: '',
    description: '',
    isDestructive: false
  });

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

  const requestAction = (action: string, payload?: any) => {
    let title = "ยืนยันการดำเนินการ";
    let description = "คุณแน่ใจหรือไม่ที่จะดำเนินการนี้?";
    let isDestructive = false;

    if (action === 'resetRoom') {
      title = "ล้างข้อมูลระบบ (Reset Room)";
      description = "ระบบจะทำการล้างข้อมูลผู้เข้าร่วมทั้งหมดทันที การดำเนินการนี้ไม่สามารถย้อนกลับได้";
      isDestructive = true;
    } else if (action === 'forceReveal') {
      title = "บังคับเฉลย (Force Reveal)";
      description = "ระบบจะบังคับให้ผู้ใช้ทุกคนข้ามไปยังหน้าเฉลยผล (Simulation Reveal) ทันที";
    } else if (action === 'nextStage') {
      title = "ไปยังขั้นตอนถัดไป";
      description = "เปลี่ยนขั้นตอนกิจกรรมไปยังขั้นถัดไปสำหรับผู้ใช้ทุกคน";
    } else if (action === 'prevStage') {
      title = "ย้อนกลับขั้นตอน";
      description = "เปลี่ยนขั้นตอนกิจกรรมย้อนหลังสำหรับผู้ใช้ทุกคน";
    } else if (action === 'markComplete') {
      title = "บังคับผ่าน";
      description = "ยืนยันการบังคับผ่านขั้นตอนให้ผู้เข้าร่วมรายนี้ใช่หรือไม่?";
    }

    setConfirmState({
      isOpen: true,
      action,
      payload,
      title,
      description,
      isDestructive
    });
  };

  const executeAction = () => {
    if (confirmState.action) {
      socket?.emit('adminAction', confirmState.action, confirmState.payload);
    }
    setConfirmState(prev => ({ ...prev, isOpen: false }));
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
            <h1 className="text-3xl font-bold tracking-tight text-primary">แผงควบคุมสำหรับวิทยากร</h1>
            <p className="text-muted-foreground">ควบคุมและติดตามสถานะกิจกรรมแบบเรียลไทม์</p>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-sm border border-primary/20">
              ขั้นตอนปัจจุบัน: {getStageName(stage)}
            </span>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full font-medium text-sm border border-success/20">
              เครือข่าย: เชื่อมต่อแล้ว
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">จำนวนผู้เข้าร่วมทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalCount} <span className="text-lg text-muted-foreground font-normal">ท่าน</span></div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">สถานะการดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{completedCount} <span className="text-lg text-muted-foreground font-normal">/ {totalCount}</span></div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalCount > 0 ? `ดำเนินการเสร็จสิ้น ${Math.round((completedCount/totalCount)*100)}%` : 'กำลังรอผู้เข้าร่วม...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ควบคุมขั้นตอนกิจกรรม</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => requestAction('prevStage')} disabled={stage === Stage.JOIN}>ย้อนกลับ</Button>
              <Button size="sm" onClick={() => requestAction('nextStage')} disabled={stage === Stage.END}>ถัดไป</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 my-4">
           <Button variant="outline" className="text-accent border-accent hover:bg-accent/10" onClick={() => requestAction('forceReveal')}>บังคับเฉลย (Force Reveal)</Button>
           <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => requestAction('resetRoom')}>ล้างข้อมูลระบบ (Reset)</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายชื่อผู้เข้าร่วมแบบเรียลไทม์</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">สถานะ</th>
                    <th className="px-4 py-3">ชื่อเล่น</th>
                    <th className="px-4 py-3">ขั้นตอน</th>
                    <th className="px-4 py-3">ข้อมูล</th>
                    <th className="px-4 py-3 rounded-tr-lg">จัดการ</th>
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
                              <span className="text-success font-medium">พร้อม</span>
                            ) : (
                              <span className="text-muted-foreground">กำลังรอ...</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{p.nickname}</td>
                        <td className="px-4 py-3 text-muted-foreground">{getStageName(p.stage)}</td>
                        <td className="px-4 py-3 text-xs flex items-center gap-2 flex-wrap">
                          {p.hasPhoto && <Camera size={14} className="text-muted-foreground" />}
                          {p.address?.province && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Home size={14} /> {p.address.province}
                            </span>
                          )}
                          {p.expectations[1] && <FileText size={14} className="text-muted-foreground" />}
                        </td>
                        <td className="px-4 py-3">
                          {!isDone && (
                            <Button size="sm" variant="ghost" onClick={() => requestAction('markComplete', { id: p.id })}>
                              บังคับผ่าน
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        ยังไม่มีผู้เข้าร่วมกิจกรรม
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <ConfirmModal 
          isOpen={confirmState.isOpen}
          title={confirmState.title}
          description={confirmState.description}
          isDestructive={confirmState.isDestructive}
          onConfirm={executeAction}
          onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
}
