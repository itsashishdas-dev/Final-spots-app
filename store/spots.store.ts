
import { StoreSlice, SpotsState } from './types';
import { spotsService } from '../features/spots';
import { Spot, VerificationStatus } from '../types';

export const createSpotsSlice: StoreSlice<SpotsState> = (set, get) => ({
  spots: [],
  selectedSpot: null,
  lastUpdated: 0,
  isStale: true,

  refreshSpots: async () => {
    // 1. Get data (Cache Priority)
    const { data, source } = await spotsService.getAll();
    
    if (source === 'cache') {
        // Serve cache immediately, but mark as stale to indicate potential background update
        set({ 
            spots: data,
            isStale: true 
        });

        // 2. Background Refresh (Stale-While-Revalidate)
        try {
            const fresh = await spotsService.fetchFresh();
            set({ 
                spots: fresh, 
                lastUpdated: Date.now(), 
                isStale: false 
            });
        } catch (error) {
            console.warn('[SpotsStore] Background refresh failed, continuing with cached data.', error);
            // We keep isStale: true to let UI know data might be old, but it's still usable.
        }
    } else {
        // Network source (Cache was empty or failed)
        set({ 
            spots: data, 
            lastUpdated: Date.now(), 
            isStale: false 
        });
    }
  },

  addNewSpot: async (spotData: Partial<Spot>) => {
    const newSpot = await spotsService.create(spotData);
    
    // Add to local state immediately (Optimistic UI)
    const currentSpots = get().spots;
    set({ 
        spots: [...currentSpots, newSpot],
        // Adding a spot makes the list "fresh" relative to user action, 
        // but strictly speaking we might want to refresh from server to get ID/etc if it was real backend.
        // For now, updating local state keeps it usable.
        lastUpdated: Date.now() 
    });
    return newSpot;
  },

  selectSpot: (spot: Spot | null) => {
    set({ selectedSpot: spot });
  },

  verifySpot: async (spotId: string, status: VerificationStatus) => {
      // Optimistic update in UI
      const currentSpots = get().spots;
      const updatedSpots = currentSpots.map(s => 
        s.id === spotId 
          ? { ...s, verificationStatus: status, isVerified: status === VerificationStatus.VERIFIED } 
          : s
      );
      set({ spots: updatedSpots });

      // Network call + Cache Update
      await spotsService.verify(spotId, status);
      // We don't force a full refresh here to avoid UI flickering, relying on optimistic update.
  },

  deleteSpot: async (spotId: string) => {
      // Optimistic update for deletion
      const currentSpots = get().spots;
      set({ spots: currentSpots.filter(s => s.id !== spotId) });
      // In real implementation: await spotsService.delete(spotId);
  }
});
