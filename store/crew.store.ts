
import { StoreSlice, CrewState } from './types';
import { backend } from '../services/mockBackend';
import { Crew } from '../types';

export const createCrewSlice: StoreSlice<CrewState> = (set, get) => ({
  crews: [],
  activeCrew: null,

  loadCrews: async () => {
    const crews = await backend.getAllCrews();
    set({ crews });
  },

  loadUserCrew: async (crewId: string) => {
    const crew = await backend.getUserCrew(crewId);
    set({ activeCrew: crew });
  },

  createCrew: async (data: Partial<Crew>) => {
    const newCrew = await backend.createCrew(data);
    // Update user's crewId in user state
    const currentUser = get().user;
    if (currentUser) {
        set({ user: { ...currentUser, crewId: newCrew.id }, activeCrew: newCrew });
    }
    // Refresh list
    await get().loadCrews();
  },

  requestJoinCrew: async (crewId: string) => {
    await backend.requestJoinCrew(crewId);
    await get().loadCrews();
  },

  respondToJoinRequest: async (crewId: string, userId: string, approved: boolean) => {
    const updatedCrew = await backend.respondToJoinRequest(crewId, userId, approved);
    set({ activeCrew: updatedCrew });
  },

  leaveCrew: async () => {
    const updatedUser = await backend.leaveCrew();
    set({ user: updatedUser, activeCrew: null });
    await get().loadCrews();
  }
});
