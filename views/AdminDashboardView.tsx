
import React, { useState } from 'react';
import { 
  ChevronLeft, ShieldCheck, MapPin, Users, Check, X, Trash2, Settings, 
  AlertCircle, Activity, Database, Search, Plus, Swords, Flag
} from 'lucide-react';
import { VerificationStatus, Spot } from '../types';
import { useAdmin } from '../features/admin';
import EditSpotModal from '../components/EditSpotModal';
import { useAppStore } from '../store';

interface AdminDashboardViewProps {
  onBack: () => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBack }) => {
  const {
    spots,
    challenges,
    crews,
    pendingMentorApplications,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleAction,
    handleDeleteSpot,
    handleDeleteChallenge,
    handleDeleteCrew,
    handleReviewApp,
    handleAddSpot,
    selectSpot,
    pendingSpots,
    filteredSpots,
    filteredChallenges,
    filteredCrews
  } = useAdmin();

  const [editingSpot, setEditingSpot] = useState<Spot | null>(null);
  const { updateSpot } = useAppStore();

  const openEdit = (spot: Spot) => {
      setEditingSpot(spot);
      selectSpot(spot);
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-32 pt-safe-top space-y-8 px-4 animate-view min-h-full bg-[#000000] font-mono">
      {/* Header - Matching Screenshot */}
      <header className="flex items-center gap-4 pt-6">
        <button 
          onClick={onBack}
          className="w-12 h-12 bg-[#0d121f] border border-white/5 rounded-xl flex items-center justify-center text-slate-400 active:scale-95 transition-all shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-none font-sans italic">Command</h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.3em] mt-1">System Admin</p>
        </div>
      </header>

      {/* Quick Stats Matrix - Matching Screenshot */}
      <section className="grid grid-cols-4 gap-3">
        <div className="bg-[#0b0c10] border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden group">
          <Database size={16} className="text-blue-400 opacity-60" />
          <div>
            <div className="text-2xl font-black italic text-white font-sans">{spots.length}</div>
            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Spots</div>
          </div>
          <MapPin size={48} className="absolute -right-2 -bottom-2 opacity-5 text-white" />
        </div>
        
        <div className="bg-[#0b0c10] border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden group">
          <Swords size={16} className="text-red-500 opacity-60" />
          <div>
            <div className="text-2xl font-black italic text-white font-sans">{challenges.length}</div>
            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Bounties</div>
          </div>
          <Swords size={48} className="absolute -right-2 -bottom-2 opacity-5 text-white" />
        </div>

        <div className="bg-[#0b0c10] border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden group">
          <Users size={16} className="text-blue-400 opacity-60" />
          <div>
            <div className="text-2xl font-black italic text-white font-sans">{crews.length}</div>
            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Units</div>
          </div>
          <ShieldCheck size={48} className="absolute -right-2 -bottom-2 opacity-5 text-white" />
        </div>

        <div className="bg-[#0b0c10] border border-white/5 p-4 rounded-2xl flex flex-col justify-between h-28 relative overflow-hidden group">
          <AlertCircle size={16} className="text-amber-500 opacity-60" />
          <div>
            <div className="text-2xl font-black italic text-white font-sans">{pendingSpots.length}</div>
            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Pending</div>
          </div>
        </div>
      </section>

      {/* Tabs - Matching Screenshot */}
      <div className="bg-[#080a0f] p-1.5 rounded-2xl border border-white/5 flex gap-1">
        {[
            { id: 'verifications', label: 'Alerts', icon: AlertCircle }, 
            { id: 'spots', label: 'Spots', icon: MapPin }, 
            { id: 'challenges', label: 'Ops', icon: Swords }, 
            { id: 'crews', label: 'Units', icon: Users }
        ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
                <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isActive ? 'bg-[#5e5ce6] text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                    <Icon size={14} className={isActive ? 'text-white' : 'text-slate-600'} /> {t.label}
                </button>
            )
        })}
      </div>

      {/* Search & Add - Matching Screenshot */}
      <div className="flex gap-3">
        <div className="flex-1 bg-[#080a0f] border border-white/5 rounded-2xl flex items-center px-4 h-14 focus-within:border-indigo-500/50 transition-colors">
            <Search size={18} className="text-slate-600 mr-3" />
            <input 
                type="text" 
                placeholder="SEARCH SPOTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-black text-white uppercase tracking-widest w-full placeholder:text-slate-700"
            />
        </div>
        <button 
            onClick={handleAddSpot}
            className="w-14 h-14 bg-[#00a86b] rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"
        >
            <Plus size={28} strokeWidth={3} />
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="space-y-3">
        {activeTab === 'spots' && filteredSpots.map(spot => (
            <div key={spot.id} className="bg-[#0b0c10] border border-white/5 p-5 rounded-[1.25rem] flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-[#12161f] rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-inner">
                        <img src={spot.images[0]} className="w-full h-full object-cover grayscale opacity-60" alt="" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-black uppercase text-white italic tracking-tight truncate">{spot.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{spot.type}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full" />
                            <span className="text-[8px] font-black text-slate-600 uppercase truncate tracking-widest">{spot.location.address?.split(',')[0]}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 pl-4 shrink-0">
                    <button onClick={() => handleDeleteSpot(spot.id)} className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-red-500 bg-white/5 rounded-lg transition-colors">
                        <Trash2 size={16} />
                    </button>
                    <button onClick={() => openEdit(spot)} className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-indigo-400 bg-white/5 rounded-lg transition-colors">
                        <Settings size={16} />
                    </button>
                </div>
            </div>
        ))}

        {activeTab === 'verifications' && pendingSpots.map(spot => (
            <div key={spot.id} className="bg-[#0b0c10] border border-amber-500/20 p-5 rounded-[1.25rem] mb-3">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="text-sm font-black italic uppercase text-white leading-none">{spot.name}</h3>
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">{spot.state} Sector</span>
                    </div>
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">NEW SIGNAL</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleAction(spot.id, VerificationStatus.REJECTED)} className="flex-1 py-3 bg-[#111] border border-white/5 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">Discard</button>
                    <button onClick={() => handleAction(spot.id, VerificationStatus.VERIFIED)} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Verify Intel</button>
                </div>
            </div>
        ))}

        {/* Fallback for empty state */}
        {activeTab === 'spots' && filteredSpots.length === 0 && (
            <div className="py-12 text-center bg-[#080a0f] rounded-2xl border border-white/5 border-dashed">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">No Data Entries Found</p>
            </div>
        )}
      </div>

      {editingSpot && (
          <EditSpotModal 
            spot={editingSpot}
            onClose={() => setEditingSpot(null)}
            onSave={updateSpot}
          />
      )}
    </div>
  );
};

export default AdminDashboardView;
