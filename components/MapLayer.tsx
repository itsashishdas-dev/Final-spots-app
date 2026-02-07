
import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { useSpotsActions } from '../features/spots';
import { Discipline, Spot, SpotCategory } from '../types';
import { triggerHaptic } from '../utils/haptics';

// --- MAP ICON CONFIGURATION ---
const MAP_ICONS = {
    street: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>`, 
    downhill: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`, 
    park: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8z"/></svg>`, 
    diy: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    flat: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20M2 12l2 2M22 12l-2 2"/></svg>`
};

const LEGEND_ITEMS = [
    { id: 'street', color: '#6366f1', svg: MAP_ICONS.street },
    { id: 'downhill', color: '#a855f7', svg: MAP_ICONS.downhill },
    { id: 'park', color: '#f59e0b', svg: MAP_ICONS.park },
    { id: 'diy', color: '#10b981', svg: MAP_ICONS.diy },
    { id: 'flat', color: '#3b82f6', svg: MAP_ICONS.flat },
];

interface MapLayerProps {
    spots: Spot[];
    onMapReady?: (map: any) => void;
    isEditMode?: boolean;
    onSpotDragEnd?: (spot: Spot, lat: number, lng: number) => void;
}

const MapLayer: React.FC<MapLayerProps> = ({ spots, onMapReady, isEditMode = false, onSpotDragEnd }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const { location: userCoords, selectedSpot, isPinDropActive, setTempLocation, setPinDropActive } = useAppStore();
  const { selectSpot, openSpotDetail } = useSpotsActions();

  // 1. Initialize Map
  useEffect(() => {
    const L = (window as any).L;
    if (mapContainerRef.current && L && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, { 
            zoomControl: false, 
            attributionControl: false,
            zoomAnimation: true,
            fadeAnimation: true,
            inertia: true,
        }).setView([20.5937, 78.9629], 5); // India Center

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            opacity: 1,
            subdomains: 'abcd'
        }).addTo(map);

        map.on('click', (e: any) => {
            // Check if Pin Drop mode is active
            const state = useAppStore.getState();
            if (state.isPinDropActive) {
                const { lat, lng } = e.latlng;
                state.setTempLocation({ lat, lng });
                state.setPinDropActive(false);
                triggerHaptic('success');
            } else {
                selectSpot(null);
            }
        });

        mapInstanceRef.current = map;
        if (onMapReady) onMapReady(map); 
        
        markersLayerRef.current = L.layerGroup().addTo(map);
        setIsMapReady(true);
    }

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []);

  // 2. Update User Marker
  useEffect(() => {
      const L = (window as any).L;
      if (isMapReady && mapInstanceRef.current && L && userCoords) {
          if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
          } else {
              const userIcon = L.divIcon({
                  className: 'bg-transparent',
                  html: `
                    <div class="relative w-10 h-10 flex items-center justify-center">
                      <div class="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-30"></div>
                      <div class="relative w-8 h-8 bg-indigo-600 rounded-full border-2 border-white shadow-2xl flex items-center justify-center z-10">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M4 12h16"/></svg>
                      </div>
                    </div>
                  `,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
              });
              userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
              
              // Only fly to user on first locate
              mapInstanceRef.current.flyTo([userCoords.lat, userCoords.lng], 12, { duration: 1.5 });
          }
      }
  }, [userCoords, isMapReady]);

  // 3. Update Spot Markers & Paths
  useEffect(() => {
      const L = (window as any).L;
      if (isMapReady && mapInstanceRef.current && markersLayerRef.current && L) {
          markersLayerRef.current.clearLayers();

          spots.forEach(spot => {
            if (!spot.location) return;
            const isSelected = spot.id === selectedSpot?.id;
            
            // --- A. Render Path (Polyline) for Downhill ---
            if (spot.path && spot.path.length > 1) {
                const polyline = L.polyline(spot.path, {
                    color: '#a855f7', 
                    weight: isSelected ? 6 : 4,
                    opacity: 0.8,
                    lineJoin: 'round',
                    dashArray: isSelected ? null : '5, 10'
                });

                polyline.on('click', (e: any) => {
                    L.DomEvent.stopPropagation(e);
                    triggerHaptic('medium');
                    selectSpot(spot);
                    openSpotDetail();
                    mapInstanceRef.current?.fitBounds(polyline.getBounds(), { padding: [50, 50], animate: true, duration: 1.0 });
                });

                polyline.addTo(markersLayerRef.current);
            }

            // --- B. Render Marker (Spot Location) ---
            const isValidCoord = 
                typeof spot.location.lat === 'number' && 
                typeof spot.location.lng === 'number' && 
                (Math.abs(spot.location.lat) > 0.1 || Math.abs(spot.location.lng) > 0.1);

            if (isValidCoord) {
                let config = LEGEND_ITEMS.find(item => item.id === 'street');
                if (spot.type === Discipline.DOWNHILL) config = LEGEND_ITEMS.find(item => item.id === 'downhill');
                else if (spot.category === SpotCategory.PARK) config = LEGEND_ITEMS.find(item => item.id === 'park');
                else if (spot.category === SpotCategory.DIY) config = LEGEND_ITEMS.find(item => item.id === 'diy');
                
                const color = config?.color || '#6366f1';
                const svg = config?.svg || MAP_ICONS.street;
                
                const html = `
                   <div class="relative w-8 h-8 flex items-center justify-center group transition-transform duration-300 ${isSelected ? 'scale-150 z-50' : 'hover:scale-125 z-40'}">
                      <div class="absolute inset-0 rounded-full animate-pulse opacity-50" style="background-color: ${color}"></div>
                      <div class="relative w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white z-10" style="background-color: ${color}">
                          ${svg}
                      </div>
                   </div>
                `;

                const marker = L.marker([spot.location.lat, spot.location.lng], {
                  icon: L.divIcon({ className: 'bg-transparent', html: html, iconSize: [32, 32], iconAnchor: [16, 16] }),
                  zIndexOffset: isSelected ? 1000 : 100,
                  draggable: false // MODERATOR EDIT REQUIREMENT: Disable marker dragging entirely
                });

                marker.on('click', (e: any) => {
                    L.DomEvent.stopPropagation(e);
                    triggerHaptic('medium');
                    selectSpot(spot);
                    if (!isEditMode) {
                        openSpotDetail();
                    }
                    mapInstanceRef.current?.flyTo([spot.location.lat - 0.002, spot.location.lng], 16, { duration: 1 });
                });

                marker.addTo(markersLayerRef.current);
            }
          });
      }
  }, [spots, selectedSpot, isMapReady, isEditMode]);

  return <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full pointer-events-auto" />;
};

export default MapLayer;
