import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '../store';
import { useSpotsData, useSpotsActions } from '../features/spots';
import { Search, Grid, Plus, Minus, Globe, Sun, Sunset, Sunrise, CloudSun, MapPin, ChevronRight, X, Wind, Droplets, Thermometer, CloudRain, Radio, Signal, Map as MapIcon, ChevronDown, Radar, Target, Bell, BellOff, Crosshair, Database, Wifi, WifiOff } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { Discipline, SpotCategory, Spot, SpotStatus } from '../types';
import { playSound } from '../utils/audio';
import { useLayoutMode } from '../hooks/useLayoutMode';

const MIN_DISCOVERY_ZOOM = 4;

// --- TACTICAL MAP ICONS ---
const MARKER_SHAPES = {
    street: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full filter drop-shadow-md"><path d="M12 0L24 12L12 24L0 12L12 0Z"/></svg>`,
    park: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full filter drop-shadow-md"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z"/></svg>`,
    downhill: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full filter drop-shadow-md"><path d="M12 2 L22 22 H2 Z"/></svg>`,
    diy: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full filter drop-shadow-md"><rect x="3" y="3" width="18" height="18" rx="3" /></svg>`,
    flat: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full filter drop-shadow-md"><circle cx="12" cy="12" r="11"/></svg>`
};

