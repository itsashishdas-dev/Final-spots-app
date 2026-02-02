
import { eventBus, SpotVerifiedPayload, SpotAddedPayload } from '@/core/events';
import { syncQueue } from './queue';
import { syncEngine } from './sync.engine';

/**
 * Sync Listeners
 * Decouples feature logic from network/offline logic.
 * 
 * ARCHITECTURE ENFORCEMENT:
 * 1. Catch Domain Events (e.g., SPOT_ADDED)
 * 2. Enqueue them as SyncActions
 * 3. SyncEngine picks them up and inserts into 'public.events'
 * 4. Supabase Webhook -> Edge Function -> 'public.spots'
 */
export const setupSyncListeners = () => {
  
  // SPOT_ADDED Event
  eventBus.subscribe<SpotAddedPayload>('SPOT_ADDED', async (event) => {
    const { spot } = event.payload;
    console.log('[SyncListener] Queuing SPOT_ADDED event:', spot.id);
    
    // Always enqueue. The SyncEngine handles the "Insert to Events Table" logic.
    // This ensures we never bypass the Event Sourcing pattern.
    await syncQueue.enqueue('SPOT_ADDED', { spot });
    
    // Attempt immediate sync if online
    if (navigator.onLine) {
        syncEngine.triggerSync();
    }
  });

  // SPOT_VERIFIED Event
  eventBus.subscribe<SpotVerifiedPayload>('SPOT_VERIFIED', async (event) => {
      const { spotId, status } = event.payload;
      console.log('[SyncListener] Queuing SPOT_VERIFIED event:', spotId);
      
      await syncQueue.enqueue('SPOT_VERIFIED', { id: spotId, status });
      
      if (navigator.onLine) {
          syncEngine.triggerSync();
      }
  });
};
