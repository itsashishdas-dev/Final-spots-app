
import { Spot, VerificationStatus } from '@/types';

// Aligned with Backend Edge Function expectations
export type SyncActionType = 'SPOT_ADDED' | 'SPOT_VERIFIED' | 'UPVOTE_SUBMISSION' | 'GRANT_XP';

export interface SyncAction {
  id: string;
  type: SyncActionType;
  payload: any;
  timestamp: number;
  retryCount: number;
  lastAttempt?: number;
}

// Payload Interfaces for type safety
export interface AddSpotPayload extends Partial<Spot> {}
export interface VerifySpotPayload { id: string; status: VerificationStatus }
export interface UpvotePayload { submissionId: string }
export interface GrantXpPayload { amount: number; reason: string }
