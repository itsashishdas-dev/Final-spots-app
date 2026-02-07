
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-view w-full">
    <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-800 shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/0 to-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon size={32} className="text-slate-600 relative z-10" />
    </div>
    <div className="space-y-2 max-w-xs mx-auto px-4">
      <h3 className="text-white font-black italic uppercase tracking-tight text-xl">{title}</h3>
      <p className="text-slate-500 text-xs font-medium leading-relaxed">{description}</p>
    </div>
    {actionLabel && onAction && (
      <button 
        onClick={onAction}
        className="mt-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 border border-slate-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
);
