
import { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store';
import { triggerHaptic } from '@/utils/haptics';
import { playSound } from '@/utils/audio';
import { Spot, Discipline } from '@/types';

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useSpotsView = () => {
  const { 
    spots, 
    user,
    location: userLocation, 
    setUserLocation, 
    selectSpot, 
    selectedSpot,
    openModal,
    setView,
    updateSpot,
    undoLastEdit,
    lastEdit,
    isPinDropActive,
    setPinDropActive
  } = useAppStore();

  const [mapInstance, setMapInstance] = useState<any>(null);
  const mapInstanceRef = useRef<any>(null);
  
  useEffect(() => {
      mapInstanceRef.current = mapInstance;
  }, [mapInstance]);

  const [nearbyScanResults, setNearbyScanResults] = useState<Spot[]>([]);
  const [showScanAlert, setShowScanAlert] = useState(false);
  const [isExitingScan, setIsExitingScan] = useState(false);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [showLegend, setShowLegend] = useState(false);
  
  // Moderator Edit Mode
  const isModerator = user?.email && ['admin@push.com', 'mod@push.com'].includes(user.email);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Visibility State
  const [revealedSpotIds, setRevealedSpotIds] = useState<Set<string>>(new Set());
  
  // Filter Logic
  const visibleSpots = useMemo(() => {
      return spots.filter(spot => {
          if (!revealedSpotIds.has(spot.id) && !isEditMode && !isModerator) return false;
          if (searchQuery && !spot.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
          if (activeFilter === 'ALL') return true;
          if (activeFilter === 'VERIFIED') return spot.isVerified;
          return spot.type === activeFilter || spot.category === activeFilter;
      });
  }, [spots, revealedSpotIds, searchQuery, activeFilter, isEditMode, isModerator]);

  const openSpotDetail = () => {
      if (isEditMode) {
          setShowEditModal(true);
      } else {
          openModal('SPOT_DETAIL');
      }
  };
  
  // Logic to handle modal visibility vs pin drop state
  useEffect(() => {
      if (isPinDropActive) {
          setShowEditModal(false);
      } else if (isEditMode && selectedSpot) {
          setShowEditModal(true);
      }
  }, [isPinDropActive, isEditMode, selectedSpot]);

  const dismissScanAlert = () => {
      setIsExitingScan(true);
      setTimeout(() => setShowScanAlert(false), 300);
  };

  const handleLocate = () => {
    triggerHaptic('medium');
    playSound('map_zoom');
    const L = (window as any).L;
    const executeLocate = (lat: number, lng: number) => {
        if (!mapInstanceRef.current || !L) return;
        const SCAN_RADIUS_KM = 50; 
        const nearby = spots.filter(spot => {
            const dist = getDistance(lat, lng, spot.location.lat, spot.location.lng);
            return dist <= SCAN_RADIUS_KM;
        });
        setNearbyScanResults(nearby);
        if (nearby.length > 0) {
            setShowScanAlert(true);
            setIsExitingScan(false);
            playSound('radar_complete');
        } else {
            setShowScanAlert(false);
        }
        mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 2.0 });
        setUserLocation(lat, lng);
    };
    if (userLocation) {
        executeLocate(userLocation.lat, userLocation.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => executeLocate(pos.coords.latitude, pos.coords.longitude),
        () => alert("GPS Access Denied")
      );
    }
  };

  const handleVisualizeScan = () => {
      if (!mapInstanceRef.current || nearbyScanResults.length === 0) return;
      const L = (window as any).L;
      triggerHaptic('success');
      playSound('data_stream');
      setRevealedSpotIds(prev => {
          const next = new Set(prev);
          nearbyScanResults.forEach(s => next.add(s.id));
          return next;
      });
      if (nearbyScanResults.length === 1) {
          const spot = nearbyScanResults[0];
          mapInstanceRef.current?.flyTo([spot.location.lat - 0.002, spot.location.lng], 16, { duration: 1.5 });
          selectSpot(spot);
          openSpotDetail();
      } else {
          const latLngs = nearbyScanResults.map(s => [s.location.lat, s.location.lng]);
          if (userLocation) latLngs.push([userLocation.lat, userLocation.lng]);
          const bounds = L.latLngBounds(latLngs);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.5 });
      }
      dismissScanAlert();
  };

  const handleZoom = (delta: number) => {
      if (mapInstance) {
          triggerHaptic('light');
          if (delta > 0) mapInstance.zoomIn();
          else mapInstance.zoomOut();
      }
  };

  const handleUndo = async () => {
      triggerHaptic('medium');
      await undoLastEdit();
      playSound('click');
  };

  return {
    // Data
    spots,
    visibleSpots,
    user,
    userLocation,
    selectedSpot,
    lastEdit,
    
    // State
    mapInstance,
    setMapInstance,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    showLegend,
    setShowLegend,
    isEditMode,
    setIsEditMode,
    showEditModal,
    setShowEditModal,
    isPinDropActive,
    setPinDropActive,
    showScanAlert,
    isExitingScan,
    nearbyScanResults,
    isModerator,

    // Actions
    openSpotDetail,
    handleLocate,
    handleVisualizeScan,
    handleZoom,
    handleUndo,
    updateSpot,
    dismissScanAlert,
    setView,
    selectSpot,
    triggerHaptic // exposed if needed for UI-only interactions
  };
};
