import React from 'react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Check, 
  X, 
  Trash2, 
  Edit, 
  AlertCircle, 
  BarChart3, 
  Activity, 
  Database,
  Search,
  FileText,
  Play
} from 'lucide-react';
import { VerificationStatus } from '../types';
import { useAdmin } from '../features/admin';

interface AdminDashboardViewProps {
  onBack: () => void;
}

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBack }) => {
  const {
    spots,
    pendingMentorApplications,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleAction,
    handleDeleteSpot,
    handleReviewApp,
    pendingSpots,
    filteredSpots
  } = useAdmin();

  return (
    <div className="h-full overflow-y-auto hide-scrollbar pb-32 pt-safe-top space-y-8 px-4 animate-view min-h-full bg-[#020202] font-mono">
      {/* Header */}
      <header className="flex items-center gap-4 pt-4">
        <button 
          onClick={onBack}
          className="p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 active:scale-95 transition-all hover:text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white font-sans">Admin Portal</h1>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Management & Intelligence</p>
        </div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-4 gap-2">
        <div className="bg-[#0b0c10] border border-white/10 p-3 rounded-2xl space-y-1 relative overflow-hidden">
          <Database size={14} className="text-indigo-400" />
          <div className="text-lg font-black italic text-white font-sans">{spots.length}</div>
          <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Spots</div>
        </div>
        <div className="bg-[#0b0c10] border border-white/10 p-3 rounded-2xl space-y-1 relative overflow-hidden">
          <AlertCircle size={14} className="text-amber-500" />
          <div className="text-lg font-black italic text-white font-sans">{pendingSpots.length}</div>
          <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Verify</div>
        </div>
        <div className="bg-[#0b0c10] border border-white/10 p-3 rounded-2xl space-y-1 relative overflow-hidden">
          <Users size={14} className="text-blue-400" />
          <div className="text-lg font-black italic text-white font-sans">{pendingMentorApplications.length}</div>
          <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Apps</div>
        </div>
        <div className="bg-[#0b0c10] border border-white/10 p-3 rounded-2xl space-y-1 relative overflow-hidden">
          <Activity size={14} className="text-green-500" />
          <div className="text-lg font-black italic text-white font-sans">142</div>
          <div className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Active</div>
        </div>
      </section>

      {/* View Selector */}
      <div className="flex bg-[#0b0c10] p-1 rounded-2xl border border-white/10 overflow-x-auto hide-scrollbar">
        {['verifications', 'mentor-apps', 'spots', 'users'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t as any)}
            className={`flex-1 min-w-[80px] py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase italic tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck size={14} /> Verification Queue
            </h2>
            {pendingSpots.length === 0 ? (
              <div className="py-12 text-center bg-slate-900/30 rounded-[2rem] border border-slate-800 border-dashed">
                <Check size={32} className="mx-auto text-slate-700 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Queue is clear.</p>
              </div>
            ) : (
              pendingSpots.map(spot => (
                <div key={spot.id} className="bg-[#0b0c10] border-2 border-slate-800 p-6 rounded-[2rem] space-y-4 shadow-xl relative overflow-hidden group">
                  {/* Screws */}
                  <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-black uppercase italic tracking-tight text-white font-sans">{spot.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        <MapPin size={10} className="text-indigo-400" /> {spot.location.address}, {spot.state}
                      </p>
                    </div>
                    <span className="text-[8px] font-black uppercase bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20 tracking-wide">
                      {spot.type}
                    </span>
                  </div>

                  {spot.verificationNote && (
                    <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Submitter's Note:</p>
                      <p className="text-xs text-slate-300 italic font-medium">"{spot.verificationNote}"</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => handleAction(spot.id, VerificationStatus.REJECTED)}
                      className="flex-1 py-3 bg-slate-900 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform border border-white/5 hover:bg-slate-800"
                    >
                      <X size={14} /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(spot.id, VerificationStatus.VERIFIED)}
                      className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                    >
                      <Check size={14} /> Approve Spot
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'mentor-apps' && (
            <div className="space-y-4">
                <h2 className="text-xs font-black uppercase italic tracking-widest text-slate-400 flex items-center gap-2">
                    <FileText size={14} /> Mentor Requests
                </h2>
                {pendingMentorApplications.length === 0 ? (
                    <div className="py-12 text-center bg-slate-900/30 rounded-[2rem] border border-slate-800 border-dashed">
                        <Check size={32} className="mx-auto text-slate-700 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">No pending applications.</p>
                    </div>
                ) : (
                    pendingMentorApplications.map(({ user, application }, idx) => (
                        <div key={idx} className="bg-[#0b0c10] border-2 border-slate-800 p-6 rounded-[2rem] space-y-4 shadow-xl relative">
                            {/* Screws */}
                            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
                            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />

                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden">
                                    <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase italic text-white leading-none tracking-tight font-sans">{user.name}</h3>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Level {user.level} • {user.location}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest mb-1">Experience</p>
                                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{application.experience}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest mb-1">Style</p>
                                        <p className="text-xs text-slate-300 font-bold uppercase">{application.style}</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest mb-1">Rate</p>
                                        <p className="text-xs text-slate-300 font-mono">₹{application.rate}/hr</p>
                                    </div>
                                </div>
                                
                                <div className="bg-[#111] rounded-xl p-3 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Play size={14} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Demo Reel</span>
                                    </div>
                                    <button className="text-[9px] font-black uppercase text-indigo-400 hover:text-white">View</button>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button 
                                onClick={() => handleReviewApp(user.id, false)}
                                className="flex-1 py-3 bg-slate-900 text-red-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform border border-white/5 hover:bg-slate-800"
                                >
                                <X size={14} /> Deny
                                </button>
                                <button 
                                onClick={() => handleReviewApp(user.id, true)}
                                className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                                >
                                <Check size={14} /> Approve
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {/* SPOTS MANAGEMENT TAB */}
        {activeTab === 'spots' && (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4 bg-[#080808] p-3 rounded-xl border border-white/10">
                    <Search size={14} className="text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="SEARCH SPOTS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-[10px] font-bold text-white uppercase tracking-widest w-full placeholder:text-slate-700"
                    />
                </div>
                
                {filteredSpots.map(spot => (
                    <div key={spot.id} className="bg-[#0b0c10] border border-white/10 p-4 rounded-xl flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-900 rounded-lg overflow-hidden border border-white/5">
                                <img src={spot.images[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black uppercase text-white italic tracking-tight">{spot.name}</h4>
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{spot.state}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleDeleteSpot(spot.id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 size={14} />
                            </button>
                            <button className="p-2 text-slate-600 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                <Edit size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* USERS TAB (Placeholder) */}
        {activeTab === 'users' && (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-900/10 rounded-2xl border border-slate-800 border-dashed">
                <Users size={32} className="text-slate-700 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">User Management Module Offline</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboardView;
