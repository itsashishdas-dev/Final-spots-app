
import React from 'react';
import { createPortal } from 'react-dom';
import { Settings, Lock, Shield, Trophy, Zap, Users, MapPin, ChevronRight, Plus, Activity, User as UserIcon, LogOut, Bell, Volume2, VolumeX, UserCog, X, Save, Type, Footprints, History, Hexagon, Star, Gamepad2, Smartphone, Home, Calendar, Camera, AlertTriangle, Apple, Wifi, Database, Command } from 'lucide-react';
import { BadgeTier } from '../types';
import { COLLECTIBLES_DATABASE, BADGE_DATABASE } from '../core/constants';
import { triggerHaptic } from '../utils/haptics';
import SkaterGame from '../components/SkaterGame';
import { useProfile } from '../features/profile';

interface ProfileViewProps {
  onLogout: () => void;
  setActiveTab: (tab: string) => void;
}

const ActivityGraph = () => (
  <div className="w-full h-32 bg-[#0b0c10] border border-slate-800 rounded-2xl p-4 relative overflow-hidden mt-4 group">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c10] to-[#050505]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-50" />
      
      <div className="flex justify-between items-center mb-2 relative z-10">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-indigo-500" /> Performance
          </h3>
          <div className="flex items-center gap-1.5 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[8px] font-bold text-green-400 font-mono">+12%</span>
          </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 flex items-end px-0 pb-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
              <path d="M0,50 C20,45 40,55 60,40 C80,25 100,30 120,45 C140,60 160,30 180,20 C200,10 220,35 240,40 C260,45 280,30 300,35" 
                    fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]" />
              <path d="M0,50 C20,45 40,55 60,40 C80,25 100,30 120,45 C140,60 160,30 180,20 C200,10 220,35 240,40 C260,45 280,30 300,35 L300,80 L0,80 Z" 
                    fill="url(#grad)" opacity="0.3" />
              <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
              </defs>
          </svg>
      </div>
  </div>
);

