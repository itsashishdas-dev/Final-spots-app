
import React from 'react';
import { createPortal } from 'react-dom';
import { Swords, Check, Video, Play, X, Crosshair, Users, ShieldCheck, ChevronRight, Plus, Trophy, MessageSquare, Clock, MapPin, Calendar, FileText, ThumbsUp, Crown, Medal, Flame } from 'lucide-react';
import { ChallengeCardSkeleton, EmptyState } from '../components/States';
import VideoUploadModal from '../components/VideoUploadModal';
import { useChallenges } from '../features/challenges';
import { Difficulty } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ChallengesViewProps {
  onNavigate?: (tab: string) => void;
}

const ChallengesView: React.FC<ChallengesViewProps> = ({ onNavigate }) => {
  const {
    challenges,
    mySessions,
    myCrew,
    isLoading,
    viewingSubmission,
    setViewingSubmission,
    uploadingChallenge,
    setUploadingChallenge,
    unlockedItem,
    setUnlockedItem,
    submissionsMap,
    votedSubmissions,
    videoRef,
    isPlaying,
    user,
    handleUploadComplete,
    handleVote,
    handleOpenChat,
    togglePlay
  } = useChallenges();

  const navigateToCrew = (e?: React.MouseEvent) => {
      e?.stopPropagation(); 
      triggerHaptic('medium');
      if (onNavigate) onNavigate('CREW');
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-32 pt-8 px-6 animate-view relative min-h-full space-y-8 bg-[#050505] font-mono">
      
      <header className="relative z-10 flex flex-col gap-6 pt-safe-top">
          <div>
            <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-[0.85] mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] font-sans">Active<br/>Ops</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Daily Objectives & Unit Status</p>
          </div>

          {/* CREW WIDGET */}
          {myCrew ? (
              <div 
                onClick={navigateToCrew}
                className="w-full bg-[#0b0c10] rounded-2xl border-2 border-slate-800 p-1 pr-6 flex items-center gap-4 relative overflow-hidden group cursor-pointer shadow-lg active:scale-[0.98] transition-all"
              >
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/10 via-transparent to-transparent opacity-50" />
                  
                  <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-3xl border border-slate-700 relative z-10 ml-2">
                      {myCrew.avatar}
                  </div>
                  
                  <div className="flex-1 relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-1"><ShieldCheck size={10} /> Your Unit</span>
                          <span className="w-px h-2 bg-slate-700" />
                          <span className="text-[8px] font-bold uppercase text-slate-500">Lvl {myCrew.level}</span>
                      </div>
                      <h3 className="text-lg font-black italic uppercase text-white tracking-tight font-sans">{myCrew.name}</h3>
                      <p className="text-[9px] font-bold uppercase text-slate-400 mt-0.5 truncate">{myCrew.weeklyGoal.description}</p>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-colors z-10">
                      <ChevronRight size={14} />
                  </div>
              </div>
          ) : (
              <div 
                onClick={navigateToCrew}
                className="w-full bg-[#0b0c10] rounded-2xl border-2 border-slate-800 border-dashed p-6 flex items-center justify-between group cursor-pointer hover:bg-slate-900/50 transition-all active:scale-[0.98]"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                          <Users size={20} />
                      </div>
                      <div>
                          <h3 className="text-lg font-black italic uppercase text-white tracking-tight font-sans">No Unit Assigned</h3>
                          <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">Find or form a crew</p>
                      </div>
                  </div>
                  <button 
                    onClick={navigateToCrew}
                    className="px-4 py-2 bg-white text-black rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform"
                  >
                      <Plus size={12} strokeWidth={3} /> Join
                  </button>
              </div>
          )}
      </header>

      {/* ACTIVE MISSIONS (SESSIONS) */}
      {mySessions.length > 0 && (
          <section className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 px-1 text-emerald-400">
                  <Clock size={14} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Missions ({mySessions.length})</span>
              </div>
              
              <div className="space-y-3">
                  {mySessions.map(session => (
                      <div key={session.id} className="bg-[#0b0c10] border-l-4 border-l-emerald-500 border-2 border-slate-800 rounded-r-2xl rounded-l-md p-4 flex items-center justify-between group relative overflow-hidden shadow-lg transition-colors">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 shrink-0">
                                  <Calendar size={16} className="text-emerald-500" />
                              </div>
                              <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-0.5">
                                      <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-500/20">{session.time} Today</span>
                                      <span className="text-[8px] font-mono text-slate-500">{session.participants.length} OPS</span>
                                  </div>
                                  <h4 className="text-sm font-black italic uppercase text-white truncate leading-none mb-1 font-sans">{session.title}</h4>
                                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 uppercase tracking-wide">
                                      <MapPin size={8} /> {session.spotName}
                                  </div>
                              </div>
                          </div>

                          <div className="flex gap-2">
                              <button 
                                onClick={(e) => handleOpenChat(session.id, session.title, e)}
                                className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                              >
                                  <MessageSquare size={16} />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      )}

      {isLoading ? (
        <div className="space-y-4 relative z-10">
           {[...Array(3)].map((_, i) => <ChallengeCardSkeleton key={i} />)}
        </div>
      ) : (
        <section className="space-y-6 relative z-10">
          <div className="flex items-center gap-2 px-1 text-white">
              <Swords size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Available Contracts</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {challenges.length === 0 ? (
                <EmptyState icon={Swords} title="No Challenges" description="Check back later for new ops matching your style." />
            ) : (
                challenges.map(challenge => {
                const isCompleted = user?.completedChallengeIds.includes(challenge.id);
                const submissions = submissionsMap[challenge.id] || [];
                const difficultyColor = challenge.difficulty === Difficulty.PRO ? 'text-red-500' : challenge.difficulty === Difficulty.ADVANCED ? 'text-orange-500' : 'text-indigo-500';
                const borderColor = challenge.difficulty === Difficulty.PRO ? 'border-red-900' : challenge.difficulty === Difficulty.ADVANCED ? 'border-orange-900' : 'border-indigo-900';

                return (
                    <div key={challenge.id} className={`group bg-[#0b0c10] border-2 ${isCompleted ? 'border-green-900' : borderColor} rounded-2xl overflow-hidden relative shadow-xl`}>
                        {/* Screws */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                        <div className="p-5">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className={`font-mono text-[9px] font-bold uppercase tracking-[0.2em] ${isCompleted ? 'text-green-500' : difficultyColor}`}>
                                        {challenge.id.split('-')[1] || 'CNT'} // {challenge.difficulty}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#151515] border border-white/5 px-2 py-1 rounded-sm">
                                    <Trophy size={10} className="text-yellow-500" />
                                    <span className="font-mono text-[10px] font-bold text-white">{challenge.xpReward} XP</span>
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="mb-4">
                                <h3 className={`text-xl font-black uppercase italic tracking-tighter leading-none mb-1 font-sans ${isCompleted ? 'text-green-400 line-through decoration-green-500/50' : 'text-white'}`}>
                                    {challenge.title}
                                </h3>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                                    <Crosshair size={10} /> 
                                    <span className="border-b border-dashed border-slate-700">{challenge.spotName}</span>
                                </div>
                            </div>

                            {/* Compact Brief */}
                            <div className="bg-[#080808] p-3 rounded-lg border border-white/5 mb-4 relative">
                                <FileText size={40} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-800 opacity-20 pointer-events-none" />
                                <p className="text-[10px] text-slate-300 font-medium leading-relaxed font-mono relative z-10 italic">
                                    "{challenge.description}"
                                </p>
                            </div>

                            {/* LEADERBOARD & VOTING SECTION */}
                            <div className="border-t border-slate-800/50 pt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <Trophy size={10} className="text-yellow-600" /> Live Ranking
                                    </h4>
                                    <span className="text-[8px] font-mono text-slate-600">MONTHLY STANDINGS</span>
                                </div>

                                <div className="space-y-1.5">
                                    {submissions.length === 0 ? (
                                        <div className="py-2 text-center border border-dashed border-slate-800 rounded bg-[#0f1218]">
                                            <span className="text-[8px] text-slate-600 font-mono">BE THE FIRST TO CLAIM RANK 1</span>
                                        </div>
                                    ) : (
                                        submissions.slice(0, 3).map((sub, idx) => {
                                            const isVoted = votedSubmissions.has(sub.id);
                                            return (
                                                <div key={sub.id} className="flex items-center gap-3 bg-[#0f1218] p-2 rounded-lg border border-white/5 relative group/rank">
                                                    {/* Rank Indicator */}
                                                    <div className="w-6 flex justify-center shrink-0">
                                                        {idx === 0 ? (
                                                            <Crown size={14} className="text-yellow-500 fill-yellow-500/20" />
                                                        ) : idx === 1 ? (
                                                            <Medal size={14} className="text-slate-300" />
                                                        ) : idx === 2 ? (
                                                            <Medal size={14} className="text-amber-700" />
                                                        ) : (
                                                            <span className="text-[9px] font-mono font-bold text-slate-600">#{idx + 1}</span>
                                                        )}
                                                    </div>

                                                    {/* Avatar & Name */}
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <div className="w-6 h-6 rounded-full border border-slate-700 overflow-hidden shrink-0">
                                                            <img src={sub.userAvatar} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex flex-col truncate">
                                                            <span className="text-[9px] font-bold text-white uppercase truncate">{sub.userName}</span>
                                                            <span className="text-[7px] text-slate-500 font-mono">{sub.date}</span>
                                                        </div>
                                                    </div>

                                                    {/* Explicit Play Button */}
                                                    <button 
                                                        onClick={() => setViewingSubmission(sub)}
                                                        className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shrink-0 hover:border-indigo-500 active:scale-95"
                                                    >
                                                        <Play size={12} fill="currentColor" className="ml-0.5" />
                                                    </button>

                                                    {/* Voting System */}
                                                    <div className="flex items-center justify-end w-12 gap-1 z-10">
                                                        <button 
                                                            onClick={(e) => handleVote(sub.id, challenge.id, e)}
                                                            disabled={isVoted}
                                                            className={`flex items-center gap-1 px-1.5 py-1 rounded transition-colors ${
                                                                isVoted ? 'text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-slate-800'
                                                            }`}
                                                        >
                                                            <span className="text-[9px] font-mono font-bold">{sub.votes}</span>
                                                            <ThumbsUp size={12} className={isVoted ? "fill-current" : ""} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Footer / Action */}
                            <div className="flex items-center justify-between pt-3 mt-2">
                                <div className="text-[8px] font-mono text-slate-500">
                                    {submissions.length} Total Entries
                                </div>

                                {isCompleted ? (
                                    <div className="px-4 py-2 bg-green-900/20 text-green-400 border border-green-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-default">
                                        <Check size={12} strokeWidth={3} /> Cleared
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setUploadingChallenge(challenge)} 
                                        className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95 shadow-lg group/btn"
                                    >
                                        <Video size={12} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" /> Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                );
                })
            )}
          </div>
        </section>
      )}

      {/* --- ENHANCED VIDEO PLAYER MODAL --- */}
      {viewingSubmission && createPortal(
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-view" onClick={() => setViewingSubmission(null)}>
            <div 
                className="w-full max-w-sm max-h-[85vh] h-[85vh] bg-[#09090b] border-[3px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden font-mono ring-1 ring-white/10" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header / Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto bg-black/60 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/10">
                        <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-slate-900">
                            <img src={viewingSubmission.userAvatar} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white shadow-black drop-shadow-md">{viewingSubmission.userName}</span>
                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">{viewingSubmission.date}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setViewingSubmission(null)} 
                        className="w-10 h-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 pointer-events-auto transition-colors active:scale-90"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Video Area */}
                <div className="relative w-full h-full bg-black group flex flex-col" onClick={togglePlay}>
                     <video 
                        ref={videoRef}
                        src={viewingSubmission.videoUrl} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        playsInline 
                        loop 
                     />
                     {!isPlaying && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-20">
                             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/30 backdrop-blur-md">
                                 <Play size={32} className="text-white fill-white ml-1" />
                             </div>
                         </div>
                     )}
                     
                     {/* Video Overlay Gradient at Bottom */}
                     <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent pointer-events-none z-10" />

                     {/* Verified Badge (Top Right of Video) */}
                     <div className="absolute top-16 right-4 pointer-events-none z-20">
                         <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-emerald-500/30 px-2.5 py-1 rounded-full shadow-lg">
                            <ShieldCheck size={10} className="text-emerald-400" />
                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                                Verified
                            </span>
                         </div>
                     </div>

                     {/* Controls Overlay Layer */}
                     <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-20">
                        {/* Bottom Controls */}
                        <div className="mt-auto flex justify-center pointer-events-auto pb-8">
                             {/* Hype Button */}
                             <button 
                                onClick={(e) => handleVote(viewingSubmission.id, viewingSubmission.challengeId, e)}
                                disabled={votedSubmissions.has(viewingSubmission.id)}
                                className={`
                                    relative flex items-center gap-3 h-14 px-8 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-90 group overflow-hidden border-2
                                    ${votedSubmissions.has(viewingSubmission.id) 
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-400 text-white' 
                                        : 'bg-black/60 backdrop-blur-xl border-white/10 text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                <Flame 
                                    size={24} 
                                    className={`transition-transform duration-300 ${votedSubmissions.has(viewingSubmission.id) ? 'fill-white scale-110 animate-[bounce_1s_infinite]' : 'group-hover:scale-110 text-orange-500'}`} 
                                />
                                <span className="text-xl font-black font-mono relative z-10">
                                    {viewingSubmission.votes}
                                </span>
                                
                                {/* Click Burst Effect */}
                                {votedSubmissions.has(viewingSubmission.id) && (
                                    <div className="absolute inset-0 bg-white/20 animate-ping rounded-full" />
                                )}
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>,
        document.body
      )}

      {uploadingChallenge && (
         <VideoUploadModal 
            title={uploadingChallenge.title}
            description={uploadingChallenge.description}
            onClose={() => setUploadingChallenge(null)}
            onUpload={handleUploadComplete}
         />
      )}

      {unlockedItem && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-view">
             <div className="flex flex-col items-center text-center space-y-6 max-w-sm w-full bg-[#0b0c10] border-2 border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden font-mono">
                  {/* Screws */}
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                  {/* Rays Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-transparent to-transparent animate-pulse" />
                  
                  <div className="w-32 h-32 relative flex items-center justify-center z-10">
                      <img src={unlockedItem.imageUrl} className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
                  </div>
                  <div className="space-y-2 z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Item Decrypted</p>
                      <h2 className="text-3xl font-black italic uppercase text-white tracking-tight font-sans">{unlockedItem.name}</h2>
                  </div>
                  <button onClick={() => setUnlockedItem(null)} className="w-full py-4 bg-indigo-600 text-white rounded-lg font-black uppercase tracking-widest text-xs shadow-lg z-10 hover:bg-indigo-500 active:scale-95 transition-all border border-indigo-500">Collect Item</button>
             </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesView;
