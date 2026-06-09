export enum Stage {
  JOIN = 0,
  EXPECTATION_1 = 1,
  EXPECTATION_2 = 2,
  PHOTO = 3,
  ADDRESS = 4,
  LOTTERY = 5,
  REVEAL = 6,
  END = 7,
}

export interface Participant {
  id: string; // Socket ID
  nickname: string;
  joinedAt: number;
  stage: Stage;
  completed: boolean;
  connected: boolean;
  expectations: {
    1?: string;
    2?: string;
  };
  hasPhoto?: boolean;
  address?: {
    province?: string;
    reward?: string;
  };
}

export interface ServerToClientEvents {
  stateSync: (data: {
    stage: Stage;
    participantsCount: number;
    completedCount: number;
    countdown?: number;
    maxParticipants: number;
  }) => void;
  adminSync: (data: {
    stage: Stage;
    participants: Participant[];
  }) => void;
  kick: () => void;
}

export interface ClientToServerEvents {
  join: (nickname: string, callback: (res: { success: boolean; error?: string; me?: Participant }) => void) => void;
  submitExpectation1: (text: string, callback: (res: { success: boolean }) => void) => void;
  submitExpectation2: (text: string, callback: (res: { success: boolean }) => void) => void;
  submitPhoto: (callback: (res: { success: boolean }) => void) => void;
  submitAddress: (province: string, reward: string, callback: (res: { success: boolean }) => void) => void;
  adminAction: (action: string, payload?: any) => void;
}
