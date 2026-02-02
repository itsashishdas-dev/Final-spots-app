
import React from 'react';
import { Calendar, Clock, MapPin, Check, UserPlus } from 'lucide-react';
import { ExtendedSession, Discipline } from '../types';

interface SessionCardProps {
  session: ExtendedSession;
  isJoined: boolean;
  onJoin: (e: React.MouseEvent) => void;
  onClick: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, isJoined, onJoin, onClick }) => {
  const isSkate = session.spotType === Discipline.SKATE;

  return (
    <div 
      onClick={onClick}
      className="bg-[#0b0c10] border-2 border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between group cursor-pointer hover:border-indigo-500/30 transition-all shadow-xl relative overflow-hidden w-full active:scale-[0.98]"
    >
      {/* Screws */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full shadow-sm" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full shadow-sm" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full shadow-sm" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full shadow-sm" />

      {/* Decorative gradient */}
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-[60px] opacity-5 pointer-events-none -mr-10 -mt-10 ${isSkate ? 'bg-indigo-500' : 'bg-amber-500'}`} />

      <div className="space-y-4 relative z-10">
        {/* Date/Time Tags */}
        <div className="flex gap-2">
             <div className="bg-[#151515] border border-white/5 px-2 py-1 rounded-md flex items-center gap-2">
               <Calendar size={10} className="text-slate-500" />
               <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300">{session.date}</span>
             </div>
             <div className="bg-[#151515] border border-white/5 px-2 py-1 rounded-md flex items-center gap-2">
               <Clock size={10} className={isSkate ? "text-indigo-400" : "text-amber-400"} />
               <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-300">{session.time}</span>
             </div>
        </div>

        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-[0.9] line-clamp-2 mb-2 group-hover:text-indigo-400 transition-colors">
            {session.title}
          </h3>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            <MapPin size={10} className="text-slate-600" />
            <span className="truncate max-w-[200px] border-b border-dashed border-slate-700 pb-0.5">{session.spotName}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 flex items-center justify-between gap-3 relative z-10 border-t border-white/5 mt-4">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${session.userId}`} alt={session.userName} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Host</span>
              <span className="text-[9px] text-white font-black uppercase italic tracking-wide">{session.userName}</span>
            </div>
         </div>

         <button 
           onClick={onJoin}
           className={`h-10 px-5 rounded-lg flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg border ${
             isJoined 
             ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
             : 'bg-white text-black hover:bg-slate-200 border-white'
           }`}
         >
           {isJoined ? <Check size={12} strokeWidth={3} /> : <UserPlus size={12} strokeWidth={3} />}
           {isJoined ? 'JOINED' : 'JOIN'}
         </button>
      </div>
    </div>
  );
};

export default SessionCard;
