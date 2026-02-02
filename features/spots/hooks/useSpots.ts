
import { useAppStore } from '@/store';

// Read Hook: Subscribes to state changes
export const useSpotsData = () => {
  const { spots, selectedSpot, location, isStale, lastUpdated } = useAppStore();
  return {
    spots,
    selectedSpot,
    userLocation: location,
    isStale,
    lastUpdated
  };
};

// Write Hook: Provides actions, does not subscribe to data (mostly)
export const useSpotsActions = () => {
  const { addNewSpot, selectSpot, openModal } = useAppStore();
  return {
    addSpot: addNewSpot,
    selectSpot,
    openSpotDetail: () => openModal('SPOT_DETAIL'),
    openAddSpot: () => openModal('ADD_SPOT')
  };
};
