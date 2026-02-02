
import { create } from 'zustand';
import { AppState } from './types';
import { createUISlice } from './ui.store';
import { createUserSlice } from './user.store';
import { createSpotsSlice } from './spots.store';
import { createSessionSlice } from './session.store';
import { createGameSlice } from './game.store';
import { createCrewSlice } from './crew.store';
import { syncEngine } from '@/services/sync/sync.engine';
import { setupGameListeners } from '@/features/game/game.listeners';
import { setupSyncListeners } from '@/services/sync/sync.listeners';

export const useAppStore = create<AppState>((...a) => ({
  ...createUISlice(...a),
  ...createUserSlice(...a),
  ...createSpotsSlice(...a),
  ...createSessionSlice(...a),
  ...createGameSlice(...a),
  ...createCrewSlice(...a),

  // Global Initializer (Facade)
  initializeData: async () => {
    const [set] = a;
    set({ isLoading: true, error: null });
    
    try {
      // 1. Initialize Event Listeners (The Nervous System)
      setupGameListeners();
      setupSyncListeners();

      // 2. Initialize Background Sync Engine
      syncEngine.init();

      const state = a[1](); // get()
      
      // 3. Initialize all slices in parallel
      await Promise.all([
        state.initializeUser(),
        state.refreshSpots(),
        state.refreshSessions(),
        state.initializeGameData(),
        state.loadCrews()
      ]);
      
      set({ isLoading: false });
    } catch (err) {
      set({ error: "System Failure. Data uplink severed.", isLoading: false });
    }
  }
}));
