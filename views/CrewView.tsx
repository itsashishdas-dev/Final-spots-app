
import React from 'react';
import { 
  Users, Shield, Target, MapPin, ChevronLeft, 
  Crown, Plus, Settings, Search, Loader2, LogOut, Check,
  Hexagon, MessageSquare, X, User as UserIcon, Activity
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { useCrew } from '../features/crew';

interface CrewViewProps {
  onBack: () => void;
}

const CrewView: React.FC<CrewViewProps> = ({ onBack }) => {
  const {
    user,
    spots,
    crews,
    activeCrew,
    isLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    requestingCrewId,
    showSettings,
    setShowSettings,
    formData,
    setFormData,
    handleCreateCrew,
    handleRequestJoin,
    handleReviewRequest,
    handleLeaveCrew,
    handleOpenChat,
    CREW_AVATARS
  } = useCrew();

  if (isLoading) return <div className="h-full bg-black flex items-center justify-center"><div className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing Unit Data...</div></div>;

  // --- BROWSE / JOIN MODE ---
  if ((!user?.crewId || !activeCrew) && viewMode === 'browse') {
      const filtered = crews.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.city.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        <div className="h-full flex flex-col bg-[#020202] animate-view pt-safe-top overflow-hidden font-mono relative">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
                style={{ 
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
                backgroundSize: '30px 30px' 
                }}>
            </div>

            {/* Header */}
            <div className="px-6 pt-6 pb-2 shrink-0 relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter leading-[0.8] mb-2 font-sans">Global<br/>Units</h1>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] flex items-center gap-2">
                            <Activity size={10} className="text-indigo-500 animate-pulse" /> Find Squad or Go Rogue
                        </p>
                    </div>
                </div>

                {/* Initialize Unit Button */}
                <button 
                    onClick={() => { triggerHaptic('medium'); setViewMode('create'); }}
                    className="w-full bg-indigo-600 text-white rounded-xl py-4 mb-6 text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-indigo-500 border border-indigo-400 group"
                >
                    <Plus size={14} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> 
                    Initialize Unit
                </button>

                {/* Search */}
                <div className="relative mb-6 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search size={14} className="text-slate-600 group-focus-within:text-indigo-400 transition-colors" /></div>
                    <input 
                        type="text" 
                        placeholder="SEARCH DATABASE" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-[#080a0f] border border-[#1e293b] rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 uppercase tracking-widest transition-colors font-mono"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 hide-scrollbar space-y-4 relative z-10">
                {filtered.map(c => {
                    const isFull = c.members.length >= (c.maxMembers || 10);
                    const isRequested = user && c.requests && c.requests.includes(user.id);
                    const isProcessing = requestingCrewId === c.id;
                    
                    return (
                        <div key={c.id} className="bg-[#080a0f] border border-[#1e293b] rounded-[1.5rem] p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors shadow-lg">
                            {/* Screws */}
                            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-[#334155] rounded-full" />
                            <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#334155] rounded-full" />
                            <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-[#334155] rounded-full" />
                            <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-[#334155] rounded-full" />

                            <div className="flex justify-between items-start mb-4 pl-2">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none mb-1 font-sans">{c.name}</h3>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                        <span>{c.city}</span>
                                        <span className="text-slate-700">|</span>
                                        <span>Lvl {c.level}</span>
                                    </div>
                                </div>
                                <div className={`px-2 py-1.5 rounded-lg border backdrop-blur-md flex flex-col items-center ${isFull ? 'bg-red-950/20 border-red-500/20' : 'bg-emerald-950/20 border-emerald-500/20'}`}>
                                    <Users size={12} className={isFull ? 'text-red-400' : 'text-emerald-400'} />
                                    <span className={`text-[8px] font-bold font-mono mt-0.5 ${isFull ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {c.members.length}/{c.maxMembers || 10}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Motto Box */}
                            <div className="bg-[#0f1218] border border-[#1e293b] rounded-lg p-3 mb-4 mx-1 relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800" />
                                <p className="text-[10px] text-slate-300 font-mono italic pl-2">"{c.moto}"</p>
                            </div>

                            <button 
                                onClick={() => !isFull && !isRequested && !isProcessing && handleRequestJoin(c.id)}
                                disabled={isFull || isRequested || isProcessing}
                                className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                                    isRequested
                                    ? 'bg-[#1e293b] text-indigo-400 border border-indigo-500/30 cursor-default'
                                    : isFull 
                                        ? 'bg-[#1e293b] text-slate-600 cursor-not-allowed border border-[#334155]' 
                                        : 'bg-white text-black hover:bg-slate-200 disabled:opacity-70 disabled:cursor-wait'
                                }`}
                            >
                                {isProcessing ? <Loader2 className="animate-spin" size={12} /> : null}
                                {isProcessing ? 'UPLINKING...' : isRequested ? 'REQUEST PENDING' : isFull ? 'UNIT FULL' : 'REQUEST ACCESS'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
      );
  }

  // --- CREATE MODE ---
  if (!activeCrew && viewMode === 'create') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-[#020202]/90 backdrop-blur-sm p-4 animate-view pt-safe-top font-mono relative z-50">
         <div className="w-full max-w-sm bg-[#080a0f] border-[4px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden z-10 ring-1 ring-black/50">
            {/* Header */}
            <div className="bg-[#080a0f] border-b-2 border-[#1e293b] p-6 pt-8 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-[0.85] font-sans drop-shadow-md">
                        Init<br/>Unit
                    </h1>
                    <button onClick={() => setViewMode('browse')} className="w-8 h-8 rounded-lg bg-[#1e293b] text-slate-400 border border-[#334155] flex items-center justify-center hover:text-white transition-colors active:scale-95 shadow-md">
                        <X size={16} />
                    </button>
                </div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.25em] ml-1">
                    Establish Identity
                </p>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6 relative z-10 p-6 bg-[#080a0f]">
                {/* Form Fields */}
                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                        <Shield size={10} className="text-indigo-500" /> Unit Name
                    </label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="E.G. NIGHT RIDERS"
                        className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-4 text-sm font-black italic uppercase text-white placeholder:text-slate-700 placeholder:not-italic focus:outline-none focus:border-indigo-500 transition-all font-sans"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                        <MessageSquare size={10} className="text-indigo-500" /> Moto / Ethos
                    </label>
                    <input 
                        type="text" 
                        value={formData.moto}
                        onChange={e => setFormData({...formData, moto: e.target.value})}
                        placeholder="E.G. SKATE AND DESTROY"
                        className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-4 text-xs font-bold uppercase text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="space-y-2 group">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                        <MapPin size={10} className="text-indigo-500" /> Home Turf
                    </label>
                    <div className="relative">
                        <select 
                            value={formData.homeSpotId}
                            onChange={e => setFormData({...formData, homeSpotId: e.target.value})}
                            className="w-full bg-[#0f1218] border border-[#1e293b] rounded-xl p-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 appearance-none uppercase"
                        >
                            <option value="" className="text-slate-700">Select Local Spot</option>
                            {spots.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.location.address})</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <MapPin size={16} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-1">
                        <Crown size={10} className="text-indigo-500" /> Emblem
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar px-1">
                        {CREW_AVATARS.map(av => (
                            <button 
                            key={av}
                            onClick={() => { setFormData({...formData, avatar: av}); triggerHaptic('light'); }}
                            className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 relative group shrink-0
                                ${formData.avatar === av 
                                    ? 'bg-indigo-600 border-2 border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-100 z-10' 
                                    : 'bg-[#0f1218] border border-[#1e293b] opacity-60 hover:opacity-100 hover:border-white/30 scale-95'
                                }
                            `}
                            >
                                <span className="relative z-10 leading-none select-none filter drop-shadow-lg">{av}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleCreateCrew}
                    disabled={!formData.name || !formData.homeSpotId}
                    className="w-full py-4 bg-indigo-600 text-white border border-indigo-500 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:bg-[#1e293b] disabled:border-[#334155] disabled:cursor-not-allowed hover:bg-indigo-500 mt-2"
                >
                    <Plus size={14} /> CONFIRM UNIT
                </button>
            </div>
         </div>
      </div>
    );
  }

  // --- DASHBOARD MODE ---
  if (activeCrew) {
      const memberPercentage = Math.round((activeCrew.members.length / (activeCrew.maxMembers || 10)) * 100);
      const isAdmin = user && activeCrew.adminIds && activeCrew.adminIds.includes(user.id);
      const pendingRequests = activeCrew.requests || [];

      return (
        <div className="h-full flex flex-col bg-[#020202] animate-view overflow-y-auto hide-scrollbar pb-32 pt-safe-top font-mono">
           {/* HERO */}
           <div className="relative w-full px-6 pt-6 pb-2 shrink-0">
               <div className="flex justify-between items-start mb-6">
                   <button onClick={onBack} className="p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 active:scale-95 transition-all hover:text-white">
                       <ChevronLeft size={20} />
                   </button>
                   <button onClick={() => setShowSettings(!showSettings)} className={`p-2 rounded-xl text-white border transition-all ${showSettings ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-white/10'}`}>
                       <Settings size={20} />
                   </button>
               </div>

               {showSettings && (
                   <div className="absolute top-20 right-6 z-30 w-48 bg-[#0b0c10] border border-white/10 rounded-2xl shadow-2xl p-2 animate-pop">
                       <button onClick={handleLeaveCrew} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-900 rounded-xl transition-colors">
                           <LogOut size={16} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Leave Unit</span>
                       </button>
                   </div>
               )}

               <div className="flex items-end gap-6 mb-6">
                   <div className="w-24 h-24 bg-[#0b0c10] border-2 border-white/10 rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl">
                       {activeCrew.avatar}
                   </div>
                   <div className="flex-1 pb-1">
                       <h1 className="text-4xl font-black italic uppercase text-white leading-[0.85] tracking-tighter mb-2 font-sans">{activeCrew.name}</h1>
                       <div className="flex items-center gap-2">
                           <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-md text-[8px] font-black uppercase tracking-widest">{activeCrew.city} Chapter</span>
                           <span className="px-2 py-1 bg-slate-900 border border-white/10 text-white rounded-md text-[8px] font-black uppercase tracking-widest">Lvl {activeCrew.level}</span>
                       </div>
                   </div>
               </div>
           </div>

           {/* CONTENT */}
           <div className="px-6 space-y-6">
               
               <button 
                   onClick={handleOpenChat}
                   className="w-full bg-[#111] border border-white/10 p-4 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-[#161616]"
               >
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-indigo-900/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                           <MessageSquare size={18} />
                       </div>
                       <div>
                           <h3 className="text-sm font-black uppercase text-white tracking-wide">Comms Link</h3>
                           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secure Unit Chat</p>
                       </div>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                       <ChevronLeft size={16} className="rotate-180" />
                   </div>
               </button>

               {isAdmin && pendingRequests.length > 0 && (
                   <section className="bg-[#0b0c10] border border-indigo-500/30 p-5 rounded-[2rem] shadow-[0_0_20px_rgba(99,102,241,0.1)] relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Shield size={80} /></div>
                       <div className="relative z-10">
                           <div className="flex justify-between items-center mb-4">
                               <h3 className="text-xs font-black uppercase italic text-white tracking-widest flex items-center gap-2">
                                   <Shield size={14} className="text-indigo-500" /> Incoming Signal
                               </h3>
                               <span className="text-[9px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
                           </div>
                           <div className="space-y-2">
                               {pendingRequests.map(reqId => (
                                   <div key={reqId} className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
                                       <div className="flex items-center gap-3">
                                           <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                               <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${reqId}`} className="w-full h-full object-cover" />
                                           </div>
                                           <div className="flex flex-col">
                                               <span className="text-[9px] font-bold text-white uppercase">User #{reqId.slice(-4)}</span>
                                               <span className="text-[7px] text-slate-500 uppercase tracking-widest">Awaiting Clearance</span>
                                           </div>
                                       </div>
                                       <div className="flex gap-2">
                                           <button onClick={() => handleReviewRequest(reqId, false)} className="p-2 bg-slate-900 border border-slate-800 text-red-400 rounded-xl hover:bg-red-900/20 transition-colors"><X size={14} /></button>
                                           <button onClick={() => handleReviewRequest(reqId, true)} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 shadow-lg"><Check size={14} /></button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </section>
               )}

               <div className="grid grid-cols-2 gap-4">
                   <div className="bg-[#0b0c10] border border-white/10 p-5 rounded-[2rem] flex flex-col justify-between h-32">
                       <div className="flex items-center gap-2 text-indigo-400">
                           <Users size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Roster</span>
                       </div>
                       <div>
                           <span className="text-3xl font-black text-white italic leading-none">{activeCrew.members.length}<span className="text-sm text-slate-500 not-italic font-medium">/{activeCrew.maxMembers || 10}</span></span>
                           <div className="w-full h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden border border-white/5">
                               <div className="h-full bg-indigo-500" style={{ width: `${memberPercentage}%` }}></div>
                           </div>
                       </div>
                   </div>
                   <div className="bg-[#0b0c10] border border-white/10 p-5 rounded-[2rem] flex flex-col justify-between h-32">
                       <div className="flex items-center gap-2 text-yellow-500">
                           <Crown size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Total XP</span>
                       </div>
                       <div>
                           <span className="text-3xl font-black text-white italic leading-none">{activeCrew.totalXp > 1000 ? (activeCrew.totalXp/1000).toFixed(1) + 'K' : activeCrew.totalXp}</span>
                           <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-wider">Unit Rank #--</p>
                       </div>
                   </div>
               </div>
               
               <div className="bg-[#0b0c10] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/10 to-transparent pointer-events-none" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
                            <Target size={14} /> Weekly Objective
                        </h3>
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black px-2 py-1 rounded uppercase tracking-wide">
                            Active
                        </div>
                    </div>
                    <p className="text-xl font-black text-white italic uppercase mb-6 leading-none relative z-10 w-[90%] font-sans">{activeCrew.weeklyGoal.description}</p>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-emerald-500 w-1/3 shadow-[0_0_10px_#10b981]"></div>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">{activeCrew.weeklyGoal.current}/{activeCrew.weeklyGoal.target}</span>
                    </div>
               </div>

               <div>
                   <h3 className="text-xs font-black uppercase italic text-white tracking-widest mb-4 flex items-center gap-2 pl-2">
                       <Hexagon size={14} className="text-slate-500" /> Unit Roster
                   </h3>
                   <div className="space-y-3">
                       <div className="flex items-center gap-4 bg-[#0b0c10] p-4 rounded-[1.5rem] border border-white/10">
                            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                                <img src={user?.avatar} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-black uppercase text-white italic">{user?.name}</h4>
                                    <span className="bg-indigo-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded tracking-wider">YOU</span>
                                    {isAdmin && <span className="bg-yellow-500/20 text-yellow-500 text-[7px] font-black px-1.5 py-0.5 rounded border border-yellow-500/30 tracking-wider">LEADER</span>}
                                </div>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Level {user?.level}</p>
                            </div>
                       </div>
                       
                       {[...Array(Math.max(0, activeCrew.members.length - 1))].map((_, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 rounded-[1.5rem] border border-transparent opacity-60">
                               <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-600">
                                   <UserIcon size={18} />
                               </div>
                               <div className="flex-1 space-y-1.5">
                                   <div className="w-24 h-3 bg-slate-800 rounded animate-pulse"></div>
                                   <div className="w-10 h-2 bg-slate-900 rounded"></div>
                                </div>
                                <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">OPERATIVE</div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>
        </div>
      );
  }

  return null;
};

export default CrewView;