const INNER_ICONS = {
    street: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-[60%] h-[60%]"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    park: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-[60%] h-[60%]"><path d="M2 16c0-6 4-10 10-10s10 4 10 10" /></svg>`,
    downhill: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-[50%] h-[50%] translate-y-[20%]"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>`,
    diy: `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-[60%] h-[60%]"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
    flat: `<svg viewBox="0 0 24 24" fill="white" stroke="none" class="w-[40%] h-[40%]"><circle cx="12" cy="12" r="12"/></svg>`
};

const LEGEND_ITEMS = [
    { id: 'street', label: 'Street', color: '#6366f1', shape: MARKER_SHAPES.street, icon: INNER_ICONS.street },
    { id: 'downhill', label: 'Downhill', color: '#a855f7', shape: MARKER_SHAPES.downhill, icon: INNER_ICONS.downhill },
    { id: 'park', label: 'Skatepark', color: '#f59e0b', shape: MARKER_SHAPES.park, icon: INNER_ICONS.park },
    { id: 'diy', label: 'DIY Spot', color: '#10b981', shape: MARKER_SHAPES.diy, icon: INNER_ICONS.diy },
    { id: 'flat', label: 'Flatground', color: '#3b82f6', shape: MARKER_SHAPES.flat, icon: INNER_ICONS.flat },
];

const getLegendId = (spot: Spot) => {
    if (spot.type === Discipline.DOWNHILL) return 'downhill';
    if (spot.category === SpotCategory.PARK) return 'park';
    if (spot.category === SpotCategory.DIY) return 'diy';
    if (spot.category === SpotCategory.FLATGROUND) return 'flat';
    return 'street';
};

function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

// Distance Helper (Haversine)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

const SpotsView: React.FC = () => {
  const { 
    user, 
    location, 
    setUserLocation,
    mapViewSettings,
    setMapViewSettings,
    toggleNotifications,
    setView
  } = useAppStore();

  const { spots, selectedSpot, isStale } = useSpotsData(); // Access isStale
  const { selectSpot, openSpotDetail, openAddSpot } = useSpotsActions();

  const layoutMode = useLayoutMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [suggestions, setSuggestions] = useState<{type: 'spot' | 'state', label: string, id?: string, data?: any}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  
  const [revealedSpotIds, setRevealedSpotIds] = useState<Set<string>>(new Set());
  const [discoveryQueue, setDiscoveryQueue] = useState<Spot[]>([]);
  const discoveredRef = useRef<Set<string>>(new Set()); 
  
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isScanningWeather, setIsScanningWeather] = useState(false);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  
  // Nearby Scan State
  const [nearbyScanResults, setNearbyScanResults] = useState<Spot[]>([]);
  const [showScanAlert, setShowScanAlert] = useState(false);
  const [isExitingScan, setIsExitingScan] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const markersMapRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Helper for closing the scan alert with animation
  const dismissScanAlert = () => {
      setIsExitingScan(true);
      setTimeout(() => {
          setShowScanAlert(false);
          setIsExitingScan(false);
      }, 300); // Wait for 300ms animation
  };

  useEffect(() => {
    if (location) {
        setIsScanningWeather(true);
        const timer = setTimeout(() => {
            const baseTemp = 30 - Math.floor((location.lat - 8) * 0.4); 
            const randomFactor = (location.lat + location.lng) % 10;
            
            let condition = { text: 'CLEAR', icon: Sun, color: 'text-amber-400' };
            let calculatedUV = 8; 

            if (randomFactor > 7) {
                condition = { text: 'HAZE', icon: CloudSun, color: 'text-orange-300' };
                calculatedUV = 5;
            } else if (randomFactor > 8.5) {
                condition = { text: 'OVCST', icon: CloudSun, color: 'text-slate-300' };
                calculatedUV = 2;
            } else if (randomFactor < 1) {
                condition = { text: 'RAIN', icon: CloudRain, color: 'text-blue-400' };
                calculatedUV = 1;
            }

            const uvIndex = Math.max(0, calculatedUV + Math.floor((Math.random() - 0.5) * 2));
            const baseSunrise = 6 * 60; 
            const baseSunset = 18 * 60 + 30; 
            const offset = (82.5 - location.lng) * 4; 
            
            const formatTime = (mins: number) => {
                let h = Math.floor(mins / 60);
                let m = Math.floor(mins % 60);
                if (m < 0) { m += 60; h -= 1; }
                if (h >= 24) h -= 24;
                if (h < 0) h += 24;
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
            };

            setWeatherData({
                temp: baseTemp,
                condition: condition,
                humidity: 40 + Math.floor(randomFactor * 4), 
                wind: 5 + Math.floor(randomFactor * 1.5), 
                uvIndex: uvIndex,
                aqi: 80 + Math.floor(randomFactor * 15), 
                sunrise: formatTime(baseSunrise + offset),
                sunset: formatTime(baseSunset + offset),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            setIsScanningWeather(false);
        }, 1200);
        return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
      if (searchQuery.length > 1) {
          const lowerQ = searchQuery.toLowerCase();
          
          const spotMatches = spots
              .filter(s => s.name.toLowerCase().includes(lowerQ) || s.location.address.toLowerCase().includes(lowerQ))
              .slice(0, 3)
              .map(s => ({ type: 'spot' as const, label: s.name, id: s.id, data: s }));

          const uniqueStates = Array.from(new Set(spots.map(s => s.state)))
              .filter((state: string) => state.toLowerCase().includes(lowerQ))
              .slice(0, 2)
              .map(state => ({ type: 'state' as const, label: state, data: state }));

          setSuggestions([...spotMatches, ...uniqueStates]);
          setShowSuggestions(true);
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  }, [searchQuery, spots]);

  const handleSuggestionClick = (item: typeof suggestions[0]) => {
      triggerHaptic('medium');
      playSound('map_zoom');
      setSearchQuery('');
      setShowSuggestions(false);

      if (item.type === 'spot' && item.data) {
          const spot = item.data as Spot;
          mapInstanceRef.current?.flyTo([spot.location.lat, spot.location.lng], 16, { duration: 1.5 });
          if (!revealedSpotIds.has(spot.id)) {
              setRevealedSpotIds(prev => new Set(prev).add(spot.id));
              discoveredRef.current.add(spot.id);
          }
          selectSpot(spot);
          openSpotDetail();
      } else if (item.type === 'state') {
          const stateSpot = spots.find(s => s.state === item.data);
          if (stateSpot) {
              mapInstanceRef.current?.flyTo([stateSpot.location.lat, stateSpot.location.lng], 8, { duration: 1.5 });
          }
      }
  };

  const handleToggleNotifications = async () => {
      if (!user) return;
      triggerHaptic('medium');
      const newState = !user.notificationsEnabled;
      toggleNotifications();
      playSound(newState ? 'success' : 'click');
  };

  useEffect(() => {
    let visibilityTimer: any;
    let resizeTimer: any;
    const L = (window as any).L;

    if (mapContainerRef.current && L && !mapInstanceRef.current) {
        
        let initialCenter: [number, number] = [20.5937, 78.9629];
        let initialZoom = 5;

        if (mapViewSettings) {
            initialCenter = [mapViewSettings.center.lat, mapViewSettings.center.lng];
            initialZoom = mapViewSettings.zoom;
        } else if (location) {
            initialCenter = [location.lat, location.lng];
            initialZoom = 12;
        }

        const map = L.map(mapContainerRef.current, { 
            zoomControl: false, 
            attributionControl: false,
            zoomAnimation: true,
            fadeAnimation: true,
            inertia: true,
        }).setView(initialCenter, initialZoom);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            opacity: 1,
            subdomains: 'abcd'
        }).addTo(map);

        map.on('click', () => {
            selectSpot(null);
            setShowSuggestions(false);
        });

        const checkVisibility = () => {
            if (!map) return;
            const currentZoom = map.getZoom();
            if (currentZoom < MIN_DISCOVERY_ZOOM) return;

            const bounds = map.getBounds();
            const visibleSpots = spots.filter(s => {
                const latLng = L.latLng(s.location.lat, s.location.lng);
                return bounds.contains(latLng);
            });

            const newDiscoveries = visibleSpots.filter(s => !discoveredRef.current.has(s.id));
            
            if (newDiscoveries.length > 0) {
                const shuffled: Spot[] = shuffleArray(newDiscoveries);
                setDiscoveryQueue(prev => [...prev, ...shuffled]);
                newDiscoveries.forEach(s => discoveredRef.current.add(s.id));
            }
        };

        map.on('moveend', () => {
            checkVisibility();
            const center = map.getCenter();
            setMapViewSettings({ center: { lat: center.lat, lng: center.lng }, zoom: map.getZoom() });
        });
        map.on('zoomend', checkVisibility);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
        setIsMapReady(true);
        
        visibilityTimer = setTimeout(checkVisibility, 200);
    }
    
    if (mapInstanceRef.current) {
        resizeTimer = setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 200);
    }

    return () => {
        clearTimeout(visibilityTimer);
        clearTimeout(resizeTimer);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
            markersLayerRef.current = null;
            markersMapRef.current.clear();
            userMarkerRef.current = null;
            setIsMapReady(false);
        }
    };
  }, [layoutMode, spots]); 

  useEffect(() => {
      if (discoveryQueue.length === 0) return;

      const processQueue = () => {
          const nextSpot = discoveryQueue[0];
          const remaining = discoveryQueue.slice(1);
          
          setRevealedSpotIds(prev => new Set(prev).add(nextSpot.id));
          setDiscoveryQueue(remaining);
          triggerHaptic('light');
      };

      const delay = Math.random() * 300 + 100;
      const timer = setTimeout(processQueue, delay);

      return () => clearTimeout(timer);
  }, [discoveryQueue]);

  useEffect(() => {
      const L = (window as any).L;
      if (isMapReady && mapInstanceRef.current && markersLayerRef.current && L) {
          
          const spotsToShow = spots.filter(spot => {
              const matchesFilter = activeFilter === 'ALL' 
                  ? true 
                  : activeFilter === 'VERIFIED' 
                      ? spot.isVerified 
                      : spot.type === activeFilter;
              
              const isRevealed = revealedSpotIds.has(spot.id);
              return matchesFilter && isRevealed;
          });

          const currentIds = new Set(spotsToShow.map(s => s.id));

          markersMapRef.current.forEach((marker, id) => {
              if (!currentIds.has(id)) {
                  markersLayerRef.current.removeLayer(marker);
                  markersMapRef.current.delete(id);
              }
          });

          spotsToShow.forEach(spot => {
              const isSelected = spot.id === selectedSpot?.id;
              const isBuzzing = spot.status === SpotStatus.CROWDED || (spot.sessions && spot.sessions.length > 0);

              if (!markersMapRef.current.has(spot.id)) {
                  const legendId = getLegendId(spot);
                  const config = LEGEND_ITEMS.find(item => item.id === legendId) || LEGEND_ITEMS[0];
                  
                  const color = config.color;
                  const shapeSvg = config.shape;
                  const innerSvg = config.icon;

                  const pulseHtml = isBuzzing 
                    ? `<div class="absolute inset-0 rounded-full animate-breathe-out opacity-50" style="background-color: ${color}"></div>` 
                    : '';

                  const html = `
                     <div class="relative w-6 h-6 flex items-center justify-center group transition-transform duration-300 animate-pop ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-40'}">
                        ${pulseHtml}
                        <div class="relative w-full h-full flex items-center justify-center" style="color: ${color}">
                            <div class="absolute inset-0 w-full h-full">${shapeSvg}</div>
                            <div class="absolute inset-0 flex items-center justify-center">${innerSvg}</div>
                        </div>
                     </div>
                  `;

                  const marker = L.marker([spot.location.lat, spot.location.lng], {
                    icon: L.divIcon({ className: 'bg-transparent border-none', html: html, iconSize: [24, 24], iconAnchor: [12, 12] }),
                    zIndexOffset: isSelected ? 1000 : 100
                  });

                  marker.on('click', (e: any) => {
                      L.DomEvent.stopPropagation(e);
                      triggerHaptic('medium');
                      playSound('map_zoom');
                      selectSpot(spot);
                      openSpotDetail();
                      mapInstanceRef.current?.flyTo([spot.location.lat - 0.002, spot.location.lng], 16, { duration: 1 });
                  });
                  
                  marker.addTo(markersLayerRef.current);
                  markersMapRef.current.set(spot.id, marker);
              } else {
                  const marker = markersMapRef.current.get(spot.id);
                  marker.setZIndexOffset(isSelected ? 1000 : 100);
                  
                  const el = marker.getElement();
                  if (el) {
                      const container = el.querySelector('.group');
                      if (container) {
                          if (isSelected) {
                              container.classList.add('scale-125', 'z-50');
                              container.classList.remove('hover:scale-110', 'z-40');
                          } else {
                              container.classList.remove('scale-125', 'z-50');
                              container.classList.add('hover:scale-110', 'z-40');
                          }
                      }
                  }
              }
          });
      }
  }, [spots, selectedSpot, isMapReady, activeFilter, revealedSpotIds]);

  useEffect(() => {
      const L = (window as any).L;
      if (isMapReady && mapInstanceRef.current && L && location) {
          if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng([location.lat, location.lng]);
          } else {
              const userIcon = L.divIcon({
                  className: 'bg-transparent border-none',
                  html: `
                    <div class="relative w-12 h-12 flex items-center justify-center">
                      <div class="absolute inset-0 bg-indigo-500/40 rounded-full blur-lg animate-pulse"></div>
                      <div class="absolute inset-3 border-2 border-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] opacity-90"></div>
                      <div class="relative w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white] z-10"></div>
                    </div>
                  `,
                  iconSize: [48, 48],
                  iconAnchor: [24, 24]
              });
              userMarkerRef.current = L.marker([location.lat, location.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstanceRef.current);
          }
      }
  }, [location, isMapReady]);

  const revealedLegendIds = useMemo(() => {
      const ids = new Set<string>();
      revealedSpotIds.forEach(id => {
          const spot = spots.find(s => s.id === id);
          if (spot) {
              ids.add(getLegendId(spot));
          }
      });
      return ids;
  }, [revealedSpotIds, spots]);

  const handleLocate = () => {
    triggerHaptic('medium');
    playSound('map_zoom');
    
    const L = (window as any).L;
    
    const executeLocate = (lat: number, lng: number) => {
        if (!mapInstanceRef.current || !L) return;

        // Perform tactical scan
        const SCAN_RADIUS_KM = 20; 
        const nearby = spots.filter(spot => {
            const dist = getDistance(lat, lng, spot.location.lat, spot.location.lng);
            return dist <= SCAN_RADIUS_KM;
        });

        // Set scan results for HUD
        setNearbyScanResults(nearby);
        if (nearby.length > 0) {
            setShowScanAlert(true);
            setIsExitingScan(false);
            playSound('radar_complete');
            // Auto-reveal these spots on the map
            nearby.forEach(s => {
                if (!revealedSpotIds.has(s.id)) {
                    setRevealedSpotIds(prev => new Set(prev).add(s.id));
                    discoveredRef.current.add(s.id);
                }
            });
            // Hide after 8s if no interaction
            setTimeout(dismissScanAlert, 8000);
        } else {
            setShowScanAlert(false);
        }

        const userLatLng = L.latLng(lat, lng);
        mapInstanceRef.current.flyTo([lat, lng], 11, { duration: 2.0 });
        setUserLocation(lat, lng);
    };

    if (location) {
        executeLocate(location.lat, location.lng);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
            executeLocate(pos.coords.latitude, pos.coords.longitude);
        },
        () => alert("GPS Access Denied")
      );
    }
  };

  const handleVisualizeScan = () => {
      if (!mapInstanceRef.current || nearbyScanResults.length === 0) return;
      const L = (window as any).L;
      
      triggerHaptic('medium');
      playSound('data_stream');
      
      if (nearbyScanResults.length === 1) {
          const spot = nearbyScanResults[0];
          selectSpot(spot);
          openSpotDetail();
          mapInstanceRef.current?.flyTo([spot.location.lat - 0.002, spot.location.lng], 16, { duration: 1.5 });
      } else {
          const latLngs = nearbyScanResults.map(s => [s.location.lat, s.location.lng]);
          if (location) latLngs.push([location.lat, location.lng]);
          const bounds = L.latLngBounds(latLngs);
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.0 });
      }
      dismissScanAlert();
  };
  
  const handleWorldView = () => {
      triggerHaptic('light');
      playSound('map_zoom');
      mapInstanceRef.current?.flyTo([20.5937, 78.9629], 5, { duration: 1.5 });
  };

  const handleZoomIn = () => { triggerHaptic('light'); playSound('click'); mapInstanceRef.current?.zoomIn(); };
  const handleZoomOut = () => { triggerHaptic('light'); playSound('click'); mapInstanceRef.current?.zoomOut(); };
  const toggleView = () => { triggerHaptic('medium'); playSound('click'); setView('LIST'); };
  const toggleWeather = () => { triggerHaptic('light'); playSound('data_stream'); setIsWeatherExpanded(!isWeatherExpanded); };
  const toggleLegend = () => { triggerHaptic('light'); playSound('click'); setIsLegendExpanded(!isLegendExpanded); };

  return (
    <div className="flex-1 relative h-full w-full bg-[#050505] overflow-hidden font-mono">
      <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col h-full">
        <div className="pt-safe-top px-4 pb-2 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-auto w-full max-w-lg relative mx-auto">
             <div className="flex items-center gap-3 mb-3 relative">
                <button onClick={() => setView('PROFILE')} className="w-10 h-10 rounded-md border border-slate-700 bg-slate-900 overflow-hidden shadow-lg shrink-0 active:scale-95 transition-transform z-30 relative group">
                   <div className="absolute inset-0 bg-indigo-500/20 hidden group-hover:block animate-pulse"></div>
                   <img src={user?.avatar} className="w-full h-full object-cover transition-all group-hover:grayscale-0" />
                </button>
                
                <div className="flex-1 relative h-10 z-40 group">
                    <div className="absolute inset-0 bg-[#080808]/90 backdrop-blur-md border border-slate-700 rounded-md flex items-center px-3 shadow-lg focus-within:border-indigo-500 transition-colors">
                        <Search size={14} className="text-slate-500 mr-2 group-focus-within:text-indigo-400" />
                        <input 
                            type="text" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                            placeholder="SEARCH DATABASE..." 
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-white uppercase tracking-widest w-full placeholder:text-slate-600 font-mono" 
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="p-1 rounded-full hover:bg-white/10 text-slate-500">
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-12 left-0 right-0 bg-[#0b0c10] border-2 border-slate-800 rounded-md overflow-hidden shadow-2xl animate-[fadeIn_0.1s_ease-out]">
                            <div className="px-3 py-2 text-[8px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 bg-[#080808]">
                                Search Results
                            </div>
                            {suggestions.map((item, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSuggestionClick(item)}
                                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-indigo-900/20 hover:text-white transition-colors border-b border-white/5 last:border-0 group"
                                >
                                    <div className="w-6 h-6 rounded-sm bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:border-indigo-500/50 group-hover:text-indigo-400">
                                        {item.type === 'spot' ? <MapPin size={12} /> : <Globe size={12} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold uppercase tracking-wide text-slate-200">{item.label}</div>
                                        <div className="text-[8px] font-mono text-slate-500">{item.type === 'spot' ? 'COORDINATES FOUND' : 'SECTOR REGION'}</div>
                                    </div>
                                    <ChevronRight size={12} className="text-slate-700 group-hover:text-indigo-500" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={toggleView} className="w-10 h-10 rounded-md border border-slate-700 bg-[#080808]/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 active:scale-95 transition-all shadow-lg z-30 relative">
                    <Grid size={16} />
                </button>
             </div>

             <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 pl-1 items-start relative z-20">
                 {/* Connection Status Indicator */}
                 <div className={`
                    h-9 px-3 rounded-md border backdrop-blur-xl shadow-lg flex items-center justify-center shrink-0 transition-all duration-300 relative z-30
                    ${isStale 
                        ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' 
                        : 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400'}
                 `}>
                    {isStale ? <WifiOff size={14} className="mr-1.5" /> : <Wifi size={14} className="mr-1.5" />}
                    <span className="text-[9px] font-black uppercase tracking-widest">{isStale ? 'CACHED' : 'LIVE'}</span>
                 </div>

                 <button 
                    onClick={toggleWeather}
                    className={`
                        relative rounded-md border border-slate-700 bg-[#0b0c10]/90 backdrop-blur-xl shadow-lg
                        transition-all duration-300 ease-out overflow-hidden flex flex-col shrink-0 z-30
                        ${isWeatherExpanded ? 'w-48 p-3' : 'w-9 h-9 items-center justify-center'}
                    `}
                 >
                     {!isWeatherExpanded && (
                         <div className={`transition-all duration-300 ${isScanningWeather ? 'animate-pulse text-indigo-400' : 'text-amber-400'}`}>
                            {isScanningWeather ? <Radio size={14} /> : <Sun size={16} />}
                         </div>
                     )}

                     {isWeatherExpanded && (
                         <div className="w-full animate-[fadeIn_0.2s_ease-out]">
                             {/* Weather content omitted for brevity, same as previous */}
                             <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                                 <div className="flex items-center gap-1.5">
                                     <Signal size={10} className={`text-red-500 ${isScanningWeather ? 'animate-pulse' : ''}`} />
                                     <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Atmos Sensor</span>
                                 </div>
                                 <span className="text-[7px] font-mono text-emerald-500 bg-emerald-500/10 px-1 rounded">{isScanningWeather ? 'SCANNING' : 'ONLINE'}</span>
                             </div>
                             {/* ... rest of weather component */}
                             {isScanningWeather ? (
                                 <div className="space-y-2 py-2">
                                     <div className="h-1 w-full bg-slate-800 rounded overflow-hidden">
                                         <div className="h-full bg-indigo-500 animate-[shimmer_1s_infinite] w-2/3"></div>
                                     </div>
                                     <div className="flex justify-between text-[7px] font-mono text-slate-500">
                                         <span>CALIBRATING SENSORS...</span>
                                         <span>98%</span>
                                     </div>
                                 </div>
                             ) : weatherData ? (
                                 <div className="space-y-3">
                                     <div className="flex justify-between items-center">
                                         <div className="flex items-baseline gap-1">
                                             <span className="text-3xl font-black text-white italic leading-none font-mono">{weatherData.temp}°</span>
                                             <span className="text-[8px] font-bold text-slate-500">C</span>
                                         </div>
                                         <div className="flex flex-col items-end">
                                             <weatherData.condition.icon size={18} className={weatherData.condition.color} />
                                             <span className="text-[7px] font-black text-white uppercase tracking-widest mt-1 bg-white/10 px-1.5 py-0.5 rounded">{weatherData.condition.text}</span>
                                         </div>
                                     </div>
                                 </div>
                             ) : null}
                         </div>
                     )}
                 </button>

                 <button 
                    onClick={handleToggleNotifications}
                    className={`
                        w-9 h-9 rounded-md border backdrop-blur-xl shadow-lg flex items-center justify-center shrink-0 transition-all duration-300 relative z-30
                        ${user?.notificationsEnabled 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]' 
                            : 'bg-[#0b0c10]/90 border-slate-700 text-slate-500 hover:text-white'
                        }
                    `}
                 >
                     {user?.notificationsEnabled ? <Bell size={16} className="fill-white" /> : <BellOff size={16} />}
                 </button>
                 
                 {['ALL', Discipline.SKATE, Discipline.DOWNHILL, 'VERIFIED'].map((f) => {
                     const isActive = activeFilter === f;
                     return (
                         <button 
                            key={f} 
                            onClick={() => { setActiveFilter(f); playSound('click'); triggerHaptic('light'); }}
                            className={`px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all backdrop-blur-md whitespace-nowrap h-9 flex items-center ${
                                isActive 
                                ? 'bg-slate-800 text-white border-slate-600 shadow-inner' 
                                : 'bg-[#080808]/80 border-slate-800 text-slate-500 hover:text-white hover:border-slate-600'
                            }`}
                         >
                             {f}
                         </button>
                     );
                 })}
             </div>
        </div>

        {/* ... Rest of Map Controls ... */}
        <div className={`absolute right-[calc(1rem+env(safe-area-inset-right))] top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-center gap-3 ${layoutMode === 'compact' ? 'top-1/2' : 'top-32'}`}>
             
             {/* Scan/Locate Button */}
             <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping opacity-20 duration-2000" />
                <button 
                    onClick={handleLocate} 
                    className="w-10 h-10 bg-[#0b0c10]/90 backdrop-blur-xl border border-indigo-500/50 text-indigo-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)] relative z-10 active:scale-90 transition-all hover:bg-indigo-500 hover:text-white group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                >
                    <Crosshair size={18} strokeWidth={2.5} />
                </button>
             </div>

             {/* Zoom Controls */}
             <div className="flex flex-col bg-[#0b0c10]/90 backdrop-blur-xl border border-slate-800 rounded-full p-1 shadow-2xl gap-1">
                  <button onClick={handleWorldView} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                      <Globe size={14} />
                  </button>
                  <div className="h-px w-3 bg-white/10 mx-auto" />
                  <button onClick={handleZoomIn} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                      <Plus size={14} />
                  </button>
                  <button onClick={handleZoomOut} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                      <Minus size={14} />
                  </button>
             </div>
             
             <div className="relative group/add">
                 <button onClick={openAddSpot} className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400 active:scale-90 transition-all hover:bg-indigo-500 group">
                    <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                 </button>

                 {/* Sector Scan HUD Alert */}
                 {showScanAlert && (
                    <div className={`absolute right-0 top-full mt-4 z-50 pointer-events-auto origin-top-right ${isExitingScan ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
                        <div className="w-64 bg-[#0b0c10]/95 backdrop-blur-xl border border-emerald-500/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden relative">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                            <div className="p-3 relative z-10">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5 text-emerald-400">
                                        <Radar size={12} className="animate-[spin_4s_linear_infinite]" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Sector Scan</span>
                                    </div>
                                    <button onClick={dismissScanAlert} className="text-emerald-700 hover:text-emerald-400 -mt-1 -mr-1 p-1">
                                        <X size={12} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                                        <span className="text-xl font-black italic">{nearbyScanResults.length}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] font-bold text-white uppercase truncate leading-tight">
                                            {nearbyScanResults.length === 1 ? nearbyScanResults[0].name : 'Signals Detected'}
                                        </div>
                                        <div className="text-[8px] font-mono text-emerald-500/80 uppercase tracking-wide">
                                            {nearbyScanResults.length === 1 ? 'Target Acquired' : 'In Proximity'}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleVisualizeScan}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.2em] py-2.5 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg group"
                                >
                                    <Target size={12} className="group-active:scale-90 transition-transform" /> {nearbyScanResults.length === 1 ? 'ENGAGE' : 'REVEAL'}
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500/30" />
                        </div>
                    </div>
                 )}
             </div>
        </div>

        {revealedLegendIds.size > 0 && (
            <div className="absolute bottom-24 left-4 z-20 pointer-events-auto">
                <div 
                    className={`
                        bg-[#0b0c10]/95 backdrop-blur-md border border-slate-700 shadow-2xl 
                        transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden flex flex-col
                        ${isLegendExpanded ? 'w-48 rounded-lg' : 'w-10 h-10 rounded-md'}
                    `}
                >
                    <button 
                        onClick={toggleLegend} 
                        className={`
                            flex items-center gap-3 w-full transition-all hover:bg-white/5
                            ${isLegendExpanded ? 'p-4 border-b border-slate-700' : 'h-full justify-center'}
                        `}
                    >
                        <div className={`transition-colors ${isLegendExpanded ? 'text-indigo-400' : 'text-slate-400'}`}>
                            <MapIcon size={16} />
                        </div>
                        
                        {isLegendExpanded && (
                            <>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex-1 text-left">
                                    Map Key
                                </span>
                                <ChevronDown size={14} className="text-slate-500" />
                            </>
                        )}
                    </button>

                    <div className={`
                        flex-1 overflow-y-auto transition-all duration-300 hide-scrollbar
                        ${isLegendExpanded ? 'opacity-100 max-h-60 p-4 space-y-3' : 'opacity-0 max-h-0'}
                    `}>
                        {LEGEND_ITEMS.map((item) => {
                            if (!revealedLegendIds.has(item.id)) return null;
                            return (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                                        <div className="relative w-full h-full flex items-center justify-center text-white drop-shadow-md" style={{ color: item.color }}>
                                            <div className="absolute inset-0 w-full h-full" dangerouslySetInnerHTML={{ __html: item.shape }} />
                                            <div className="absolute inset-0 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: item.icon }} />
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest truncate">{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default SpotsView;