
import { Spot, ExtendedSession, Challenge, VerificationStatus } from '@/types';

export type EventType = 
  | 'SPOT_ADDED' 
  | 'SPOT_VERIFIED'
  | 'SESSION_CREATED'
  | 'SESSION_JOINED'
  | 'CHALLENGE_CREATED'
  | 'CHALLENGE_COMPLETED'
  | 'SKILL_MASTERED'
  | 'NOTE_ADDED';

export interface DomainEvent<T = any> {
  id: string;
  type: EventType;
  payload: T;
  timestamp: number;
}

// --- Payload Definitions ---

export interface SpotAddedPayload {
  spot: Spot;
  userId: string;
}

export interface SpotVerifiedPayload {
  spotId: string;
  status: VerificationStatus;
  adminId: string;
}

export interface SessionCreatedPayload {
  session: ExtendedSession;
}

export interface SessionJoinedPayload {
  sessionId: string;
  userId: string;
}

export interface ChallengeCreatedPayload {
  challenge: Challenge;
}

export interface ChallengeCompletedPayload {
  challengeId: string;
  userId: string;
  xpEarned: number;
}

export interface SkillMasteredPayload {
  skillId: string;
  userId: string;
}

export interface NoteAddedPayload {
  noteId: string;
  userId: string;
}
