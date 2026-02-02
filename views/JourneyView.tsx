
import React from 'react';
import { 
  FileText, MapPin, Calendar, Clock, Edit2, 
  Send, Terminal, Bookmark, Trophy, Zap, 
  Activity, ArrowRight, Video, Target, TrendingUp,
  AlertTriangle, Camera, X, MessageSquare, Radar, Loader2
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { playSound } from '../utils/audio';
import SkillTree from '../components/SkillTree';
import { useJourney } from '../features/journey';

const JourneyView: React.FC = () => {
  const {
    user,
    noteInput,
    setNoteInput,
    isSubmitting,
    activeTab,
    setActiveTab,
    mediaPreview,
    setMediaPreview,
    setMediaFile,
    fileInputRef,
    handleFileSelect,
    handleAddNote,
    handleOpenChat,
    skillStats,
    timeline,
    upcomingSessions,
    mediaFile
  } = useJourney();

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-32 pt-safe-top bg-[#050505] relative flex flex-col font-mono">
      
      <header className="px-6 pt-6 pb-2 shrink-0 z-10">
        <div className="flex justify-between items-end mb-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-indigo-500 animate-pulse rounded-full shadow-[0_0_8px_#6366f1]"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Rider's Log</span>
                </div>
                <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter drop-shadow-lg leading-[0.85] font-sans">Mission<br/>Control</h1>
            </div>
            <div className="text-right">
                <div className="text-3xl font-black text-white italic leading-none">{user?.level || 1}</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Current Level</div>
            </div>
        </div>

        {/* Tactical Skill Stats Bars */}
        <div className="bg-[#0b0c10] border-2 border-slate-800 rounded-lg p-4 flex gap-4 overflow-x-auto hide-scrollbar shadow-lg">
            {[
                { label: 'Street', val: skillStats.skate, color: 'bg-indigo-500' },
                { label: 'Downhill', val: skillStats.downhill, color: 'bg-indigo-500' },
                { label: 'Freestyle', val: skillStats.freestyle, color: 'bg-indigo-500' }
            ].map((stat) => (
                <div key={stat.label} className="flex-1 min-w-[80px]">
                    <div className="flex justify-between mb-1.5">
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{stat.label}</span>
                        <span className="text-[9px] font-mono font-bold text-white">{stat.val}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden border border-white/5">
                        <div className={`h-full ${stat.color} transition-all duration-1000 shadow-[0_0_8px_currentColor]`} style={{ width: `${stat.val}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
      </header>

      {/* MECHANICAL TABS */}
      <div className="px-4 py-4 shrink-0 z-10">
          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800 backdrop-blur-sm gap-1">
              <button 
                onClick={() => { setActiveTab('timeline'); triggerHaptic('light'); playSound('click'); }}
                className={`flex-1 py-3 rounded-md text-[9px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${activeTab === 'timeline' ? 'bg-slate-800 text-white shadow-inner border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  <Activity size={12} strokeWidth={2.5} /> Log
              </button>
              <button 
                onClick={() => { setActiveTab('upcoming'); triggerHaptic('light'); playSound('click'); }}
                className={`flex-1 py-3 rounded-md text-[9px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${activeTab === 'upcoming' ? 'bg-slate-800 text-white shadow-inner border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  <Radar size={12} strokeWidth={2.5} /> Radar ({upcomingSessions.length})
              </button>
              <button 
                onClick={() => { setActiveTab('tech_tree'); triggerHaptic('light'); playSound('click'); }}
                className={`flex-1 py-3 rounded-md text-[9px] font-black uppercase tracking-[0.1em] transition-all flex items-center justify-center gap-2 ${activeTab === 'tech_tree' ? 'bg-slate-800 text-white shadow-inner border border-slate-700' : 'text-slate-500 hover:text-slate-300'}`}
              >
                  <TrendingUp size={12} strokeWidth={2.5} /> Tech Tree
              </button>
          </div>
      </div>

      {activeTab === 'tech_tree' && (
          <div className="px-6 pb-6 relative z-10 animate-view">
              <SkillTree />
          </div>
      )}

      {activeTab === 'timeline' && (
          <div className="px-6 space-y-6 pb-6 relative z-10">
              
              {/* Quick Log Input */}
              <div className="bg-[#0b0c10] border border-slate-800 rounded-lg p-1 shadow-lg relative overflow-hidden group focus-within:border-indigo-500/50 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-20"></div>
                  <div className="p-3">
                      <div className="flex items-center gap-2 mb-2 px-1">
                          <Terminal size={12} className="text-indigo-400" />
                          <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">New Entry...</span>
                      </div>
                      
                      <textarea 
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Log spot conditions, trick progress, or thoughts..."
                        rows={2}
                        className="w-full bg-[#020202] rounded-md p-3 text-xs font-medium text-white placeholder:text-slate-600 focus:outline-none resize-none font-mono leading-relaxed border border-white/5"
                      />

                      {mediaPreview && (
                          <div className="relative mt-2 rounded-lg overflow-hidden aspect-video border border-white/10 bg-black">
                              {mediaFile?.type.startsWith('video') ? (
                                  <video src={mediaPreview} className="w-full h-full object-cover" autoPlay loop muted />
                              ) : (
                                  <img src={mediaPreview} className="w-full h-full object-cover" />
                              )}
                              <button onClick={() => { setMediaFile(null); setMediaPreview(null); }} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white border border-white/20"><X size={12} /></button>
                          </div>
                      )}

                      <div className="flex justify-between items-center mt-2">
                          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-[#151515] rounded-md text-slate-400 hover:text-white border border-white/5 transition-colors">
                              <Camera size={14} />
                          </button>
                          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />

                          <button 
                            onClick={handleAddNote}
                            disabled={(!noteInput.trim() && !mediaFile) || isSubmitting}
                            className={`bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-4 py-2 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 ${isSubmitting ? 'cursor-wait' : ''}`}
                          >
                              {isSubmitting ? (
                                  <><Loader2 size={10} className="animate-spin" /> SYNCING...</>
                              ) : (
                                  <>Commit Log <Send size={10} /></>
                              )}
                          </button>
                      </div>
                  </div>
              </div>

              {/* Timeline Feed */}
              <div className="relative pl-4 space-y-6 border-l border-slate-800/50">
                  {timeline.map((item, idx) => (
                      <div key={idx} className="relative pl-6 animate-pop" style={{ animationDelay: `${idx * 50}ms` }}>
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[5px] top-4 w-2.5 h-2.5 rounded-full border-2 border-black ${
                              item.type === 'note' ? 'bg-indigo-500' :
                              item.type === 'session' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>

                          {/* Card Content */}
                          <div className="bg-[#0b0c10] border-2 border-slate-800 rounded-2xl p-4 hover:bg-slate-900/60 transition-colors shadow-lg relative overflow-hidden">
                              {/* Screws */}
                              <div className="absolute top-2 right-2 w-1 h-1 bg-slate-700 rounded-full" />
                              <div className="absolute bottom-2 left-2 w-1 h-1 bg-slate-700 rounded-full" />

                              <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                                      item.type === 'note' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                      item.type === 'session' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                  }`}>
                                      {item.type === 'note' ? 'Log Entry' : item.type === 'session' ? 'Session' : 'Achievement'}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-500">
                                      {item.type === 'note' 
                                        ? new Date(item.timestamp).toLocaleDateString() 
                                        : item.type === 'session' 
                                            ? item.date 
                                            : 'Recent'}
                                  </span>
                              </div>

                              {item.type === 'note' && (
                                  <div>
                                      {item.text && <p className="text-xs text-slate-300 font-mono leading-relaxed opacity-90 mb-2">"{item.text}"</p>}
                                      {item.mediaUrl && (
                                          <div className="rounded-lg overflow-hidden border border-white/10 aspect-video bg-black mt-2">
                                              {item.mediaType === 'video' ? (
                                                  <video src={item.mediaUrl} className="w-full h-full object-cover" controls />
                                              ) : (
                                                  <img src={item.mediaUrl} className="w-full h-full object-cover" />
                                              )}
                                          </div>
                                      )}
                                  </div>
                              )}

                              {item.type === 'session' && (
                                  <div>
                                      <h3 className="text-sm font-black uppercase italic text-white mb-1 font-sans">{item.title}</h3>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                          <MapPin size={10} /> {item.spotName}
                                      </div>
                                  </div>
                              )}

                              {item.type === 'challenge' && (
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-md bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20">
                                          <Trophy size={18} />
                                      </div>
                                      <div>
                                          <h3 className="text-sm font-black uppercase italic text-white font-sans">{item.title}</h3>
                                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">+{item.xpReward} XP</p>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
                  
                  {timeline.length === 0 && (
                      <div className="py-10 text-center pl-6">
                          <p className="text-xs font-mono text-slate-600">-- NO DATA FOUND IN LOGS --</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {activeTab === 'upcoming' && (
          <div className="px-6 pb-6 space-y-4 relative z-10 animate-view">
              {upcomingSessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-lg border border-slate-800 border-dashed">
                      <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 mb-4 animate-pulse">
                          <Target size={24} />
                      </div>
                      <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">Radar Clear</h3>
                      <p className="text-[10px] text-slate-600 mt-2">No upcoming sessions detected.</p>
                  </div>
              ) : (
                  upcomingSessions.map(session => (
                      <div key={session.id} className="bg-[#0b0c10] border-2 border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-lg">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                          
                          {/* Screws */}
                          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                          <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                          <div className="pl-3">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-sm border border-indigo-500/20">
                                          Incoming
                                      </span>
                                      <span className="text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2 py-1 rounded-sm flex items-center gap-1 border border-slate-700">
                                          <Clock size={10} /> {session.time}
                                      </span>
                                  </div>
                                  <div className="text-[9px] font-black uppercase text-white bg-slate-800 px-2 py-1 rounded-sm border border-slate-700">
                                      {session.date}
                                  </div>
                              </div>

                              <h3 className="text-xl font-black italic uppercase text-white mb-1 leading-none font-sans">{session.title}</h3>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1 mb-4">
                                  <MapPin size={12} className="text-indigo-500" /> {session.spotName}
                              </p>

                              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                                  <div className="flex items-center gap-3">
                                      <div className="flex -space-x-2">
                                          {session.participants.slice(0,3).map(pid => (
                                              <div key={pid} className="w-6 h-6 rounded-full bg-slate-700 border border-slate-900 overflow-hidden">
                                                  <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${pid}`} className="w-full h-full object-cover" />
                                              </div>
                                          ))}
                                      </div>
                                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                          {session.participants.length} Operatives
                                      </span>
                                  </div>

                                  <button 
                                    onClick={(e) => handleOpenChat(session.id, session.title, e)}
                                    className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all active:scale-90"
                                  >
                                      <MessageSquare size={14} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))
              )}
          </div>
      )}
    </div>
  );
};

export default JourneyView;
