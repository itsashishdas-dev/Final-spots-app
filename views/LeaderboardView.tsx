
import React, { useState } from 'react';
import { Discipline, BadgeTier } from '../types';
import { Trophy, Medal, Crown, Shield, Hexagon, ChevronRight, Search } from 'lucide-react';

const LeaderboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Discipline>(Discipline.SKATE);

  const users = [
    { rank: 1, name: 'Rahul V.', score: 14500, tier: BadgeTier.LEGEND, change: 'up' },
    { rank: 2, name: 'Simran K.', score: 12200, tier: BadgeTier.VETERAN, change: 'same' },
    { rank: 3, name: 'Anish G.', score: 9800, tier: BadgeTier.SKILLED, change: 'down' },
    { rank: 4, name: 'Vikram S.', score: 7500, tier: BadgeTier.SKILLED, change: 'up' },
    { rank: 5, name: 'Priya M.', score: 7200, tier: BadgeTier.INITIATE, change: 'same' }
  ];

  const getRankIcon = (rank: number) => {
      if (rank === 1) return <Crown size={20} className="text-black fill-black/20" />;
      if (rank === 2) return <Medal size={20} className="text-black fill-black/20" />;
      if (rank === 3) return <Medal size={20} className="text-black fill-black/20" />;
      return <span className="text-sm font-black text-slate-500 font-mono">#{rank.toString().padStart(2, '0')}</span>;
  };

  const getRankColor = (rank: number) => {
      if (rank === 1) return 'bg-yellow-500 border-yellow-400 text-black';
      if (rank === 2) return 'bg-slate-300 border-slate-200 text-black';
      if (rank === 3) return 'bg-amber-700 border-amber-600 text-white';
      return 'bg-slate-900 border-slate-800 text-slate-500';
  };

  return (
    <div className="pb-32 pt-safe-top px-6 animate-view w-full bg-[#020202] min-h-full font-mono flex flex-col">
      
      {/* HEADER */}
      <header className="mb-6 pt-4 shrink-0">
        <div className="flex justify-between items-end mb-4">
            <div>
                <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-[0.85] mb-1 font-sans">Sector<br/>Rankings</h1>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Trophy size={12} /> Top Operatives
                </p>
            </div>
        </div>

        {/* TABS */}
        <div className="flex bg-[#0b0c10] p-1 rounded-2xl border border-white/10 overflow-hidden shadow-lg">
            <button 
                onClick={() => setActiveTab(Discipline.SKATE)} 
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === Discipline.SKATE ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Street
            </button>
            <button 
                onClick={() => setActiveTab(Discipline.DOWNHILL)} 
                className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === Discipline.DOWNHILL ? 'bg-white text-black shadow-lg scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Downhill
            </button>
        </div>
      </header>

      {/* SEARCH (Optional, visual only for now) */}
      <div className="relative mb-6 shrink-0 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="FIND RIDER..." 
            className="w-full bg-[#0b0c10] border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold text-white uppercase tracking-widest focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700"
          />
      </div>

      {/* LIST */}
      <div className="space-y-4 flex-1 overflow-y-auto hide-scrollbar pb-24">
          {users.map((u) => (
              <div 
                key={u.rank} 
                className="bg-[#0b0c10] border-2 border-slate-800 rounded-[1.5rem] p-4 flex items-center gap-4 relative overflow-hidden group active:scale-[0.98] transition-all"
              >
                  {/* Screws */}
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                  {/* Rank Box */}
                  <div className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 shadow-inner shrink-0 ${getRankColor(u.rank)}`}>
                      {getRankIcon(u.rank)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-black italic uppercase text-white tracking-wide truncate font-sans">{u.name}</h3>
                          {u.rank <= 3 && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_5px_#6366f1]" />}
                      </div>
                      <div className="flex items-center gap-2">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">
                              {u.tier}
                          </span>
                      </div>
                  </div>

                  {/* Score */}
                  <div className="text-right z-10">
                      <div className="text-sm font-mono font-bold text-white tracking-tight">{(u.score).toLocaleString()}</div>
                      <div className="text-[7px] font-black text-slate-600 uppercase tracking-widest">XP Total</div>
                  </div>

                  {/* Scanline Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </div>
          ))}
      </div>
    </div>
  );
};

export default LeaderboardView;
