
import React from 'react';
import { useSpotsView } from '../features/spots/hooks/useSpotsView';
import MapLayer from '../components/MapLayer';
import { LocateFixed, Scan, X, Target, Search, Grid, Sun, Globe, Edit3, RotateCcw, Plus, Minus, Map as MapIcon, MousePointer2 } from 'lucide-react';
import { Discipline } from '../types';
import EditSpotModal from '../components/EditSpotModal';

const SpotsView: React.FC = () => {
  const {
    // Data
    user,
    userLocation,
    visibleSpots,
    selectedSpot,
    lastEdit,
    
    // State
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
    handleLocate,
    handleVisualizeScan,
    handleZoom,
    handleUndo,
    updateSpot,
    dismissScanAlert,
    setView,
    triggerHaptic
  } = useSpotsView();

  return (
    <div className="h-full w-full relative bg-black font-mono animate-view">
        <MapLayer 
            onMapReady={setMapInstance} 
            spots={visibleSpots} 
            isEditMode={isEditMode}
        />
        
        {/* IMPROVED PIN DROP UI OVERLAY */}
        {isPinDropActive && (
            <div className="absolute inset-0 z-[600] pointer-events-none flex flex-col items-center justify-center">
                {/* Crosshair Simulation */}
                <div className="relative w-16 h-16 border-2 border-indigo-500/50 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
                    <div className="absolute w-8 h-px bg-indigo-500/50" />
                    <div className="absolute h-8 w-px bg-indigo-500/50" />
                </div>
                
                {/* Overlay Action Pill */}
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto w-full px-8 max-w-sm">
                    <div className="w-full bg-[#5e5ce6] backdrop-blur-xl px-6 py-5 rounded-[2rem] border-2 border-indigo-400 shadow-[0_0_50px_rgba(94,92,230,0.4)] flex items-center justify-between animate-pop group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                                <MousePointer2 size={24} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black uppercase text-white tracking-widest leading-none">Capture Mode</span>
                                <span className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest mt-1 opacity-80">Tap Map to Drop Pin</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => { triggerHaptic('light'); setPinDropActive(false); }}
                            className="w-10 h-10 bg-black/30 hover:bg-black/50 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        )}
        
        {/* --- HEADER & FILTERS --- */}
        <div className={`absolute top-safe-top left-0 right-0 p-4 z-[400] pointer-events-none flex flex-col gap-3 transition-opacity ${isPinDropActive ? 'opacity-20' : 'opacity-100'}`}>
             <div className="flex gap-3 pointer-events-auto items-center">
                 <button 
                    onClick={() => { triggerHaptic('light'); setView('PROFILE'); }}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 shadow-lg active:scale-95 transition-transform"
                 >
                     <img src={user?.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Guest'} className="w-full h-full object-cover" />
                 </button>

                 <div className="flex-1 bg-black/80 backdrop-blur-md border border-slate-700 rounded-xl flex items-center px-3 h-10 shadow-lg focus-within:border-indigo-500 transition-colors">
                    <Search size={14} className="text-slate-500 mr-2 shrink-0" />
                    <input 
                        className="bg-transparent border-none outline-none text-white text-[10px] font-bold uppercase tracking-wider w-full placeholder:text-slate-600"
                        placeholder="SEARCH DATABASE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && <button onClick={() => setSearchQuery('')}><X size={12} className="text-slate-500" /></button>}
                 </div>

                 {isModerator && (
                     <button 
                        onClick={() => { setIsEditMode(!isEditMode); triggerHaptic('medium'); }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all border ${isEditMode ? 'bg-[#5e5ce6] text-white border-indigo-400 animate-pulse' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                     >
                        <Edit3 size={18} />
                     </button>
                 )}

                 <button 
                    onClick={() => { triggerHaptic('medium'); setView('LIST'); }}
                    className="w-10 h-10 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 shadow-lg hover:text-white active:scale-95 transition-all"
                 >
                    <Grid size={18} />
                 </button>
             </div>

             <div className="flex gap-2 pointer-events-auto overflow-x-auto hide-scrollbar pb-1">
                 <div className="h-8 px-2.5 bg-amber-900/40 border border-amber-500/30 rounded-lg flex items-center justify-center text-amber-500 shrink-0 backdrop-blur-sm gap-1.5">
                    <Sun size={12} /> <span className="text-[9px] font-black">28°C</span>
                 </div>
                 {['ALL', Discipline.SKATE, Discipline.DOWNHILL, 'VERIFIED'].map(f => (
                     <button 
                        key={f}
                        onClick={() => { triggerHaptic('light'); setActiveFilter(f); }}
                        className={`h-8 px-3 rounded-lg border text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all shadow-md ${
                            activeFilter === f 
                            ? 'bg-white text-black border-white' 
                            : 'bg-black/60 text-slate-400 border-slate-700 backdrop-blur-md hover:bg-black/80'
                        }`}
                     >
                        {f}
                     </button>
                 ))}
             </div>
        </div>

        {/* --- MODERATOR UNDO TOAST --- */}
        {isModerator && lastEdit && !isPinDropActive && (
            <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[450] pointer-events-auto animate-pop">
                <button 
                    onClick={handleUndo}
                    className="bg-[#0b0c10] border-2 border-indigo-500/50 text-white pl-3 pr-4 py-2 rounded-full shadow-2xl flex items-center gap-2 hover:bg-indigo-900/20 active:scale-95 transition-all group"
                >
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <RotateCcw size={12} />
                    </div>
                    <div className="text-left">
                        <div className="text-[9px] font-black uppercase tracking-widest text-indigo-300">Edit Saved</div>
                        <div className="text-[8px] font-bold text-slate-400">Tap to Undo</div>
                    </div>
                </button>
            </div>
        )}

        {/* --- RIGHT SIDE CONTROLS --- */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[400] pointer-events-auto transition-opacity ${isPinDropActive ? 'opacity-20' : 'opacity-100'}`}>
             <button 
                onClick={handleLocate}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] border-4 border-indigo-500 active:scale-90 transition-transform relative group"
             >
                 <div className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-50" />
                 <LocateFixed size={20} />
             </button>

             <div className="bg-black/80 backdrop-blur-md border border-slate-700 rounded-full flex flex-col items-center p-1 gap-1 shadow-xl">
                 <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors" onClick={() => handleZoom(1)}>
                     <Plus size={18} />
                 </button>
                 <div className="w-4 h-px bg-slate-700" />
                 <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors" onClick={() => handleZoom(-1)}>
                     <Minus size={18} />
                 </button>
             </div>

             <button className="w-10 h-10 bg-black/80 backdrop-blur-md border border-slate-700 rounded-full flex items-center justify-center text-slate-400 shadow-xl active:scale-95 transition-transform">
                 <Globe size={18} />
             </button>
        </div>

        {/* --- BOTTOM LEFT LEGEND TOGGLE --- */}
        <div className={`absolute bottom-24 left-4 z-[400] pointer-events-auto flex flex-col gap-2 items-start transition-opacity ${isPinDropActive ? 'opacity-20' : 'opacity-100'}`}>
            {showLegend && (
                <div className="bg-black/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 animate-pop shadow-2xl mb-2 min-w-[120px]">
                    <h4 className="text-[9px] font-black uppercase text-slate-500 mb-2 tracking-widest">Map Legend</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_5px_#6366f1]" />
                            <span className="text-[9px] font-bold text-white uppercase">Street</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_5px_#a855f7]" />
                            <span className="text-[9px] font-bold text-white uppercase">Downhill</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_#f59e0b]" />
                            <span className="text-[9px] font-bold text-white uppercase">Skatepark</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                            <span className="text-[9px] font-bold text-white uppercase">DIY Spot</span>
                        </div>
                    </div>
                </div>
            )}
            <button 
                onClick={() => { triggerHaptic('light'); setShowLegend(!showLegend); }}
                className={`w-10 h-10 backdrop-blur-md border rounded-xl flex items-center justify-center transition-all shadow-lg ${showLegend ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-black/80 border-slate-700 text-slate-400'}`}
            >
                <MapIcon size={18} />
            </button>
        </div>

        {/* MODERATOR EDIT MODAL */}
        {showEditModal && selectedSpot && !isPinDropActive && (
            <EditSpotModal 
                spot={selectedSpot} 
                onClose={() => setShowEditModal(false)}
                onSave={updateSpot}
            />
        )}
    </div>
  );
};

export default SpotsView;