const ProfileView: React.FC<ProfileViewProps> = ({ onLogout, setActiveTab }) => {
  const {
    user,
    activeCrew,
    activeSection,
    showSettings,
    setShowSettings,
    showGame,
    setShowGame,
    isEditing,
    setIsEditing,
    isLoggingOut,
    logoutLog,
    bottomRef,
    editForm,
    setEditForm,
    isLinked,
    avatarInputRef,
    handleSaveProfile,
    handleLinkAccount,
    handleAvatarChange,
    handleToggleSfx,
    handleToggleNotifications,
    handleSectionChange,
    handleLogout,
    navigateToCrew
  } = useProfile(onLogout, setActiveTab);

  const getTierColor = (tier: BadgeTier) => {
      switch(tier) {
          case BadgeTier.ROOKIE: return 'text-amber-700'; 
          case BadgeTier.INITIATE: return 'text-slate-400'; 
          case BadgeTier.SKILLED: return 'text-yellow-400'; 
          case BadgeTier.VETERAN: return 'text-purple-400'; 
          case BadgeTier.LEGEND: return 'text-red-500'; 
          default: return 'text-slate-500';
      }
  };

  if (!user) return null;

  const isModerator = user.email && ['admin@push.com', 'mod@push.com'].includes(user.email);

  // Progression Maths
  let xpAccumulated = 0;
  for(let i=1; i < user.level; i++) {
      xpAccumulated += 100 + (i * 40);
  }
  const xpRequiredForCurrentLevel = xpAccumulated;
  const xpRequiredForNextLevel = 100 + (user.level * 40);
  
  const xpInCurrentLevel = user.xp - xpRequiredForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));

  // --- LOGOUT SEQUENCE OVERLAY ---
  if (isLoggingOut) {
      return (
          <div className="fixed inset-0 z-[10000] bg-black flex flex-col justify-end p-8 font-mono">
              {/* Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,255,0,0.05)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-20" />
              
              <div className="space-y-2 relative z-30 mb-12">
                  {logoutLog.map((log, i) => (
                      <div key={i} className="text-sm font-bold tracking-widest text-red-500">
                          {log}
                      </div>
                  ))}
                  <div ref={bottomRef} />
              </div>
              <div className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] text-center mb-8 relative z-30">
                  PUSH OS v1.9 // DISCONNECTED
              </div>
          </div>
      );
  }

  return (
    <div className="h-full bg-[#050505] relative flex flex-col font-mono">
       
       {/* --- HEADER (TACTICAL ID CARD) --- */}
       <div className="pt-[calc(env(safe-area-inset-top)+1.5rem)] px-4 pb-6 z-10 shrink-0">
           
           {/* Top Bar Status */}
           <div className="flex justify-between items-center mb-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest px-1">
               <div className="flex items-center gap-2">
                   <Wifi size={10} /> SIGNAL: STRONG
               </div>
               <div className="flex items-center gap-2">
                   STATUS: ACTIVE <Database size={10} className="text-emerald-500 animate-pulse" />
               </div>
           </div>

           <div className="bg-[#0b0c10] border-2 border-slate-800 rounded-lg p-1 relative shadow-2xl overflow-hidden">
               {/* Screw Heads */}
               <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full border border-slate-700 bg-[#151515] flex items-center justify-center"><div className="w-1 h-0.5 bg-slate-800 rotate-45" /></div>
               <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full border border-slate-700 bg-[#151515] flex items-center justify-center"><div className="w-1 h-0.5 bg-slate-800 rotate-45" /></div>
               <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full border border-slate-700 bg-[#151515] flex items-center justify-center"><div className="w-1 h-0.5 bg-slate-800 rotate-45" /></div>
               <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full border border-slate-700 bg-[#151515] flex items-center justify-center"><div className="w-1 h-0.5 bg-slate-800 rotate-45" /></div>

               <div className="bg-[#080808] border border-white/5 rounded-md p-4">
                   <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                           {/* Avatar Frame */}
                           <div onClick={() => setActiveTab('MAP')} className="relative w-16 h-16 shrink-0 cursor-pointer active:scale-95 transition-transform group bg-slate-900 rounded-md border-2 border-slate-700 p-0.5">
                               <img src={user.avatar} className="w-full h-full object-cover rounded-sm transition-all" style={{ imageRendering: 'pixelated' }} />
                               <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm border border-black uppercase tracking-wider">
                                   ID #{user.shareId}
                               </div>
                           </div>
                           
                           {/* Identity Data */}
                           <div>
                               <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1 font-sans italic">
                                   {user.name}
                               </h1>
                               <div className="flex flex-col gap-0.5">
                                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                       <MapPin size={8} /> {user.location}
                                   </span>
                                   <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                                       Class: {user.level > 30 ? 'Legend' : user.level > 15 ? 'Veteran' : user.level > 5 ? 'Skater' : 'Rookie'}
                                   </span>
                               </div>
                           </div>
                       </div>
                       
                       <button 
                         onClick={() => { setShowSettings(true); triggerHaptic('light'); }} 
                         className="p-2 bg-slate-900 border border-slate-700 rounded-md text-slate-400 hover:text-white active:bg-slate-800 transition-all shadow-lg"
                       >
                          <Settings size={16} />
                       </button>
                   </div>

                   {/* Digital LCD XP Bar */}
                   <div className="space-y-1">
                       <div className="flex justify-between items-end text-[8px] font-bold uppercase tracking-widest text-slate-500">
                           <span>Level {user.level}</span>
                           <span className="text-indigo-400">{Math.floor(xpInCurrentLevel)}/{xpRequiredForNextLevel} XP</span>
                       </div>
                       <div className="flex gap-0.5 h-2 w-full">
                           {[...Array(20)].map((_, i) => {
                               const isActive = (i / 20) * 100 < progressPercent;
                               return (
                                   <div 
                                     key={i} 
                                     className={`flex-1 rounded-[1px] transition-colors duration-500 ${isActive ? 'bg-indigo-500 shadow-[0_0_4px_#6366f1]' : 'bg-slate-900'}`}
                                   />
                               );
                           })}
                       </div>
                   </div>
               </div>
           </div>
       </div>

       {/* --- MECHANICAL TABS --- */}
       <div className="px-4 mb-4 shrink-0 relative z-10">
           <div className="grid grid-cols-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800 backdrop-blur-sm">
               {[
                   { id: 'overview', icon: Activity, label: 'Stats' },
                   { id: 'badges', icon: Shield, label: 'Badges' },
                   { id: 'history', icon: History, label: 'Log' }
               ].map(tab => {
                   const isActive = activeSection === tab.id;
                   const Icon = tab.icon;
                   return (
                       <button 
                         key={tab.id}
                         onClick={() => handleSectionChange(tab.id as any)}
                         className={`
                            relative h-10 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-md overflow-hidden
                            ${isActive 
                                ? 'bg-slate-800 text-white shadow-inner border border-slate-700' 
                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                            }
                         `}
                       >
                           {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500" />}
                           <Icon size={12} strokeWidth={2.5} /> {tab.label}
                       </button>
                   )
               })}
           </div>
       </div>

       {/* --- CONTENT AREA --- */}
       <div className="flex-1 relative overflow-hidden">
           <div 
                key={activeSection} 
                className="absolute inset-0 px-4 pb-24 overflow-y-auto hide-scrollbar animate-[fadeIn_0.3s_cubic-bezier(0.4,0,0.2,1)]"
           >
               
               {/* OVERVIEW */}
               {activeSection === 'overview' && (
                   <div className="space-y-4">
                       <div className="grid grid-cols-3 gap-2">
                           <div className="bg-[#0b0c10] border-2 border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center gap-1 group">
                               <Zap size={16} className="text-yellow-500 group-hover:scale-110 transition-transform mb-1" />
                               <span className="text-xl font-black text-white font-mono leading-none">{user.streak}</span>
                               <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Streak</span>
                           </div>
                           <div className="bg-[#0b0c10] border-2 border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center gap-1 group">
                               <Trophy size={16} className="text-blue-400 group-hover:scale-110 transition-transform mb-1" />
                               <span className="text-xl font-black text-white font-mono leading-none">{user.completedChallengeIds.length}</span>
                               <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Wins</span>
                           </div>
                           <div className="bg-[#0b0c10] border-2 border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center gap-1 group">
                               <Star size={16} className="text-green-400 group-hover:scale-110 transition-transform mb-1" />
                               <span className="text-xl font-black text-white font-mono leading-none">{(user.xp/1000).toFixed(1)}k</span>
                               <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Total XP</span>
                           </div>
                       </div>

                        {/* MODERATOR BUTTON */}
                        {isModerator && (
                            <button 
                                onClick={() => { triggerHaptic('medium'); setActiveTab('ADMIN'); }}
                                className="w-full bg-red-950/30 border border-red-500/50 p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-red-900/50 relative overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                            >
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:text-white transition-colors">
                                        <Command size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase italic text-red-100 tracking-wide">Admin Console</h3>
                                        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Access System Core</p>
                                    </div>
                                </div>
                                <div className="bg-red-500 text-black px-2 py-1 text-[8px] font-black uppercase rounded-sm relative z-10 animate-pulse">
                                    Auth Granted
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </button>
                        )}

                       {/* Crew Status */}
                       <div onClick={navigateToCrew} className="w-full bg-[#0b0c10] rounded-lg border border-slate-800 p-4 flex items-center gap-4 relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all">
                          {activeCrew ? (
                              <>
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center text-xl border border-slate-700 shadow-inner">
                                    {activeCrew.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="text-[8px] font-black uppercase text-indigo-400 tracking-widest mb-0.5">Active Unit</div>
                                    <h3 className="text-lg font-black italic uppercase text-white tracking-tight">{activeCrew.name}</h3>
                                    <p className="text-[9px] font-bold uppercase text-slate-500">Lvl {activeCrew.level} • {activeCrew.city}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
                              </>
                          ) : (
                              <div className="w-full flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-slate-900 rounded-md flex items-center justify-center text-slate-500 border border-slate-800"><Users size={16} /></div>
                                      <div>
                                          <h3 className="text-sm font-black italic uppercase text-white">No Unit</h3>
                                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Join a Crew</p>
                                      </div>
                                  </div>
                                  <Plus size={16} className="text-indigo-500" />
                              </div>
                          )}
                       </div>

                       {/* Mini Game Entry */}
                       <div 
                         onClick={() => { setShowGame(true); triggerHaptic('medium'); }}
                         className="bg-indigo-950/20 border border-indigo-500/30 rounded-lg p-4 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all hover:bg-indigo-900/30 group relative overflow-hidden"
                       >
                           {/* Scanline */}
                           <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none opacity-20" />
                           
                           <div className="flex items-center gap-4 relative z-10">
                               <div className="w-12 h-12 bg-indigo-600 rounded-md flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform border border-indigo-400">
                                   <Gamepad2 size={20} />
                               </div>
                               <div>
                                   <h3 className="text-sm font-black uppercase italic text-white tracking-widest">Reflex Sim</h3>
                                   <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">Offline Training</p>
                               </div>
                           </div>
                           <ChevronRight size={16} className="text-indigo-500/50" />
                       </div>

                       {/* Activity Graph */}
                       <ActivityGraph />

                       {/* Rider Stats Card */}
                       <section className="bg-[#0b0c10] border border-slate-800 rounded-lg p-4 space-y-3">
                           <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                               <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                   <UserIcon size={10} /> Personnel File
                               </h3>
                           </div>
                           
                           {user.bio && (
                               <div className="bg-[#080808] p-3 rounded border border-white/5 font-mono text-[10px] text-slate-300 leading-relaxed italic">
                                   "{user.bio}"
                               </div>
                           )}

                           <div className="grid grid-cols-2 gap-2">
                               <div className="bg-[#080808] p-2 rounded border border-white/5">
                                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Sessions</span>
                                   <span className="text-sm font-black text-white font-mono">{user.stats?.totalSessions || 0}</span>
                               </div>
                               <div className="bg-[#080808] p-2 rounded border border-white/5">
                                   <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Stance</span>
                                   <span className="text-sm font-black text-white font-mono uppercase">{user.stance}</span>
                               </div>
                           </div>
                       </section>
                   </div>
               )}

               {/* BADGES */}
               {activeSection === 'badges' && (
                   <div className="grid grid-cols-2 gap-2">
                       {BADGE_DATABASE.map(badge => {
                           const isEarned = user.badges.includes(badge.id);
                           const TierIcon = Hexagon; 

                           return (
                               <div 
                                 key={badge.id}
                                 className={`bg-[#0b0c10] border rounded-lg p-3 flex flex-col items-center text-center relative overflow-hidden group transition-all ${
                                     isEarned 
                                     ? 'border-slate-700 bg-slate-900/50' 
                                     : 'border-slate-900 opacity-50 grayscale bg-[#050505]'
                                 }`}
                               >
                                   <div className={`mb-2 relative ${getTierColor(badge.tier)}`}>
                                       <TierIcon size={32} strokeWidth={1.5} className="fill-current opacity-10" />
                                       <div className="absolute inset-0 flex items-center justify-center">
                                           <Shield size={14} className="text-white" />
                                       </div>
                                   </div>

                                   <h4 className="text-[10px] font-black uppercase text-white mb-1 tracking-wider">{badge.name}</h4>
                                   <p className="text-[8px] text-slate-500 font-mono leading-tight mb-2 h-6 overflow-hidden line-clamp-2">{badge.description}</p>
                                   
                                   {isEarned ? (
                                       <span className="text-[7px] font-black bg-green-500/10 text-green-400 px-2 py-0.5 rounded-sm uppercase tracking-wide border border-green-500/20">
                                           ACQUIRED
                                       </span>
                                   ) : (
                                       <span className="text-[7px] font-bold text-slate-600 uppercase tracking-wide truncate max-w-full">
                                           LOCKED
                                       </span>
                                   )}
                               </div>
                           )
                       })}
                   </div>
               )}

               {/* HISTORY */}
               {activeSection === 'history' && (
                   <div className="space-y-6">
                       <section>
                           <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2 px-1">
                               <Lock size={10} className="text-indigo-500" /> Unlockables
                           </h3>
                           <div className="grid grid-cols-2 gap-2">
                               {COLLECTIBLES_DATABASE.map(item => {
                                   const unlocked = user.locker.includes(item.id);
                                   return (
                                       <div key={item.id} className={`bg-[#0b0c10] border border-slate-800 rounded-lg p-3 flex items-center gap-3 ${!unlocked && 'opacity-40'}`}>
                                           <div className="w-10 h-10 bg-black rounded border border-white/10 shrink-0 flex items-center justify-center">
                                               <img src={item.imageUrl} className="w-8 h-8 object-contain" />
                                           </div>
                                           <div className="min-w-0">
                                               <div className="text-[9px] font-black uppercase text-white truncate">{item.name}</div>
                                               <div className="text-[7px] font-mono font-bold text-slate-500 uppercase">{unlocked ? 'OPEN' : 'LOCKED'}</div>
                                           </div>
                                       </div>
                                   )
                               })}
                           </div>
                       </section>

                       <section>
                           <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3 flex items-center gap-2 px-1">
                               <History size={10} className="text-indigo-500" /> System Log
                           </h3>
                           <div className="space-y-1.5 font-mono">
                               <div className="bg-[#0b0c10] border-l-2 border-green-500 p-2 pl-3 flex justify-between items-center text-[9px] text-slate-400">
                                   <span className="font-bold text-slate-200">LEVEL UP ({user.level})</span>
                                   <span>TODAY</span>
                               </div>
                               {user.completedChallengeIds.slice(0,3).map((cid, i) => (
                                   <div key={i} className="bg-[#0b0c10] border-l-2 border-slate-700 p-2 pl-3 flex justify-between items-center text-[9px] text-slate-400">
                                       <span className="font-bold">CHALLENGE COMPLETE</span>
                                       <span>RECENT</span>
                                   </div>
                               ))}
                           </div>
                       </section>
                   </div>
               )}
           </div>
       </div>

       {/* --- GAME MODAL --- */}
       {showGame && (
           <SkaterGame onClose={() => setShowGame(false)} isOverlay={true} />
       )}

       {/* --- SETTINGS MODAL (PORTAL) --- */}
       {showSettings && createPortal(
         <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-view" onClick={() => setShowSettings(false)}>
            <div className="w-full max-w-sm max-h-[90vh] bg-[#0b0c10] border-2 border-slate-800 rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden font-mono ring-1 ring-white/10" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="bg-[#0b0c10] border-b border-white/10 p-5 flex justify-between items-center shrink-0 relative z-20">
                    <div>
                        <h3 className="text-xl font-black italic uppercase text-white tracking-tighter leading-none font-sans">{isEditing ? 'Modify Data' : 'System Config'}</h3>
                        {isEditing && <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Update Personnel Record</p>}
                    </div>
                    <button onClick={() => { setIsEditing(false); setShowSettings(false); }} className="w-8 h-8 bg-slate-900 rounded-lg text-slate-400 hover:text-white active:scale-95 transition-transform flex items-center justify-center border border-white/10"><X size={16} /></button>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar bg-[#050505] relative z-10">
                    {isEditing ? (
                        <div className="p-6 space-y-6">
                            {/* Avatar */}
                            <div className="flex justify-center">
                                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                    <div className="w-24 h-24 rounded-2xl border-2 border-slate-800 overflow-hidden bg-slate-900 relative shadow-lg group-hover:border-indigo-500 transition-colors">
                                        <img src={editForm.avatar || user.avatar} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={24} className="text-white" />
                                        </div>
                                    </div>
                                    <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Codename</label>
                                    <input 
                                        type="text" 
                                        value={editForm.name} 
                                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                                        className="w-full bg-[#0f1218] border border-slate-800 rounded-lg p-3 text-sm font-bold text-white uppercase focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Bio Data</label>
                                    <textarea 
                                        value={editForm.bio} 
                                        onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                        rows={3}
                                        className="w-full bg-[#0f1218] border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:border-indigo-500 outline-none transition-colors resize-none"
                                        placeholder="Enter status..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Stance</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['regular', 'goofy'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setEditForm({...editForm, stance: s as any})}
                                                className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                    editForm.stance === s 
                                                    ? 'bg-indigo-600 border-indigo-500 text-white' 
                                                    : 'bg-[#0f1218] border-slate-800 text-slate-500'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Location</label>
                                    <input 
                                        type="text" 
                                        value={editForm.address} 
                                        onChange={e => setEditForm({...editForm, address: e.target.value})}
                                        placeholder="City / Sector"
                                        className="w-full bg-[#0f1218] border border-slate-800 rounded-lg p-3 text-xs font-mono text-white focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            <button onClick={() => setIsEditing(true)} className="w-full p-4 hover:bg-white/5 rounded-xl flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <UserCog size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">Edit Profile</div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-wide">Update Identity</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-600 group-hover:text-white" />
                            </button>

                            <button onClick={handleToggleNotifications} className="w-full p-4 hover:bg-white/5 rounded-xl flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-transform ${user.notificationsEnabled ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        <Bell size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">Notifications</div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-wide">{user.notificationsEnabled ? 'Enabled' : 'Disabled'}</div>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${user.notificationsEnabled ? 'bg-green-500' : 'bg-slate-700'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${user.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            <button onClick={handleToggleSfx} className="w-full p-4 hover:bg-white/5 rounded-xl flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border group-hover:scale-110 transition-transform ${user.soundEnabled ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                        {user.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-white">Sound FX</div>
                                        <div className="text-[9px] text-slate-500 uppercase tracking-wide">{user.soundEnabled ? 'Active' : 'Muted'}</div>
                                    </div>
                                </div>
                                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${user.soundEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${user.soundEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            {!isLinked && (
                                <button onClick={handleLinkAccount} className="w-full p-4 hover:bg-white/5 rounded-xl flex items-center justify-between group transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                            <Shield size={20} />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-white">Link Account</div>
                                            <div className="text-[9px] text-slate-500 uppercase tracking-wide">Cloud Save</div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded">Connect</div>
                                </button>
                            )}

                            <div className="h-px bg-white/5 my-2 mx-4" />

                            <button onClick={handleLogout} className="w-full p-4 hover:bg-red-500/10 rounded-xl flex items-center justify-between group transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                                        <LogOut size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-red-400">System Logout</div>
                                        <div className="text-[9px] text-red-500/60 uppercase tracking-wide">Terminate Session</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer for Edit Mode */}
                {isEditing && (
                    <div className="p-4 border-t border-white/10 bg-[#0b0c10] relative z-20">
                        <button 
                            onClick={handleSaveProfile}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-indigo-500"
                        >
                            <Save size={14} /> Save Changes
                        </button>
                    </div>
                )}
            </div>
         </div>,
         document.body
       )}
    </div>
  );
};

export default ProfileView;
