
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Upload, X, CheckCircle2, Loader2, Video, AlertTriangle, Cpu, Wifi } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { playSound } from '../utils/audio';

interface VideoUploadModalProps {
  title: string;
  description: string;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ title, description, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<'IDLE' | 'ANALYZING' | 'UPLOADING' | 'VERIFYING'>('IDLE');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsVideoLoaded(false);
      triggerHaptic('light');
      playSound('click');
    }
  };

  const simulateProgress = async () => {
      // Stage 1: Analysis (Fast)
      setUploadStage('ANALYZING');
      for(let i=0; i<=30; i+=5) {
          setUploadProgress(i);
          await new Promise(r => setTimeout(r, 50));
      }

      // Stage 2: Upload (Variable)
      setUploadStage('UPLOADING');
      for(let i=30; i<=85; i+=Math.random()*15) {
          setUploadProgress(Math.min(i, 85));
          if (Math.random() > 0.7) playSound('data_stream');
          await new Promise(r => setTimeout(r, 100));
      }

      // Stage 3: Verify (Pause then finish)
      setUploadStage('VERIFYING');
      await new Promise(r => setTimeout(r, 400));
      setUploadProgress(100);
      triggerHaptic('success');
      playSound('success');
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    triggerHaptic('medium');
    
    try {
      // Run simulation parallel to actual (mock) upload
      await Promise.all([
          onUpload(selectedFile),
          simulateProgress()
      ]);
      onClose();
    } catch (e) {
      console.error(e);
      triggerHaptic('error');
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage('IDLE');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-view" onClick={(e) => e.stopPropagation()}>
      
      <div className="w-full max-w-sm bg-[#080a0f] border-[4px] border-[#1e293b] rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden font-mono ring-1 ring-black/50">
        
        {/* Screws */}
        <div className="absolute top-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
        <div className="absolute top-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
        <div className="absolute bottom-3 left-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>
        <div className="absolute bottom-3 right-3 w-2 h-2 bg-[#334155] rounded-full z-20"><div className="w-1.5 h-0.5 bg-[#0f172a] rotate-45 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /></div>

        {/* ID Stamp */}
        <div className="absolute top-6 right-6 text-[9px] font-black uppercase tracking-widest text-[#334155] z-20 pointer-events-none">
            UPLOAD_SEQ_01
        </div>

        {/* Header */}
        <div className="bg-[#080a0f] border-b-2 border-[#1e293b] p-6 pt-8 relative z-10">
            <div className="flex justify-between items-start mb-2">
                <div className="w-8 h-0.5 bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                <button 
                    onClick={onClose} 
                    className="w-8 h-8 bg-[#1e293b] rounded-lg text-slate-400 border border-[#334155] flex items-center justify-center hover:text-white transition-colors active:scale-90 shadow-md"
                >
                    <X size={16} />
                </button>
            </div>
            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter mb-2 leading-[0.85] font-sans drop-shadow-md">
               {title}
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] leading-relaxed border-l-2 border-[#1e293b] pl-3">
               {description}
            </p>
        </div>

        {/* Upload Zone */}
        <div className="flex-1 space-y-4 relative z-10 p-6 bg-[#080a0f]">
          {!previewUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video w-full rounded-2xl border-2 border-dashed border-[#334155] bg-[#0f1218] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#1e293b] hover:border-indigo-500/50 transition-all group relative overflow-hidden active:scale-[0.98]"
            >
               <div className="w-12 h-12 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10">
                   <Upload size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
               </div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors relative z-10">Tap to Select Clip</p>
               <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
            </div>
          ) : (
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden border border-[#334155] shadow-lg group">
               {/* Skeleton Loader while video loads */}
               {!isVideoLoaded && (
                   <div className="absolute inset-0 bg-[#0f1218] flex flex-col items-center justify-center z-20 animate-pulse">
                       <Loader2 size={32} className="text-indigo-500 animate-spin mb-2" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Processing Media...</span>
                   </div>
               )}
               
               <video 
                 src={previewUrl} 
                 className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-80' : 'opacity-0'}`} 
                 autoPlay 
                 muted 
                 loop 
                 playsInline
                 onLoadedData={() => setIsVideoLoaded(true)}
               />
               
               {/* Analysis Overlay Effect */}
               {isVideoLoaded && !isUploading && (
                   <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]">
                       <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                           <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                           <span className="text-[7px] font-mono text-green-400">READY_TO_SEND</span>
                       </div>
                   </div>
               )}

               {!isUploading && (
                   <button 
                     onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                     className="absolute bottom-4 right-4 bg-red-900/80 text-red-100 border border-red-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg backdrop-blur-md hover:bg-red-800 transition-colors z-30"
                   >
                     Remove
                   </button>
               )}
            </div>
          )}

          {/* Warning Box */}
          {!isUploading && (
            <div className="bg-[#0f1218] border-l-4 border-amber-500 p-4 rounded-r-xl flex gap-3 items-start animate-view">
                <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Proof Required</p>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                        Moderators will review this clip. Ensure the trick is landed clean and the spot is visible.
                    </p>
                </div>
            </div>
          )}

          <div className="mt-6">
                <button 
                onClick={handleSubmit}
                disabled={!selectedFile || isUploading}
                className={`w-full h-14 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all relative overflow-hidden group ${
                    !selectedFile 
                    ? 'bg-[#1e293b] text-slate-500 cursor-not-allowed border border-[#334155]' 
                    : isUploading 
                        ? 'bg-[#0f1218] border border-indigo-500/30'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500 active:scale-95'
                }`}
                >
                    {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Progress Bar Background */}
                            <div className="absolute inset-y-0 left-0 bg-indigo-900/30 w-full" />
                            {/* Active Progress */}
                            <div 
                                className="absolute inset-y-0 left-0 bg-indigo-600/50 transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                                style={{ width: `${uploadProgress}%` }} 
                            />
                            
                            {/* Status Text */}
                            <div className="relative z-10 flex items-center gap-2">
                                {uploadStage === 'ANALYZING' && <Cpu size={14} className="text-indigo-400 animate-pulse" />}
                                {uploadStage === 'UPLOADING' && <Wifi size={14} className="text-indigo-400 animate-pulse" />}
                                {uploadStage === 'VERIFYING' && <CheckCircle2 size={14} className="text-emerald-400 animate-pulse" />}
                                <span className="text-white drop-shadow-md">
                                    {uploadStage === 'ANALYZING' ? 'COMPRESSING...' : 
                                     uploadStage === 'UPLOADING' ? `TRANSMITTING ${Math.floor(uploadProgress)}%` : 
                                     uploadStage === 'VERIFYING' ? 'FINALIZING...' : 'PROCESSING'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 size={14} />
                            <span>Submit For Review</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VideoUploadModal;
