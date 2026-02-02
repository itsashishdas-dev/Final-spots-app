
import * as React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Discipline, Skill } from '../types.ts';
import { backend } from '../services/mockBackend.ts';
import { triggerHaptic } from '../utils/haptics.ts';
import { playSound } from '../utils/audio.ts';
import { useAppStore } from '../store.ts';
import { Play, Check, Lock, Trophy, Video, X, Upload, Swords, Hexagon, Sparkles, User as UserIcon, Target, BrainCircuit, Activity } from 'lucide-react';
import VideoUploadModal from '../components/VideoUploadModal';

const TIER_NAMES = {
    1: 'Fundamentals',
    2: 'Core Tech',
    3: 'Advanced',
    4: 'Pro Mastery'
};

const SkillTree: React.FC = () => {
  const { user, skills, updateUser } = useAppStore();
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline>(Discipline.SKATE);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});

  useEffect(() => {
      if (user?.disciplines && user.disciplines.length > 0) {
          if (!Object.values(Discipline).includes(activeDiscipline)) {
              setActiveDiscipline(user.disciplines[0]);
          }
      }
  }, [user]);

  useEffect(() => {
      const calculatePositions = () => {
          if (!containerRef.current) return;
          const nodes = containerRef.current.querySelectorAll('[data-skill-id]');
          const newPositions: Record<string, { x: number, y: number }> = {};
          
          const containerRect = containerRef.current.getBoundingClientRect();

          nodes.forEach((node) => {
              const rect = node.getBoundingClientRect();
              const id = node.getAttribute('data-skill-id');
              if (id) {
                  newPositions[id] = {
                      x: rect.left + rect.width / 2 - containerRect.left,
                      y: rect.top + rect.height / 2 - containerRect.top
                  };
              }
          });
          setNodePositions(newPositions);
      };

      const timer = setTimeout(calculatePositions, 100);
      window.addEventListener('resize', calculatePositions);
      
      return () => {
          window.removeEventListener('resize', calculatePositions);
          clearTimeout(timer);
      };
  }, [activeDiscipline, skills]);

  const tieredSkills = useMemo(() => {
      const filtered = skills.filter(s => s.category === activeDiscipline);
      const tiers: Record<number, Skill[]> = { 1: [], 2: [], 3: [], 4: [] };
      filtered.forEach(s => {
          if (tiers[s.tier]) tiers[s.tier].push(s);
      });
      return tiers;
  }, [skills, activeDiscipline]);

  const totalSkillsInDisc = skills.filter(s => s.category === activeDiscipline).length;
  const masteredInDisc = skills.filter(s => s.category === activeDiscipline && user?.masteredSkills.includes(s.id)).length;
  const progressPercent = Math.round((masteredInDisc / totalSkillsInDisc) * 100) || 0;

  const handleSkillClick = (skill: Skill) => {
      triggerHaptic('medium');
      playSound('click');
      setSelectedSkill(skill);
  };

  const handleToggleLearning = async () => {
      if (!selectedSkill || !user) return;
      
      const isLearning = user.pendingSkills.includes(selectedSkill.id);
      let newPending = [...user.pendingSkills];
      
      if (isLearning) {
          newPending = newPending.filter(id => id !== selectedSkill.id);
      } else {
          newPending.push(selectedSkill.id);
      }
      
      const updatedUser = { ...user, pendingSkills: newPending };
      updateUser(updatedUser); // Optimistic update
      
      // Persist to backend
      await backend.updateUser(updatedUser);
      
      triggerHaptic('medium');
      playSound(isLearning ? 'click' : 'tactile_select');
  };

  const handleUploadSuccess = async (file: File) => {
      if (!selectedSkill || !user) return;
      const updatedUser = await backend.masterSkill(selectedSkill.id);
      updateUser(updatedUser);
      setIsUploadOpen(false);
      triggerHaptic('success');
      playSound('unlock'); 
  };

  const renderConnections = () => {
      return skills
          .filter(s => s.category === activeDiscipline && s.prerequisiteId)
          .map(skill => {
              const start = nodePositions[skill.prerequisiteId!];
              const end = nodePositions[skill.id];
              if (!start || !end) return null;

              const isUnlocked = user?.landedSkills.includes(skill.prerequisiteId!) || user?.masteredSkills.includes(skill.prerequisiteId!);
              const isActive = isUnlocked && (user?.landedSkills.includes(skill.id) || user?.masteredSkills.includes(skill.id));
              const midY = (start.y + end.y) / 2;
              const path = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;

              return (
                  <g key={`${skill.prerequisiteId}-${skill.id}`}>
                      {isActive && (
                          <path 
                              d={path}
                              fill="none"
                              stroke="rgba(99, 102, 241, 0.3)"
                              strokeWidth={4}
                              className="animate-pulse"
                          />
                      )}
                      <path 
                          d={path}
                          fill="none"
                          stroke={isActive ? '#6366f1' : '#374151'}
                          strokeWidth={isActive ? 2 : 1}
                          strokeDasharray={isActive ? 'none' : '6 6'}
                          className="transition-colors duration-500"
                      />
                  </g>
              );
          });
  };

  return (
    <div className="flex-col gap-6 pt-2 pb-6 animate-view relative font-mono">
      
      {/* DISCIPLINE SWITCHER */}
      <div className="flex justify-between items-center mb-8 px-1 relative z-20">
          <div className="bg-[#0b0c10] p-1.5 rounded-2xl border border-white/10 flex items-center shadow-lg">
              {[Discipline.SKATE, Discipline.DOWNHILL, Discipline.FREESTYLE].map((d) => (
                  <button 
                    key={d}
                    onClick={() => { setActiveDiscipline(d); triggerHaptic('light'); }}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        activeDiscipline === d 
                        ? 'bg-white text-black shadow-lg scale-105' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                      {d}
                  </button>
              ))}
          </div>
          
          <div className="text-right">
              <div className="text-3xl font-black text-white italic leading-none font-sans">{progressPercent}%</div>
              <div className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Complete</div>
          </div>
      </div>

      {/* NODE GRAPH */}
      <div ref={containerRef} className="relative min-h-[800px] pb-32">
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              {renderConnections()}
          </svg>

          <div className="flex flex-col gap-16 relative z-10 px-1">
              {[1, 2, 3, 4].map((tier) => {
                  const skillsInTier = tieredSkills[tier as 1|2|3|4] || [];
                  if (skillsInTier.length === 0) return null;

                  return (
                      <div key={tier} className="relative flex">
                          <div className="w-8 shrink-0 relative flex items-center justify-center border-r border-slate-800/50 mr-4">
                              <div className="-rotate-90 text-[8px] font-black uppercase text-slate-700 tracking-[0.3em] whitespace-nowrap absolute">
                                  Tier 0{tier} // {TIER_NAMES[tier as 1|2|3|4]}
                              </div>
                          </div>

                          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-10 flex-1 pt-2">
                              {skillsInTier.map(skill => {
                                  const isMastered = user?.masteredSkills.includes(skill.id);
                                  const isLearning = user?.pendingSkills.includes(skill.id);
                                  const isPrereqMet = !skill.prerequisiteId || user?.landedSkills.includes(skill.prerequisiteId!) || user?.masteredSkills.includes(skill.prerequisiteId!);
                                  const isLocked = !isPrereqMet;
                                  const isNextUp = isPrereqMet && !isMastered;
                                  
                                  return (
                                      <div 
                                        key={skill.id} 
                                        data-skill-id={skill.id}
                                        className="flex flex-col items-center gap-3 w-28 relative group"
                                      >
                                          <button
                                              onClick={() => !isLocked && handleSkillClick(skill)}
                                              disabled={isLocked}
                                              className={`
                                                  w-16 h-16 relative flex items-center justify-center transition-all duration-300 active:scale-95
                                                  ${isMastered 
                                                      ? 'text-black drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                                                      : isLearning
                                                          ? 'text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                                          : isLocked 
                                                              ? 'text-slate-900 opacity-80' 
                                                              : 'text-slate-700 hover:text-slate-600 hover:scale-110'
                                                  }
                                              `}
                                          >
                                              <Hexagon 
                                                  size={isMastered ? 64 : 58} 
                                                  strokeWidth={isMastered ? 0 : 2} 
                                                  className={`
                                                      transition-all duration-500
                                                      ${isMastered 
                                                          ? 'fill-yellow-500' 
                                                          : isLearning
                                                              ? 'fill-[#0b0c10] stroke-amber-500' 
                                                              : isLocked 
                                                                  ? 'fill-[#050505] stroke-slate-800' 
                                                                  : 'fill-[#0b0c10] stroke-slate-600'
                                                      }
                                                  `} 
                                              />
                                              {isNextUp && !isLearning && !isMastered && <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite] pointer-events-none scale-125" />}
                                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                  {isMastered ? <Trophy size={22} className="text-black fill-black/20" /> :
                                                   isLearning ? <Target size={24} strokeWidth={2} className="text-amber-500 animate-pulse" /> :
                                                   isLocked ? <Lock size={18} className="text-slate-700" /> :
                                                   <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />}
                                              </div>
                                          </button>
                                          <div className={`text-center transition-all duration-300 ${isLocked ? 'opacity-30 blur-[1px]' : 'opacity-100'}`}>
                                              <div className={`text-[10px] font-black uppercase leading-tight tracking-wide max-w-[90px] ${isMastered ? 'text-yellow-500' : isLearning ? 'text-amber-500' : isNextUp ? 'text-white' : 'text-slate-500'}`}>
                                                  {skill.name}
                                              </div>
                                              {isMastered ? (
                                                  <div className="text-[7px] font-bold text-yellow-500/80 uppercase tracking-widest mt-0.5">Mastered</div>
                                              ) : isLearning && (
                                                  <div className="text-[7px] font-bold text-amber-500/80 uppercase tracking-widest mt-0.5">In Progress</div>
                                              )}
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>

      {/* SKILL DETAIL MODAL - REFACTORED TO MATCH SCREENSHOT */}
      {selectedSkill && createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-view" onClick={(e) => e.stopPropagation()}>
              {/* Tactical Container */}
              <div className="w-full max-w-sm bg-[#080a0f] border-[4px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden max-h-[90vh] ring-1 ring-black/50">
                  
                  {/* Decorative Corner Screws */}
                  <div className="absolute top-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45" /></div>
                  <div className="absolute top-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45" /></div>
                  <div className="absolute bottom-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45" /></div>
                  <div className="absolute bottom-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20 flex items-center justify-center"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45" /></div>

                  {/* Header Area - Dark to match body for sleek look */}
                  <div className="relative z-10 shrink-0 bg-[#080a0f] p-6 pb-2 pt-8">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_6px_#ef4444]" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                                      {activeDiscipline} // T{selectedSkill.tier}
                                  </span>
                              </div>
                              <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-[0.85] font-sans drop-shadow-md">
                                  {selectedSkill.name}
                              </h2>
                          </div>
                          <button 
                            onClick={() => setSelectedSkill(null)} 
                            className="w-10 h-10 bg-[#1e293b] rounded-xl text-slate-400 hover:text-white border border-[#334155] active:scale-95 transition-all flex items-center justify-center shadow-lg"
                          >
                              <X size={20} />
                          </button>
                      </div>
                      
                      {/* Code Block Description */}
                      <div className="mt-4 bg-[#0f1218] p-4 rounded-lg border-l-4 border-indigo-500 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-10"><Activity size={24} /></div>
                          <p className="text-[11px] text-indigo-200 font-medium leading-relaxed font-mono relative z-10">
                              "{selectedSkill.description}"
                          </p>
                      </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto space-y-6 relative z-10 hide-scrollbar p-6 bg-[#080a0f]">
                      
                      {/* Video Uplink */}
                      <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1 pl-1">
                              <div className="w-1 h-3 bg-indigo-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Video Uplink</span>
                          </div>
                          <div className="aspect-video w-full bg-[#050505] rounded-xl overflow-hidden border-2 border-[#1e293b] relative group cursor-pointer shadow-inner">
                              {selectedSkill.tutorialUrl ? (
                                  <>
                                    <img src={`https://img.youtube.com/vi/${selectedSkill.tutorialUrl}/hqdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale hover:grayscale-0" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-2xl">
                                            <Play size={24} className="text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                    <a href={`https://www.youtube.com/watch?v=${selectedSkill.tutorialUrl}`} target="_blank" rel="noreferrer" className="absolute inset-0 z-20" />
                                  </>
                              ) : (
                                  <div className="flex flex-col items-center justify-center h-full text-slate-600 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] bg-[size:10px_10px]">
                                      <Video size={24} className="mb-2 opacity-50" />
                                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest">No Signal</span>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* Status Control */}
                      <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1 pl-1">
                              <div className="w-1 h-3 bg-indigo-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status Control</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              {/* Learning Toggle */}
                              {(() => {
                                const isLearning = user?.pendingSkills.includes(selectedSkill.id);
                                const isMastered = user?.masteredSkills.includes(selectedSkill.id);
                                return (
                                  <button 
                                    onClick={handleToggleLearning}
                                    disabled={isMastered}
                                    className={`p-4 rounded-xl border-[2px] flex flex-col gap-3 transition-all active:scale-95 text-left relative overflow-hidden group shadow-lg ${
                                        isLearning
                                        ? 'bg-amber-500/10 border-amber-500/50' 
                                        : isMastered 
                                            ? 'bg-[#0f1218] border-[#1e293b] opacity-50 cursor-not-allowed'
                                            : 'bg-[#0f1218] border-[#1e293b] hover:border-slate-600'
                                    }`}
                                  >
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${isLearning ? 'bg-amber-500 text-black border-amber-400' : 'bg-[#1e293b] text-slate-500 border-[#334155]'}`}>
                                          <BrainCircuit size={20} />
                                      </div>
                                      <div>
                                          <div className={`text-sm font-black uppercase tracking-wide ${isLearning ? 'text-amber-400' : 'text-slate-300'}`}>{isLearning ? 'Learning' : 'Start'}</div>
                                          <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{isLearning ? 'Tracking' : 'Add to List'}</div>
                                      </div>
                                  </button>
                                );
                              })()}

                              {/* Mastery Button */}
                              <button 
                                onClick={() => setIsUploadOpen(true)}
                                disabled={user?.masteredSkills.includes(selectedSkill.id)}
                                className={`p-4 rounded-xl border-[2px] flex flex-col gap-3 transition-all active:scale-95 text-left relative overflow-hidden group shadow-lg ${
                                    user?.masteredSkills.includes(selectedSkill.id)
                                    ? 'bg-indigo-500/10 border-indigo-500/50' 
                                    : 'bg-[#0f1218] border-[#1e293b] hover:border-indigo-500/50'
                                }`}
                              >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${user?.masteredSkills.includes(selectedSkill.id) ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-[#1e293b] text-slate-500 border-[#334155]'}`}>
                                      {user?.masteredSkills.includes(selectedSkill.id) ? <Trophy size={20} fill="currentColor" /> : <Upload size={20} />}
                                  </div>
                                  <div>
                                      <div className={`text-sm font-black uppercase tracking-wide ${user?.masteredSkills.includes(selectedSkill.id) ? 'text-indigo-400' : 'text-slate-300'}`}>Mastery</div>
                                      <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{user?.masteredSkills.includes(selectedSkill.id) ? 'Verified' : 'Upload Clip'}</div>
                                  </div>
                              </button>
                          </div>
                      </div>

                      {/* Recent Clears */}
                      <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-1 pl-1">
                              <div className="w-1 h-3 bg-indigo-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Clears</span>
                          </div>
                          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                              {[
                                  { user: 'Rohan', avatar: 'seed=Rohan' },
                                  { user: 'Priya', avatar: 'seed=Priya' },
                                  { user: 'Vikram', avatar: 'seed=Vikram' },
                                  { user: 'Ananya', avatar: 'seed=Ananya' }
                              ].map((item, i) => (
                                  <div key={i} className="w-20 shrink-0 flex flex-col gap-2 group cursor-pointer">
                                      <div className="aspect-[3/4] w-full rounded-lg bg-[#0f1218] border border-[#1e293b] relative overflow-hidden shadow-md group-hover:border-slate-500 transition-colors">
                                          <img src={`https://picsum.photos/seed/${selectedSkill.id}${i}/200/300`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                          <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1.5">
                                               <div className="w-4 h-4 rounded-full bg-slate-900 border border-white/10 overflow-hidden shrink-0">
                                                   <img src={`https://api.dicebear.com/7.x/pixel-art/svg?${item.avatar}`} className="w-full h-full" />
                                               </div>
                                               <span className="text-[7px] font-bold text-white truncate font-mono">{item.user}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>,
          document.body
      )}

      {selectedSkill && isUploadOpen && (
          <VideoUploadModal 
            title={`Verify: ${selectedSkill.name}`}
            description="Upload a clear clip of you landing this trick to prove mastery."
            onClose={() => setIsUploadOpen(false)}
            onUpload={handleUploadSuccess}
          />
      )}
    </div>
  );
};

export default SkillTree;
