
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullscreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "LOADING...", fullscreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Loader2 className="animate-spin text-indigo-500" size={32} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">
        {message}
      </span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#020202]">
        {content}
      </div>
    );
  }

  return content;
};
