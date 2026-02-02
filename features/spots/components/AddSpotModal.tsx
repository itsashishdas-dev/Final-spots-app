
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, CheckCircle2, Loader2, Camera, LocateFixed, Eye, EyeOff, Users, Video, ChevronDown, Crosshair, UploadCloud } from 'lucide-react';
import { Discipline, Difficulty, SpotPrivacy } from '../../../types';
import { useSpotsActions } from '../hooks/useSpots';
import { useAppStore } from '../../../store'; // Still needed for closeModal and user until auth feature is refactored
import { triggerHaptic } from '../../../utils/haptics';
import { playSound } from '../../../utils/audio';

const AddSpotModal: React.FC = () => {
  const { closeModal, user } = useAppStore();
  const { addSpot } = useSpotsActions();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
      name: '',
      type: Discipline.SKATE,
      difficulty: Difficulty.BEGINNER,
      description: '',
      privacy: SpotPrivacy.PUBLIC
  });

  const handleAcquireGPS = () => {
      setIsLocating(true);
      setGpsError(null);
      triggerHaptic('medium');
      playSound('radar_scan');

      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  setCoords({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                  });
                  setIsLocating(false);
                  triggerHaptic('success');
                  playSound('radar_complete');
              },
              (err) => {
                  console.error(err);
                  setGpsError("SIGNAL LOST");
                  setIsLocating(false);
                  triggerHaptic('error');
                  playSound('error');
              },
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
      } else {
          setGpsError("GPS HARDWARE MISSING");
          setIsLocating(false);
      }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const newFiles = Array.from(e.target.files).slice(0, 3 - images.length);
          setImages([...images, ...newFiles]);
          triggerHaptic('light');
      }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setVideo(e.target.files[0]);
          triggerHaptic('light');
      }
  };

  const handleSubmit = async () => {
      if (!form.name || !coords || images.length === 0 || !video) return;
      setIsLoading(true);
      triggerHaptic('medium');
      playSound('data_stream');
      
      // Simulate fast upload progress
      const totalSteps = 20;
      for (let i = 0; i <= totalSteps; i++) {
          setProgress((i / totalSteps) * 100);
          await new Promise(r => setTimeout(r, 50)); // Total ~1s visual delay
      }
      
      try {
          const mockImageUrls = images.map(() => `https://picsum.photos/seed/${Date.now()}/400/400`);
          const mockVideoUrl = "https://example.com/spot-clip.mp4";

          await addSpot({
              name: form.name,
              type: form.type,
              difficulty: form.difficulty,
              notes: form.description,
              privacy: form.privacy,
              images: mockImageUrls,
              videoUrl: mockVideoUrl,
              location: { 
                  lat: coords.lat, 
                  lng: coords.lng, 
                  address: 'Unknown Sector' 
              },
              ownerId: user?.id
          });
          triggerHaptic('success');
          playSound('success');
          closeModal();
      } catch (e) {
          triggerHaptic('error');
      } finally {
          setIsLoading(false);
      }
  };

  const isFormValid = form.name && coords && images.length > 0 && video && !isLoading;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-view" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-sm bg-[#080a0f] border-[4px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh] ring-1 ring-black/50">
            
            {/* Header */}
            <div className="bg-[#080a0f] border-b-2 border-[#1e293b] p-6 pt-8 relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-[0.85] font-sans drop-shadow-md">Drop<br/>Signal</h2>
                        <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                            <MapPin size={10} /> Mark New Territory
                        </p>
                    </div>
                    <button 
                        onClick={closeModal} 
                        className="w-10 h-10 bg-[#1e293b] border border-[#334155] rounded-xl flex items-center justify-center text-slate-400 hover:text-white active:scale-90 transition-all shadow-md"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 relative z-10 p-6 bg-[#080a0f]">
                
                {/* GPS Module */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                        <Crosshair size={10} className="text-indigo-500" /> Target Coordinates <span className="text-red-500">*</span>
                    </label>
                    
                    <button 
                        onClick={handleAcquireGPS}
                        disabled={isLocating || !!coords}
                        className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden ${
                            coords 
                            ? 'border-emerald-500/50 bg-emerald-900/10' 
                            : gpsError 
                                ? 'border-red-500/50 bg-red-900/10' 
                                : 'border-indigo-500/30 bg-[#0f1218] hover:bg-indigo-900/10'
                        }`}
                    >
                        {coords ? (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <LocateFixed size={80} />
                                </div>
                                <CheckCircle2 size={24} className="text-emerald-400 mb-1" />
                                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Signal Locked</span>
                                <span className="text-[8px] font-mono text-emerald-600">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                            </>
                        ) : isLocating ? (
                            <>
                                <Loader2 size={24} className="animate-spin text-indigo-400" />
                                <span className="text-[9px] font-black text-indigo-300 animate-pulse uppercase tracking-widest">Triangulating...</span>
                            </>
                        ) : (
                            <>
                                <LocateFixed size={24} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acquire GPS Lock</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Spot Name */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                        <MapPin size={10} className="text-indigo-500" /> Spot Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full bg-[#0f1218] border border-[#1e293b] rounded-lg p-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 uppercase placeholder:text-slate-700 tracking-wider font-mono transition-colors"
                        placeholder="ENTER DESTINATION"
                    />
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Discipline</label>
                        <div className="relative">
                            <select 
                                value={form.type}
                                onChange={e => setForm({...form, type: e.target.value as Discipline})}
                                className="w-full bg-[#0f1218] border border-[#1e293b] rounded-lg p-3 text-[10px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value={Discipline.SKATE}>Skate</option>
                                <option value={Discipline.DOWNHILL}>Downhill</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Threat Level</label>
                        <div className="relative">
                            <select 
                                value={form.difficulty}
                                onChange={e => setForm({...form, difficulty: e.target.value as Difficulty})}
                                className="w-full bg-[#0f1218] border border-[#1e293b] rounded-lg p-3 text-[10px] font-black text-white uppercase focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value={Difficulty.BEGINNER}>Beginner</option>
                                <option value={Difficulty.INTERMEDIATE}>Intermediate</option>
                                <option value={Difficulty.ADVANCED}>Advanced</option>
                                <option value={Difficulty.PRO}>Pro</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Media Intel */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                        Visual Intel <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => imageInputRef.current?.click()}
                            className={`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-all group ${images.length > 0 ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-[#334155] bg-[#0f1218] hover:border-indigo-500/50'}`}
                        >
                            <Camera size={20} className={images.length > 0 ? "text-emerald-400" : "text-slate-500 group-hover:text-indigo-400"} /> 
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">
                                {images.length > 0 ? `${images.length} Photos` : 'Add Photos'}
                            </span>
                        </button>
                        <input type="file" multiple accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageChange} />

                        <button 
                            onClick={() => videoInputRef.current?.click()}
                            className={`h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-all group ${video ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-[#334155] bg-[#0f1218] hover:border-indigo-500/50'}`}
                        >
                            <Video size={20} className={video ? "text-emerald-400" : "text-slate-500 group-hover:text-indigo-400"} /> 
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">
                                {video ? 'Clip Ready' : 'Recon Clip'}
                            </span>
                        </button>
                        <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={handleVideoChange} />
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`w-full h-14 bg-indigo-600 text-white border border-indigo-500 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-[#1e293b] disabled:border-[#334155] disabled:cursor-not-allowed hover:bg-indigo-500 mt-4 relative overflow-hidden`}
                >
                    {isLoading ? (
                        <>
                            <div className="absolute inset-y-0 left-0 bg-indigo-800/50 transition-all duration-75 ease-linear" style={{ width: `${progress}%` }} />
                            <span className="relative z-10 flex items-center gap-2">
                                <UploadCloud size={14} className="animate-bounce" /> UPLOADING...
                            </span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={14} />
                            CONFIRM DROP
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>,
    document.body
  );
};

export default AddSpotModal;
