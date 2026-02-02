
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Swords, CheckCircle2, Loader2, AlignLeft, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store';
import { triggerHaptic } from '../utils/haptics';
import { Difficulty } from '../types';

const CreateChallengeModal: React.FC = () => {
  const { closeModal, createChallenge, selectedSpot } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
      title: '',
      description: '',
      difficulty: Difficulty.INTERMEDIATE
  });

  const handleSubmit = async () => {
      if (!form.title || !selectedSpot) return;
      setIsLoading(true);
      triggerHaptic('medium');
      
      try {
          await createChallenge({
              title: form.title,
              description: form.description,
              difficulty: form.difficulty,
              spotId: selectedSpot.id,
              spotName: selectedSpot.name,
              xpReward: form.difficulty === Difficulty.PRO ? 1000 : form.difficulty === Difficulty.ADVANCED ? 600 : 300
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
                        <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-[0.85] font-sans drop-shadow-md">Post<br/>Bounty</h2>
                        <p className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                            <Swords size={10} /> {selectedSpot.name}
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
                        Challenge Title
                    </label>
                    <input 
                        type="text"
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                        className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-4 text-sm font-bold text-white focus:outline-none focus:border-red-500 uppercase placeholder:text-slate-700 tracking-wider font-mono transition-colors"
                        placeholder="E.G. KICKFLIP THE GAP"
                    />
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                        <BarChart3 size={10} /> Difficulty
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {[Difficulty.INTERMEDIATE, Difficulty.ADVANCED, Difficulty.PRO].map(d => (
                            <button
                                key={d}
                                onClick={() => setForm({...form, difficulty: d})}
                                className={`py-3 rounded-lg text-[7px] font-black uppercase tracking-widest border transition-all ${
                                    form.difficulty === d 
                                    ? 'bg-red-600 text-white border-red-500 shadow-lg' 
                                    : 'bg-[#0f1218] text-slate-500 border-[#1e293b] hover:border-slate-500'
                                }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1 group-focus-within:text-white transition-colors">
                        <AlignLeft size={10} /> Conditions
                    </label>
                    <textarea 
                        rows={3}
                        value={form.description}
                        onChange={e => setForm({...form, description: e.target.value})}
                        className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-red-500 resize-none placeholder:text-slate-700 transition-colors font-mono"
                        placeholder="Must land clean. No toe drag."
                    />
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={!form.title || isLoading}
                    className="w-full py-4 bg-red-600 text-white border border-red-500 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-[#1e293b] disabled:border-[#334155] disabled:cursor-not-allowed group mt-2 hover:bg-red-500"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    {isLoading ? 'POSTING...' : 'ACTIVATE BOUNTY'}
                </button>
            </div>
        </div>
    </div>,
    document.body
  );
};

export default CreateChallengeModal;
