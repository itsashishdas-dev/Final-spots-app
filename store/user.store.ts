
import { StoreSlice, UserState } from './types';
import { backend } from '../services/mockBackend';
import { User } from '../types';
import { setSoundEnabled } from '../utils/audio';

export const createUserSlice: StoreSlice<UserState> = (set, get) => ({
  user: null,
  location: null,
  isAuthenticated: false,

  initializeUser: async () => {
    try {
      const user = await backend.getUser();
      set({ user, isAuthenticated: !!user.id && user.id !== 'u-guest' }); // Basic check
      if (user) setSoundEnabled(user.soundEnabled);
    } catch (err) {
      console.error("Failed to load user", err);
    }
  },

  checkAuth: async () => {
      const isLoggedIn = await backend.isLoggedIn();
      set({ isAuthenticated: isLoggedIn });
      return isLoggedIn;
  },

  login: async () => {
      const user = await backend.login();
      set({ user, isAuthenticated: true });
      if (user) setSoundEnabled(user.soundEnabled);
  },

  logout: async () => {
      await backend.logout();
      set({ user: null, isAuthenticated: false });
  },

  completeOnboarding: async (data: any) => {
      const updatedUser = await backend.completeOnboarding(data);
      set({ user: updatedUser });
  },

  setUserLocation: (lat: number, lng: number) => {
    set({ location: { lat, lng } });
  },
  
  updateUser: (user: User) => {
    set({ user });
    if (user) setSoundEnabled(user.soundEnabled);
  },

  updateProfile: async (data: Partial<User>) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const updated = { ...currentUser, ...data };
      await backend.updateUser(updated);
      set({ user: updated });
      setSoundEnabled(updated.soundEnabled);
  },

  toggleSound: () => {
      const user = get().user;
      if (user) {
          const newState = !user.soundEnabled;
          const updated = { ...user, soundEnabled: newState };
          backend.updateUser(updated);
          set({ user: updated });
          setSoundEnabled(newState);
      }
  },

  toggleNotifications: () => {
      const user = get().user;
      if (user) {
          const newState = !user.notificationsEnabled;
          const updated = { ...user, notificationsEnabled: newState };
          backend.updateUser(updated);
          set({ user: updated });
      }
  }
});
