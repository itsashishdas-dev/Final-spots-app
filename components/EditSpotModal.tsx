
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, CheckCircle2, Loader2, MapPin, AlertTriangle, Globe, MousePointer2, Move, ArrowRight, Target } from 'lucide-react';
import { Spot, Discipline, Difficulty } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { useAppStore } from '../store';

interface EditSpotModalProps {
  spot: Spot;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Spot>) => Promise<void>;
}

const EditSpotModal: React.FC<EditSpotModalProps> = ({ spot, onClose, onSave }) => {
  const { isPinDropActive, setPinDropActive, tempLocation, setTempLocation } = useAppStore();
  
  const [form, setForm] = useState({
    name: spot.name,
    type: spot.type,
    difficulty: spot.difficulty,
  });

  const [latInput, setLatInput] = useState((tempLocation?.lat ?? spot.location.lat).toString());
  const [lngInput, setLngInput] = useState((tempLocation?.lng ?? spot.location.lng).toString());
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (tempLocation) {
        setLatInput(tempLocation.lat.toString());
        setLngInput(tempLocation.lng.toString());
    }
  }, [tempLocation]);

  const errors = useMemo(() => {
    const errs: string[] = [];
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || lat < -90 || lat > 90) errs.push("Latitude must be -90 to 90");
    if (isNaN(lng) || lng < -180 || lng > 180) errs.push("Longitude must be -180 to 180");
    return errs;
  }, [latInput, lngInput]);

  const hasChanges = useMemo(() => {
    const latChanged = Math.abs(parseFloat(latInput) - spot.location.lat) > 0.00001;
    const lngChanged = Math.abs(parseFloat(lngInput) - spot.location.lng) > 0.00001;
    const nameChanged = form.name !== spot.name;
    const typeChanged = form.type !== spot.type;
    const diffChanged = form.difficulty !== spot.difficulty;
    return latChanged || lngChanged || nameChanged || typeChanged || diffChanged;
  }, [latInput, lngInput, form, spot]);

  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latInput},${lngInput}`;

  const handleSaveClick = () => {
      if (errors.length > 0) return;
      triggerHaptic('medium');
      setIsConfirming(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    triggerHaptic('heavy');
    try {
      const updates = {
          ...form,
          location: {
              ...spot.location,
              lat: parseFloat(latInput),
              lng: parseFloat(lngInput)
          }
      };
      await onSave(spot.id, updates);
      triggerHaptic('success');
      setTempLocation(null);
      onClose();
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
      setIsConfirming(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePinDropToggle = () => {
      triggerHaptic('medium');
      setPinDropActive(true);
  };

  if (!document.body) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-view" onClick={onClose}>
      <div className="w-full max-w-sm bg-[#080a0f] border-2 border-indigo-500 rounded-2xl shadow-2xl relative flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-[#0f1218] border-b border-indigo-500/30 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Edit Intel</h2>
            <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
               <MapPin size={10} /> {spot.name}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        {!isConfirming ? (
            <div className="p-6 space-y-5">
                <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Spot Name</label>
                    <input 
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full bg-[#050505] border border-slate-700 rounded-lg p-3 text-sm font-bold text-white focus:border-indigo-500 outline-none uppercase font-mono"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Type</label>
                        <select 
                            value={form.type}
                            onChange={e => setForm({...form, type: e.target.value as Discipline})}
                            className="w-full bg-[#050505] border border-slate-700 rounded-lg p-3 text-xs font-bold text-white focus:border-indigo-500 outline-none uppercase appearance-none"
                        >
                            <option value={Discipline.SKATE}>Skate</option>
                            <option value={Discipline.DOWNHILL}>Downhill</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Difficulty</label>
                        <select 
                            value={form.difficulty}
                            onChange={e => setForm({...form, difficulty: e.target.value as Difficulty})}
                            className="w-full bg-[#050505] border border-slate-700 rounded-lg p-3 text-xs font-bold text-white focus:border-indigo-500 outline-none uppercase appearance-none"
                        >
                            <option value={Difficulty.BEGINNER}>Beginner</option>
                            <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                            <option value={Difficulty.ADVANCED}>Advanced</option>
                            <option value={Difficulty.PRO}>Pro</option>
                        </select>
                    </div>
                </div>

                {/* LOCATION EDITING SECTION - IMPROVED BUTTON */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
                            <Move size={10} className="text-indigo-400" /> Precise Location
                        </label>
                    </div>

                    <button 
                        onClick={handlePinDropToggle}
                        className="w-full py-4 bg-[#5e5ce6] text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-indigo-400 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <Target size={16} className="animate-pulse" /> 
                        <span>Activate Pin Drop</span>
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[8px] font-mono text-slate-600 uppercase ml-1">Latitude</label>
                            <input 
                                value={latInput}
                                onChange={e => setLatInput(e.target.value)}
                                className={`w-full bg-[#050505] border rounded-lg p-2.5 text-xs font-mono text-white focus:border-indigo-500 outline-none ${parseFloat(latInput) !== spot.location.lat ? 'border-amber-500/50' : 'border-slate-700'}`}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[8px] font-mono text-slate-600 uppercase ml-1">Longitude</label>
                            <input 
                                value={lngInput}
                                onChange={e => setLngInput(e.target.value)}
                                className={`w-full bg-[#050505] border rounded-lg p-2.5 text-xs font-mono text-white focus:border-indigo-500 outline-none ${parseFloat(lngInput) !== spot.location.lng ? 'border-amber-500/50' : 'border-slate-700'}`}
                            />
                        </div>
                    </div>

                    {/* DIFF & PREVIEW */}
                    <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-3 space-y-3">
                        {errors.length > 0 ? (
                            <div className="flex items-start gap-2 text-red-400">
                                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                                <p className="text-[8px] font-mono leading-tight">{errors[0]}</p>
                            </div>
                        ) : hasChanges ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between opacity-50">
                                    <span className="text-[7px] font-mono text-slate-500 uppercase">Original Coords</span>
                                    <span className="text-[8px] font-mono text-slate-400">{spot.location.lat.toFixed(5)}, {spot.location.lng.toFixed(5)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[7px] font-mono text-amber-500 uppercase flex items-center gap-1">New Coords <ArrowRight size={8} /></span>
                                    <span className="text-[8px] font-mono text-white font-bold">{parseFloat(latInput).toFixed(5)}, {parseFloat(lngInput).toFixed(5)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[8px] font-mono text-slate-600 text-center">Coordinates match official database.</p>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handleSaveClick}
                    disabled={!hasChanges || errors.length > 0}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Save size={14} />
                    Commit Edits
                </button>
            </div>
        ) : (
            <div className="p-6 space-y-6 text-center animate-view">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-indigo-900/30 rounded-full flex items-center justify-center border-2 border-indigo-500 text-indigo-400">
                        <AlertTriangle size={32} />
                    </div>
                </div>
                
                <div>
                    <h3 className="text-lg font-black uppercase text-white tracking-tight mb-2">Apply Updates?</h3>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        This will modify the official database coordinates for <span className="text-white font-bold italic">{spot.name}</span>. Your moderator ID will be logged for this edit.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setIsConfirming(false)}
                        disabled={isSaving}
                        className="py-3 bg-slate-900 border border-slate-700 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[9px] hover:text-white"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleConfirmSave}
                        disabled={isSaving}
                        className="py-3 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
                    >
                        {isSaving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                        {isSaving ? 'Saving...' : 'Yes, Commit'}
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default EditSpotModal;
