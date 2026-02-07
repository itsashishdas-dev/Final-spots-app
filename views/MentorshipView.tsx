
import React from 'react';
import { createPortal } from 'react-dom';
import { MentorBadge } from '../types';
import { Star, Send, Loader2, Play, X, Calendar, Clock, CheckCircle2, BadgeCheck, Zap, Filter, Bot, MessageSquare, ChevronRight, Terminal, BrainCircuit, Activity, Settings, Users, Cpu, Lock, Globe, ExternalLink, Crown, FileText } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { playSound } from '../utils/audio';
import { useMentorship } from '../features/mentorship';

const MOCK_SLOTS = ['10:00 AM', '1:00 PM', '3:30 PM']; 

const SUGGESTED_AI_PROMPTS = [
    { id: 1, text: "Skate events in Mumbai?", icon: Calendar, color: "text-emerald-400", border: "border-emerald-500/50", search: true },
    { id: 2, text: "Indian skate championships 2024", icon: Zap, color: "text-yellow-400", border: "border-yellow-500/50", search: true },
    { id: 3, text: "Fix my speed wobble", icon: Activity, color: "text-red-400", border: "border-red-500/50", search: false },
    { id: 4, text: "Best wheels for rough roads?", icon: Settings, color: "text-slate-300", border: "border-slate-500/50", search: false }
];

// --- FORMATTER COMPONENTS ---

const FormattedInline = ({ text }: { text: string }) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return (
                        <span key={idx} className="relative inline-block mx-0.5 px-1.5 py-0.5 rounded-[3px] bg-amber-500/10 border-b-2 border-amber-500/60 text-amber-200 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)] tracking-wide">
                            {content}
                        </span>
                    );
                }
                return part;
            })}
        </>
    );
};

const MessageContent = ({ text, isUser }: { text: string, isUser: boolean }) => {
    if (isUser) return <p className="font-medium tracking-wide">{text}</p>;

    const lines = text.split('\n');
    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-3" />;

                if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
                    const content = trimmed.replace(/^#+\s*/, '');
                    return (
                        <h3 key={i} className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 border-b border-emerald-500/20 pb-2 mb-3 mt-5 flex items-center gap-2">
                            <div className="w-1 h-3 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                            {content}
                        </h3>
                    );
                }

                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    const content = trimmed.replace(/^[-*]\s*/, '');
                    return (
                        <div key={i} className="flex items-start gap-3 mb-2 pl-2 group/list">
                            <span className="text-emerald-500/70 mt-[6px] text-[8px] font-mono group-hover/list:text-emerald-400 transition-colors">▶</span>
                            <p className="text-sm leading-7 text-emerald-100/90 font-medium">
                                <FormattedInline text={content} />
                            </p>
                        </div>
                    );
                }
                
                if (/^\d+\.\s/.test(trimmed)) {
                     const content = trimmed.replace(/^\d+\.\s*/, '');
                     const num = trimmed.match(/^\d+/)?.[0];
                     return (
                        <div key={i} className="flex items-start gap-3 mb-2 pl-1">
                            <span className="text-emerald-500 font-mono font-bold text-[10px] mt-1 bg-emerald-500/10 px-1.5 rounded border border-emerald-500/20 h-fit min-w-[20px] text-center">{num}</span>
                            <p className="text-sm leading-7 text-emerald-100/90 font-medium">
                                <FormattedInline text={content} />
                            </p>
                        </div>
                     );
                }

                return (
                    <p key={i} className="text-sm leading-7 mb-2 text-emerald-100/80 font-medium">
                        <FormattedInline text={line} />
                    </p>
                );
            })}
        </div>
    );
};

// --- MAIN VIEW ---

