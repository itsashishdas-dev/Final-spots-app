
import { syncQueue } from './queue';
import { SyncAction } from './sync.types';
import { supabase } from '@/core/supabase/client';

const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 2000;

export const syncEngine = {
  isSyncing: false,

  init() {
    if (typeof window === 'undefined') return;
    window.addEventListener('online', () => {
        console.log('[SyncEngine] Network restored. Triggering sync...');
        this.triggerSync();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
          this.triggerSync();
      }
    });
    if (navigator.onLine) {
        this.triggerSync();
    }
  },

  async triggerSync() {
    if (this.isSyncing || !navigator.onLine) return;
    
    this.isSyncing = true;
    
    try {
      const queue = await syncQueue.getQueue();
      if (queue.length === 0) {
        this.isSyncing = false;
        return;
      }

      console.log(`[SyncEngine] Flushing ${queue.length} events to ledger...`);
      const remaining: SyncAction[] = [];
      const now = Date.now();

      // Get Current User for RLS
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          console.warn('[SyncEngine] No user authenticated. Pausing sync.');
          this.isSyncing = false;
          return;
      }

      for (const action of queue) {
        // Backoff Check
        if (action.retryCount > 0 && action.lastAttempt) {
            const waitTime = BACKOFF_BASE_MS * Math.pow(2, action.retryCount - 1);
            if (now - action.lastAttempt < waitTime) {
                remaining.push(action);
                continue;
            }
        }

        try {
          // *** THE CORE CHANGE ***
          // We do not call backend.addSpot(). We write to the Event Ledger.
          // The Server Edge Function handles the logic.
          const { error } = await supabase.from('events').insert({
              user_id: user.id,
              type: action.type,     // e.g. 'SPOT_ADDED'
              payload: action.payload, // The domain data
              occurred_at: new Date(action.timestamp).toISOString(),
              meta: {
                  client_id: action.id,
                  user_agent: navigator.userAgent
              }
          });

          if (error) throw error;

          console.log(`[SyncEngine] Event ${action.type} synced to ledger.`);
        } catch (error) {
          console.warn(`[SyncEngine] Failed to sync ${action.id}:`, error);
          
          action.retryCount++;
          action.lastAttempt = Date.now();
          
          if (action.retryCount <= MAX_RETRIES) {
            remaining.push(action);
          } else {
            console.error(`[SyncEngine] Dropping event ${action.id} after max retries.`);
            // In a real app, move to a "Dead Letter Queue" locally
          }
        }
      }

      await syncQueue.saveQueue(remaining);
      
      if (remaining.length > 0) {
          setTimeout(() => this.triggerSync(), BACKOFF_BASE_MS);
      }

    } catch (e) {
      console.error('[SyncEngine] Critical error during sync cycle', e);
    } finally {
      this.isSyncing = false;
    }
  }
};
