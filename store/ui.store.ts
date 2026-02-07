
import { StoreSlice, UIState } from './types';
import { AppView, ModalType } from '../types';

export const createUISlice: StoreSlice<UIState> = (set) => ({
  currentView: 'MAP',
  previousView: null,
  activeModal: 'NONE',
  mapViewSettings: null,
  isLoading: true,
  error: null,
  isPinDropActive: false,

  setView: (view: AppView) => 
    set((state) => ({ 
      previousView: state.currentView !== view ? state.currentView : state.previousView,
      currentView: view, 
      activeModal: 'NONE' 
    })),

  openModal: (type: ModalType) => set({ activeModal: type }),
  
  closeModal: () => set({ activeModal: 'NONE', chatChannel: null }), // chatChannel is in Session slice but cleared here
  
  setMapViewSettings: (settings) => set({ mapViewSettings: settings }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  setPinDropActive: (active) => set({ isPinDropActive: active })
});
