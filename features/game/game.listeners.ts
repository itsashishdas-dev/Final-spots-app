
import { eventBus } from '@/core/events';
import { useAppStore } from '@/store';
import { XP_SOURCES } from '@/core/constants';

/**
 * Game Listeners
 * Reacts to domain events to update Game State (XP, Level, etc.)
 */
export const setupGameListeners = () => {
  const store = useAppStore.getState();

  // 1. Spot Added -> Grant XP
  eventBus.subscribe('SPOT_ADDED', async (event) => {
    console.log('[GameSystem] Detecting contribution:', event.id);
    await store.grantXp(XP_SOURCES.SPOT_CONTRIBUTION, 'Spot Contribution');
  });

  // 2. Session Created -> Grant XP
  eventBus.subscribe('SESSION_CREATED', async () => {
    await store.grantXp(XP_SOURCES.SESSION_PLANNED, 'Session Planned');
  });

  // 3. Challenge Completed -> Grant XP (Handled in store usually, but redundancy is safe)
  eventBus.subscribe('CHALLENGE_COMPLETED', async (event) => {
      // Logic often handled in completeChallengeAction, but we could decouple here
      // For now, we trust the triggering action handled the specific reward, 
      // but we could add bonus "Streak" XP here.
  });
};
