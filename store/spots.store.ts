
import { StoreSlice, SpotsState } from './types';
import { spotsService } from '../features/spots';
import { Spot, VerificationStatus } from '../types';

export const createSpotsSlice: StoreSlice<SpotsState> = (set, get) => ({
  spots: [],
  selectedSpot: null,
  lastUpdated: 0,
  isStale: true,
  lastEdit: null,
  tempLocation: null,

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

  // Moderator Action
  updateSpot: async (id: string, updates: Partial<Spot>) => {
      const currentSpots = get().spots;
      const originalSpot = currentSpots.find(s => s.id === id);
      
      if (!originalSpot) return;

      // 1. Capture state for Undo
      set({ 
          lastEdit: { 
              spotId: id, 
              previousState: JSON.parse(JSON.stringify(originalSpot)) 
          } 
      });

      // 2. Optimistic Update
      const updatedSpots = currentSpots.map(s => 
          s.id === id ? { ...s, ...updates } : s
      );
      
      // CRITICAL: Update selectedSpot if it's the one being edited so Modals refresh
      const currentSelected = get().selectedSpot;
      const updatedSelected = currentSelected && currentSelected.id === id 
          ? { ...currentSelected, ...updates } 
          : currentSelected;

      set({ 
          spots: updatedSpots,
          selectedSpot: updatedSelected,
          tempLocation: null // Reset temp location on save
      });

      // 3. Network Call & Logging
      try {
          await spotsService.update(id, updates);
          
          // Log edit to audit trail (non-blocking)
          const user = get().user;
          if (user) {
              spotsService.logEdit({
                  spotId: id,
                  editorId: user.id,
                  prevLat: originalSpot.location.lat,
                  prevLng: originalSpot.location.lng,
                  newLat: updates.location?.lat ?? originalSpot.location.lat,
                  newLng: updates.location?.lng ?? originalSpot.location.lng
              });
          }
      } catch (error) {
          // Revert on error
          set({ spots: currentSpots, selectedSpot: currentSelected });
          console.error("Failed to update spot", error);
          throw error;
      }
  },

  undoLastEdit: async () => {
      const { lastEdit, spots, selectedSpot } = get();
      if (!lastEdit) return;

      // Revert in UI
      const updatedSpots = spots.map(s => 
          s.id === lastEdit.spotId ? lastEdit.previousState : s
      );
      
      // Update selectedSpot if needed
      const updatedSelected = selectedSpot && selectedSpot.id === lastEdit.spotId 
          ? lastEdit.previousState 
          : selectedSpot;

      set({ spots: updatedSpots, selectedSpot: updatedSelected, lastEdit: null }); // Clear undo after use

      // Revert in Backend
      try {
          await spotsService.update(lastEdit.spotId, {
              location: lastEdit.previousState.location,
              name: lastEdit.previousState.name,
              type: lastEdit.previousState.type,
              difficulty: lastEdit.previousState.difficulty
          });
      } catch (error) {
          console.error("Failed to undo edit", error);
          // Force refresh if undo fails to ensure consistency
          get().refreshSpots();
      }
  },

  selectSpot: (spot: Spot | null) => {
    set({ selectedSpot: spot, tempLocation: null });
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
  },

  setTempLocation: (loc) => {
      set({ tempLocation: loc });
  }
});