const MentorshipView: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    filteredMentors,
    selectedMentor,
    setSelectedMentor,
    selectedSlot,
    setSelectedSlot,
    isBooking,
    bookingSuccess,
    handleBookSession,
    closeProfile,
    aiInput,
    setAiInput,
    chat,
    isAiThinking,
    chatEndRef,
    handleAiSend,
    isEligibleForMentor,
    isSearchMode,
    setIsSearchMode
  } = useMentorship();

  return (
    <div className="pb-32 pt-8 px-4 md:px-6 animate-view h-full flex flex-col relative overflow-y-auto hide-scrollbar bg-[#050505] font-mono">
       
       <header className="mb-6 shrink-0 relative z-10 pt-safe-top">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black italic uppercase text-white mb-2 leading-[0.85] tracking-tighter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] font-sans">
                  Training<br/>Hub
              </h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">
                  Level Up Your Skills
              </p>
            </div>
            <div className="bg-[#0b0c10] border border-slate-700 rounded-md px-3 py-1 flex items-center gap-2 shadow-lg">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_4px_#22c55e]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">
                    {activeTab === 'find' ? `${filteredMentors.length} PROS ONLINE` : 'NET.ACTIVE'}
                </span>
            </div>
          </div>
       </header>
      
      <div className="px-1 mb-6 shrink-0 relative z-10">
           <div className="grid grid-cols-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800 backdrop-blur-sm">
               {[
                   { id: 'find', icon: Users, label: 'Mentors' },
                   { id: 'ai-coach', icon: Cpu, label: 'AI Core' },
                   { id: 'apply', icon: BadgeCheck, label: 'Teach' }
               ].map(tab => {
                   const isActive = activeTab === tab.id;
                   const Icon = tab.icon;
                   return (
                       <button 
                         key={tab.id}
                         onClick={() => { setActiveTab(tab.id as any); triggerHaptic('light'); playSound('tactile_select'); }}
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

      {createPortal(
        <div 
            className={`
                fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+4rem)] top-24 z-[80] 
                transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col px-4 pointer-events-none
                ${activeTab === 'ai-coach' ? 'translate-y-0' : 'translate-y-[120%]'}
            `}
        >
            <div className={`flex-1 flex flex-col bg-[#0b0c10] rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] relative w-full max-w-2xl mx-auto ${activeTab === 'ai-coach' ? 'pointer-events-auto' : ''}`}>
                {/* Header */}
                <div className="bg-[#080a0f] p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest">SPOT_NET // AI_UPLINK</span>
                    </div>
                    
                    {/* SEARCH GROUNDING TOGGLE */}
                    <button 
                        onClick={() => { setIsSearchMode(!isSearchMode); triggerHaptic('medium'); playSound('click'); }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isSearchMode ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300'}`}
                    >
                        <Globe size={12} className={isSearchMode ? "animate-spin" : ""} style={{ animationDuration: '4s' }} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{isSearchMode ? 'Live Intel: ON' : 'Live Intel: OFF'}</span>
                    </button>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 relative hide-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    
                    {chat.length === 0 && (
                        <div className="space-y-6 mt-4 relative z-10 animate-pop">
                            <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-lg relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={64} /></div>
                                <p className="text-xs font-mono text-emerald-400 mb-2 font-bold">> SYSTEM INITIALIZED</p>
                                <p className="text-sm text-emerald-100 font-medium leading-relaxed">Welcome to the Neural Training Network. I am your specialized skate AI. Query me on technique, physics, or toggle <span className="text-indigo-400 font-bold">Live Intel</span> for real-time news.</p>
                            </div>
                            
                            <div>
                                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-3 pl-2">Initialize Query Sequence:</p>
                                <div className="grid grid-cols-1 gap-3">
                                    {SUGGESTED_AI_PROMPTS.map((prompt) => (
                                        <button 
                                            key={prompt.id}
                                            onClick={() => {
                                                if (prompt.search) setIsSearchMode(true);
                                                handleAiSend(prompt.text);
                                            }}
                                            className={`flex items-center gap-3 p-4 bg-[#111] border rounded-lg hover:bg-[#1a1a1a] transition-all text-left group active:scale-95 shadow-lg border-l-4 ${prompt.border} border-y-white/5 border-r-white/5`}
                                        >
                                            <div className={`w-8 h-8 rounded-md bg-black flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform`}>
                                                <prompt.icon size={16} className={prompt.color} />
                                            </div>
                                            <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-wide flex-1">{prompt.text}</span>
                                            <ChevronRight size={14} className="text-slate-700 group-hover:text-white" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {chat.map((msg, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop relative z-10`}>
                                <div 
                                    className={`max-w-[85%] p-5 shadow-lg border relative group
                                    ${msg.role === 'user' 
                                        ? 'bg-indigo-600 border-indigo-500 text-white rounded-lg rounded-br-sm' 
                                        : 'bg-[#080808] border-emerald-500/20 text-emerald-100 rounded-lg rounded-bl-sm font-mono'}`}
                                >
                                    {msg.role === 'model' && (
                                        <div className="absolute -top-3 left-0 bg-[#080808] border border-emerald-500/20 px-2 py-0.5 rounded text-[8px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                                            <Bot size={10} /> AI_CORE {msg.sources && msg.sources.length > 0 && <span className="text-indigo-400 ml-1">// GROUNDED</span>}
                                        </div>
                                    )}
                                    <MessageContent text={msg.text} isUser={msg.role === 'user'} />
                                </div>
                            </div>

                            {/* RENDER GROUNDING SOURCES */}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="flex flex-col gap-2 pl-4 animate-slide-in-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe size={10} className="text-indigo-400" />
                                        <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Field Intelligence Sources</span>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                                        {msg.sources.map((source, sIdx) => (
                                            <a 
                                                key={sIdx}
                                                href={source.uri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => triggerHaptic('light')}
                                                className="shrink-0 w-40 bg-[#0f1218] border border-indigo-500/30 rounded-lg p-2.5 hover:bg-[#1a1f29] hover:border-indigo-400 transition-all group flex flex-col justify-between h-20"
                                            >
                                                <span className="text-[9px] font-bold text-slate-200 line-clamp-2 uppercase leading-tight font-sans">
                                                    {source.title}
                                                </span>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[7px] text-indigo-400 font-mono">SECURE LINK</span>
                                                    <ExternalLink size={10} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {isAiThinking && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-[#080808] p-3 rounded-lg rounded-bl-sm border border-emerald-500/20 flex items-center gap-2">
                                <Loader2 className="animate-spin text-emerald-500" size={14} />
                                <span className="text-[10px] font-mono text-emerald-500 uppercase">{isSearchMode ? 'Tapping into Grid...' : 'Thinking...'}</span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#0b0c10] border-t border-white/10 shrink-0">
                    <div className="flex gap-2 items-center bg-[#050505] rounded-lg px-4 py-1 border border-white/10 focus-within:border-emerald-500/50 transition-colors shadow-inner">
                        <span className="text-emerald-500 font-mono text-xs animate-pulse">{'>'}</span>
                        <input 
                            className="flex-1 bg-transparent text-sm text-white focus:outline-none py-3 placeholder:text-slate-700 font-mono tracking-wide" 
                            placeholder={isSearchMode ? "ASK ABOUT EVENTS / NEWS..." : "ENTER COMMAND..."} 
                            value={aiInput} 
                            onChange={e => setAiInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleAiSend()} 
                        />
                        <button 
                            onClick={() => handleAiSend()} 
                            disabled={!aiInput.trim()} 
                            className={`p-2 rounded-lg disabled:opacity-50 active:scale-95 transition-transform shadow-lg ${isSearchMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}

      {/* --- MENTOR LIST --- */}
      {activeTab !== 'apply' && (
          <div className={`space-y-6 relative z-10 transition-opacity duration-300 ${activeTab === 'ai-coach' ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
              <div className="flex flex-col gap-3">
                  <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Filter size={14} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" /></div>
                      <input type="text" placeholder="FILTER BY EXPERTISE..." className="w-full bg-[#0b0c10] rounded-lg py-4 pl-10 pr-4 text-xs font-bold text-white focus:outline-none border border-white/10 focus:border-indigo-500/50 uppercase tracking-widest font-mono transition-colors shadow-lg" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
              </div>
              <div className="flex flex-col gap-4 pb-4">
                  {filteredMentors.map(mentor => (
                      <div 
                        key={mentor.id} 
                        onClick={() => { setSelectedMentor(mentor); triggerHaptic('medium'); }} 
                        className="group bg-[#0b0c10] border-2 border-slate-800 rounded-2xl p-5 cursor-pointer hover:border-indigo-500/40 transition-all active:scale-[0.98] shadow-lg relative overflow-hidden flex flex-col gap-4"
                      >
                          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-slate-700 rounded-full" />
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-700 rounded-full" />
                          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-slate-700 rounded-full" />
                          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-slate-700 rounded-full" />

                          <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-slate-900 border border-white/10 overflow-hidden relative">
                                  <img src={mentor.avatar} className="w-full h-full object-cover" alt="" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                  <div className="absolute bottom-1 right-1">
                                      <BadgeCheck size={14} className="text-indigo-400 fill-indigo-400/20" />
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-lg font-black italic uppercase text-white tracking-tight">{mentor.name}</h3>
                                      {mentor.badges.includes(MentorBadge.EXPERT) && (
                                          <div className="px-1.5 py-0.5 bg-yellow-500/20 border border-yellow-500/30 rounded text-[7px] font-black text-yellow-500 uppercase tracking-widest">EXPERT</div>
                                      )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                          <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                          <span className="text-[10px] font-bold text-white font-mono">{mentor.rating.toFixed(1)}</span>
                                      </div>
                                      <span className="text-slate-700 text-[8px]">|</span>
                                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{mentor.studentsTrained} Students</span>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <div className="text-lg font-black text-white italic font-mono">₹{mentor.rate}</div>
                                  <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">per hour</div>
                              </div>
                          </div>

                          <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                              <p className="text-[10px] text-slate-400 leading-relaxed font-mono italic">
                                  "{mentor.bio}"
                              </p>
                          </div>

                          <div className="flex items-center justify-between mt-1">
                              <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
                                  {mentor.disciplines.map(d => (
                                      <span key={d} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[7px] font-bold text-slate-400 uppercase tracking-wider">{d}</span>
                                  ))}
                              </div>
                              <button className="flex items-center gap-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                                  <span className="text-[9px] font-black uppercase tracking-widest">Connect</span>
                                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                              </button>
                          </div>
                      </div>
                  ))}

                  {filteredMentors.length === 0 && (
                      <div className="py-12 text-center bg-[#0b0c10]/50 rounded-[2rem] border border-slate-800 border-dashed">
                          <Users size={32} className="mx-auto text-slate-700 mb-3 opacity-50" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No mentors matching query.</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- TEACH / APPLY TAB --- */}
      {activeTab === 'apply' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 animate-view">
              <div className="w-full max-w-sm bg-[#0b0c10] border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent animate-pulse" />
                  
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border-2 transition-all duration-500 ${isEligibleForMentor ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                      <Crown size={40} className={isEligibleForMentor ? "animate-bounce" : ""} />
                  </div>

                  <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-[0.85] mb-4 font-sans">Become a<br/>Pro Mentor</h2>
                  
                  <div className="space-y-4 mb-8">
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Share your expertise, train the next generation of riders, and earn rewards.
                      </p>

                      <div className="space-y-2">
                          <div className="flex items-center gap-3 text-left p-3 bg-black/40 rounded-xl border border-white/5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${user && user.level >= 15 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {user && user.level >= 15 ? <CheckCircle2 size={14} /> : <Lock size={12} />}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wide ${user && user.level >= 15 ? 'text-slate-300' : 'text-slate-600'}`}>Operative Level 15+</span>
                          </div>
                          <div className="flex items-center gap-3 text-left p-3 bg-black/40 rounded-xl border border-white/5">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${user && user.badges.includes('badge_veteran_guardian') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {user && user.badges.includes('badge_veteran_guardian') ? <CheckCircle2 size={14} /> : <Lock size={12} />}
                              </div>
                              <span className={`text-[10px] font-bold uppercase tracking-wide ${user && user.badges.includes('badge_veteran_guardian') ? 'text-slate-300' : 'text-slate-600'}`}>Guardian Badge Earned</span>
                          </div>
                      </div>
                  </div>

                  <button 
                      disabled={!isEligibleForMentor}
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-lg border-2 ${isEligibleForMentor ? 'bg-white text-black border-white hover:bg-slate-200' : 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'}`}
                  >
                      {isEligibleForMentor ? 'Initialize Application' : 'Locked // Requirements Not Met'}
                  </button>
              </div>
          </div>
      )}

      {/* --- MENTOR PROFILE MODAL (PORTAL) --- */}
      {selectedMentor && !bookingSuccess && createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-view" onClick={closeProfile}>
              <div className="w-full max-w-sm bg-[#0b0c10] border-t-2 md:border-2 border-slate-800 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="absolute top-4 left-4 w-2 h-2 bg-slate-800 rounded-full" />
                  <div className="absolute top-4 right-4 w-2 h-2 bg-slate-800 rounded-full" />

                  <div className="relative h-48 shrink-0">
                      <img src={`https://picsum.photos/seed/${selectedMentor.id}/600/400`} className="w-full h-full object-cover grayscale opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/40 to-transparent" />
                      <button onClick={closeProfile} className="absolute top-6 right-6 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-white/20 active:scale-90 transition-all">
                          <X size={20} />
                      </button>
                      
                      <div className="absolute bottom-0 left-0 p-6 flex items-center gap-4">
                          <div className="w-20 h-20 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
                              <img src={selectedMentor.avatar} className="w-full h-full object-cover" />
                          </div>
                          <div>
                              <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none mb-1 font-sans">{selectedMentor.name}</h2>
                              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Verified Pro Mentor</p>
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                      <div className="grid grid-cols-3 gap-2">
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                              <div className="text-sm font-black text-white font-mono">{selectedMentor.rating.toFixed(1)}</div>
                              <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Rating</div>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                              <div className="text-sm font-black text-white font-mono">{selectedMentor.reviewCount}</div>
                              <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Reviews</div>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                              <div className="text-sm font-black text-white font-mono">{selectedMentor.studentsTrained}</div>
                              <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Students</div>
                          </div>
                      </div>

                      <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <FileText size={12} /> Personnel File
                          </h4>
                          <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                              <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                                  "{selectedMentor.bio}"
                              </p>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Clock size={12} /> Select Slot (Next Available)
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                              {MOCK_SLOTS.map(slot => (
                                  <button 
                                      key={slot}
                                      onClick={() => { setSelectedSlot(slot); triggerHaptic('light'); }}
                                      className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${selectedSlot === slot ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white hover:border-white/10'}`}
                                  >
                                      {slot}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-white/5 bg-black/20">
                      <button 
                          onClick={handleBookSession}
                          disabled={!selectedSlot || isBooking}
                          className="w-full py-4 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-2 border-white hover:bg-slate-200"
                      >
                          {isBooking ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />}
                          {isBooking ? 'Processing Request...' : 'Confirm Booking'}
                      </button>
                  </div>
              </div>
          </div>,
          document.body
      )}

      {bookingSuccess && createPortal(
          <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center p-8 text-center animate-view">
              <div className="w-24 h-24 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[2rem] flex items-center justify-center mb-6 animate-pop">
                  <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none mb-4 font-sans">Uplink<br/>Established</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-xs mb-10 leading-relaxed">
                  Session confirmed with <span className="text-emerald-400">{selectedMentor?.name}</span>. Check your Mission Radar for details.
              </p>
              <button 
                  onClick={closeProfile}
                  className="w-full max-w-xs py-5 bg-white text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg active:scale-95 transition-all border-2 border-white hover:bg-slate-200"
              >
                  Return to Hub
              </button>
          </div>,
          document.body
      )}
    </div>
  );
};

export default MentorshipView;
