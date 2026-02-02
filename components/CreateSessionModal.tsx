
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, MapPin, CheckCircle2, Loader2, Target } from 'lucide-react';
import { useAppStore } from '../store';
import { triggerHaptic } from '../utils/haptics';

const CreateSessionModal: React.FC = () => {
  const { closeModal, createSession, selectedSpot } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '16:00',
      intent: 'Chill'
  });

  const handleSubmit = async () => {
      if (!form.title || !selectedSpot) return;
      setIsLoading(true);
      triggerHaptic('medium');
      
      try {
          await createSession({
              title: form.title,
              date: form.date,
              time: form.time,
              intent: form.intent,
              spotId: selectedSpot.id,
              spotName: selectedSpot.name,
              spotType: selectedSpot.type
          });
          triggerHaptic('success');
          closeModal();
      } catch (e) {
          triggerHaptic('error');
      } finally {
          setIsLoading(false);
      }
  };

  if (!selectedSpot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-view" onClick={(e) => e.stopPropagation()}>
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
                        <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-[0.85] font-sans drop-shadow-md">Init<br/>Session</h2>
                        <p className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                            <MapPin size={10} /> {selectedSpot.name}
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

            <div className="space-y-5 relative z-10 p-6 bg-[#080a0f]">
                {/* Title */}
                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1 group-focus-within:text-white transition-colors">
                        Operation Title
                    </label>
                    <input 
                        type="text"
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 uppercase placeholder:text-slate-700 tracking-wider font-mono transition-colors"
                        placeholder="E.G. SUNDAY SHRED"
                    />
                </div>

                {/* Timing */}
                <div className="flex gap-4">
                    <div className="space-y-2 flex-1">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                            <Calendar size={10} /> Date
                        </label>
                        <input 
                            type="date"
                            value={form.date}
                            onChange={e => setForm({...form, date: e.target.value})}
                            className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 uppercase tracking-widest"
                        />
                    </div>
                    <div className="space-y-2 flex-1">
                        <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                            <Clock size={10} /> Time
                        </label>
                        <input 
                            type="time"
                            value={form.time}
                            onChange={e => setForm({...form, time: e.target.value})}
                            className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 uppercase tracking-widest"
                        />
                    </div>
                </div>

                {/* Intent */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                        <Target size={10} /> Objective
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Chill', 'Training', 'Filming'].map(intent => (
                            <button
                                key={intent}
                                onClick={() => setForm({...form, intent})}
                                className={`py-3 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${
                                    form.intent === intent 
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg' 
                                    : 'bg-[#0f1218] text-slate-500 border-[#1e293b] hover:border-slate-500'
                                }`}
                            >
                                {intent}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={!form.title || isLoading}
                    className="w-full py-4 bg-indigo-600 text-white border border-indigo-500 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none relative overflow-hidden group mt-2 hover:bg-indigo-500"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    {isLoading ? 'BROADCASTING...' : 'LAUNCH SESSION'}
                </button>
            </div>
        </div>
    </div>,
    document.body
  );
};

export default CreateSessionModal;
