
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, AlertTriangle, Camera, FileText, CheckCircle2, Loader2, Navigation, Send } from 'lucide-react';
import { useAppStore } from '../store';
import { triggerHaptic } from '../utils/haptics';
import { playSound } from '../utils/audio';

// Distance helper
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2-lat1) * (Math.PI/180);
  const dLon = (lon2-lon1) * (Math.PI/180); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

const CheckInModal: React.FC = () => {
  const { closeModal, selectedSpot, location, grantXp, updateQuestProgress } = useAppStore();
  const [distance, setDistance] = useState<number | null>(null);
  const [status, setStatus] = useState<'calculating' | 'success' | 'failure' | 'reporting'>('calculating');
  const [reportType, setReportType] = useState<'issue' | 'activity' | 'photo' | null>(null);
  const [reportText, setReportText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedSpot && location) {
      const dist = getDistanceFromLatLonInKm(location.lat, location.lng, selectedSpot.location.lat, selectedSpot.location.lng);
      setDistance(dist);
      
      // 0.1km = 100 meters
      if (dist <= 0.1) {
        setStatus('success');
        playSound('success');
        triggerHaptic('success');
        // Auto-grant basic check-in XP if not already today (mock logic in backend normally handles cooldowns)
        updateQuestProgress('CHECK_IN', 1);
      } else {
        setStatus('failure');
        playSound('error');
        triggerHaptic('error');
      }
    } else {
        // No location signal
        setStatus('failure');
    }
  }, [selectedSpot, location]);

  const handleReportSubmit = async () => {
      setIsSubmitting(true);
      triggerHaptic('medium');
      // Simulate backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (reportType === 'photo') {
          await grantXp(20, 'Photo Intel');
      } else {
          await grantXp(10, 'Status Report');
      }
      
      setIsSubmitting(false);
      setReportType(null);
      setReportText('');
      alert("Report transmitted to network.");
      closeModal();
  };

  if (!selectedSpot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-view" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-sm bg-[#080a0f] border-[4px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden font-mono ring-1 ring-black/50">
            
            {/* Screws */}
            <div className="absolute top-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
            <div className="absolute top-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
            <div className="absolute bottom-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>

            {/* Header */}
            <div className="bg-[#080a0f] border-b-2 border-[#1e293b] p-6 pt-8 relative z-10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-[0.85] font-sans drop-shadow-md">Signal<br/>Verify</h2>
                        <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {selectedSpot.name}
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

            <div className="relative z-10 space-y-6 p-6 bg-[#080a0f]">
                
                {status === 'calculating' && (
                    <div className="flex flex-col items-center py-8 gap-4">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 animate-pulse">Triangulating...</span>
                    </div>
                )}

                {status === 'failure' && (
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center animate-pulse">
                            <Navigation size={32} className="text-red-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black italic text-white uppercase font-sans">Out of Range</h3>
                            <p className="text-xs font-medium text-red-400 mt-1">
                                Distance: {distance ? distance.toFixed(2) : '?'} KM
                            </p>
                        </div>
                        <div className="bg-[#0f1218] border border-[#1e293b] p-4 rounded-xl text-[10px] text-slate-400 font-mono leading-relaxed w-full">
                            PROTOCOL ERROR: You are too far from the coordinates. Move within 100m to check in.
                        </div>
                        <button 
                            onClick={() => { closeModal(); window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedSpot.location.lat},${selectedSpot.location.lng}`, '_blank'); }}
                            className="w-full py-4 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white"
                        >
                            <Navigation size={14} /> Navigate to Spot
                        </button>
                    </div>
                )}

                {status === 'success' && !reportType && (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-emerald-500" />
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-black italic text-white uppercase font-sans">Checked In</h3>
                            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mt-1 bg-emerald-900/30 px-2 py-1 rounded inline-block border border-emerald-500/20">
                                +50 XP Earned
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setReportType('activity')}
                                className="bg-[#0f1218] border border-[#1e293b] p-4 rounded-xl flex flex-col items-center gap-2 hover:border-slate-500 active:scale-95 transition-all"
                            >
                                <FileText size={18} className="text-indigo-400" />
                                <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Report Activity</span>
                            </button>
                            <button 
                                onClick={() => setReportType('issue')}
                                className="bg-[#0f1218] border border-[#1e293b] p-4 rounded-xl flex flex-col items-center gap-2 hover:border-slate-500 active:scale-95 transition-all"
                            >
                                <AlertTriangle size={18} className="text-amber-400" />
                                <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Report Issue</span>
                            </button>
                            <button 
                                onClick={() => setReportType('photo')}
                                className="col-span-2 bg-[#0f1218] border border-[#1e293b] p-4 rounded-xl flex items-center justify-center gap-3 hover:border-slate-500 active:scale-95 transition-all"
                            >
                                <Camera size={18} className="text-emerald-400" />
                                <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Upload Intel Photo</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Reporting Sub-Screens */}
                {reportType && (
                    <div className="space-y-4 animate-pop">
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => setReportType(null)} className="text-slate-500 hover:text-white p-1"><X size={14} /></button>
                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">
                                {reportType === 'issue' ? 'Hazard Report' : reportType === 'photo' ? 'Visual Data' : 'Activity Log'}
                            </span>
                        </div>

                        {reportType === 'photo' ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-video w-full rounded-2xl border-2 border-dashed border-[#334155] flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all cursor-pointer bg-[#0f1218]"
                            >
                                <Camera size={24} />
                                <span className="text-[8px] font-bold uppercase tracking-widest">Tap to Capture</span>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                            </div>
                        ) : (
                            <textarea 
                                value={reportText}
                                onChange={e => setReportText(e.target.value)}
                                placeholder={reportType === 'issue' ? "Describe hazard (e.g. cracked pavement, security)..." : "Describe session vibe..."}
                                className="w-full h-32 bg-[#0f1218] border border-[#1e293b] rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none font-mono"
                            />
                        )}

                        <button 
                            onClick={handleReportSubmit}
                            disabled={isSubmitting || (reportType !== 'photo' && !reportText.trim())}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-500"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                            Submit Report
                        </button>
                    </div>
                )}

            </div>
        </div>
    </div>,
    document.body
  );
};

export default CheckInModal;
