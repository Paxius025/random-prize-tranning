import { Stage, Participant } from '../types';
import { Server } from 'socket.io';

export class RoomManager {
  private participants: Map<string, Participant> = new Map();
  private currentStage: Stage = Stage.JOIN;
  private io: Server;
  
  private countdownTimer: NodeJS.Timeout | null = null;
  private countdownValue: number = 0;

  constructor(io: Server) {
    this.io = io;
  }

  getStage() {
    return this.currentStage;
  }

  setStage(stage: Stage) {
    this.currentStage = stage;
    // reset completion state for the new stage
    for (const p of this.participants.values()) {
      p.completed = false;
      p.stage = stage;
    }
    
    if (stage === Stage.LOTTERY) {
      this.startLotteryCountdown();
    } else {
      this.stopLotteryCountdown();
    }
    
    this.broadcastState();
  }

  getParticipants() {
    return Array.from(this.participants.values());
  }

  addParticipant(id: string, nickname: string): Participant {
    const p: Participant = {
      id,
      nickname,
      joinedAt: Date.now(),
      stage: this.currentStage,
      completed: false,
      connected: true,
      expectations: {},
    };
    this.participants.set(id, p);
    this.broadcastState();
    return p;
  }

  getParticipant(id: string) {
    return this.participants.get(id);
  }

  setParticipantConnected(id: string, connected: boolean) {
    const p = this.participants.get(id);
    if (p) {
      p.connected = connected;
      this.broadcastState();
    }
  }

  markParticipantComplete(id: string) {
    const p = this.participants.get(id);
    if (p) {
      p.completed = true;
      this.broadcastState();
    }
  }
  
  updateParticipantExpectation(id: string, type: 1 | 2, text: string) {
    const p = this.participants.get(id);
    if (p) {
      p.expectations[type] = text;
      p.completed = true;
      this.broadcastState();
    }
  }
  
  updateParticipantPhoto(id: string) {
    const p = this.participants.get(id);
    if (p) {
      p.hasPhoto = true;
      p.completed = true;
      this.broadcastState();
    }
  }
  
  updateParticipantAddress(id: string, province: string, reward: string) {
    const p = this.participants.get(id);
    if (p) {
      p.address = { province, reward };
      p.completed = true;
      this.broadcastState();
    }
  }

  reset() {
    this.participants.clear();
    this.currentStage = Stage.JOIN;
    this.stopLotteryCountdown();
    this.broadcastState();
  }

  private startLotteryCountdown() {
    this.countdownValue = 60;
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    
    this.countdownTimer = setInterval(() => {
      this.countdownValue -= 1;
      this.broadcastState();
      
      if (this.countdownValue <= 0) {
        this.stopLotteryCountdown();
        this.setStage(Stage.REVEAL);
      }
    }, 1000);
  }
  
  private stopLotteryCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  public broadcastState() {
    const participantsList = this.getParticipants();
    const completedCount = participantsList.filter(p => p.completed && p.stage === this.currentStage).length;
    
    // Broadcast to students
    this.io.emit('stateSync', {
      stage: this.currentStage,
      participantsCount: participantsList.length,
      completedCount,
      countdown: this.countdownValue,
    });
    
    // Broadcast to admin room
    this.io.to('admin').emit('adminSync', {
      stage: this.currentStage,
      participants: participantsList,
    });
  }
}
