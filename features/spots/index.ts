
export * from './hooks/useSpots';
export { default as AddSpotModal } from './components/AddSpotModal';
export { default as SpotPreviewCard } from './components/SpotPreviewCard';
export { spotsService } from './spots.service';

// DEPRECATED: Use spotsService instead
import { spotsService } from './spots.service';
export const spotsApi = spotsService;
