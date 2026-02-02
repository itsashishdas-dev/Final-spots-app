
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, MapPin, Swords, Users, Zap, ScanLine, Wifi, Shield, ChevronRight, Fingerprint, Crosshair, Globe } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { initAudio, playSound } from '../utils/audio';

interface LoginViewProps {
  onLogin: () => void;
  onShowPrivacy: () => void;
}

const FEATURES = [
  { 
    id: 'MAP', 
    label: 'SECTOR SCAN', 
    sub: 'LOCATE SPOTS', 
    icon: MapPin, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/30' 
  },
  { 
    id: 'BATTLE', 
    label: 'PVP PROTOCOL', 
    sub: 'CLAIM TERRITORY', 
    icon: Swords, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/30' 
  },
  { 
    id: 'CREW', 
    label: 'UNIT LINK', 
    sub: 'FORM SQUAD', 
    icon: Users, 
    color: 'text-indigo-400', 
    bg: 'bg-indigo-500/10', 
    border: 'border-indigo-500/30' 
  },
  { 
    id: 'SKILL', 
    label: 'TECH TREE', 
    sub: 'UPGRADE SKILLS', 
    icon: Zap, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10', 
    border: 'border-yellow-500/30' 
  }
];

const LOG_MESSAGES = [
    "ENCRYPTED_CONNECTION_ESTABLISHED",
    "DOWNLOADING_TOPOGRAPHY_DATA...",
    "SYNCING_LOCAL_NODE: MUMBAI_SERVER",
    "VERIFYING_OPERATIVE_CREDENTIALS...",
    "WEATHER_SCAN: OPTIMAL_TRACTION",
    "SYSTEM_INTEGRITY: 100%"
];

const HoloGlobe = () => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none z-0 opacity-20">
        <div className="w-full h-full relative animate-[spin_40s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            {/* Core Sphere */}
            <div className="absolute inset-[15%] rounded-full border border-slate-700/50" />
            
            {/* Rotating Rings (Simulating 3D wireframe) */}
            {[0, 60, 120].map((deg, i) => (
                <div 
                    key={i}
                    className="absolute inset-0 rounded-full border border-slate-600/30"
                    style={{ transform: `rotateY(${deg}deg)` }}
                />
            ))}
             {[0, 45, 90, 135].map((deg, i) => (
                <div 
                    key={`lat-${i}`}
                    className="absolute inset-0 rounded-full border border-slate-600/20"
                    style={{ transform: `rotateX(${deg}deg)` }}
                />
            ))}
            
            {/* Equatorial Ring */}
            <div className="absolute inset-[-10%] rounded-full border border-indigo-500/20 border-dashed animate-[spin_20s_linear_infinite_reverse]" />
        </div>
    </div>
);

// --- TACTICAL TEXT COMPONENT ---
const CypherTitle = () => {
  const TARGET = "SPOTS";
  const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_[]#";
  const [display, setDisplay] = useState(TARGET);
  const [glitchIndex, setGlitchIndex] = useState<number | null>(null);
  const [offset, setOffset] = useState({ r: 0, c: 0 }); // Red/Cyan offsets

  // 1. Initial Decryption Effect
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev => 
        prev.split("").map((letter, index) => {
          if (index < iteration) return TARGET[index];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      
      if (iteration >= TARGET.length) clearInterval(interval);
      iteration += 1/3;
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  // 2. Continuous Dynamic Glitch Loop
  useEffect(() => {
      let frameId: number;
      const loop = () => {
          // Random twitch offset for chromatic aberration
          if (Math.random() > 0.95) {
              setOffset({
                  r: (Math.random() - 0.5) * 4,
                  c: (Math.random() - 0.5) * 4
              });
          } else {
              // Drift back to zero
              setOffset(prev => ({
                  r: prev.r * 0.9,
                  c: prev.c * 0.9
              }));
          }

          // Random char replacement
          if (Math.random() > 0.98) {
             const idx = Math.floor(Math.random() * TARGET.length);
             setGlitchIndex(idx);
             // Occasional glitch sound for immersion
             if (Math.random() > 0.7) playSound('glitch');
             setTimeout(() => setGlitchIndex(null), 50);
          }

          frameId = requestAnimationFrame(loop);
      };
      loop();
      return () => cancelAnimationFrame(frameId);
  }, []);

  const handleInteraction = () => {
      initAudio(); // Initialize audio engine on click
      playSound('glitch');
      triggerHaptic('medium');
      
      // Force visual glitch
      const idx = Math.floor(Math.random() * TARGET.length);
      setGlitchIndex(idx);
      setOffset({ r: 5, c: -5 }); // Stronger shift
      setTimeout(() => {
          setGlitchIndex(null);
          setOffset({ r: 0, c: 0 });
      }, 200);
  };

  return (
    <div 
        onClick={handleInteraction}
        className="relative group cursor-pointer text-center mb-20 scale-110 md:scale-125 select-none active:scale-[1.3] transition-transform duration-100"
    >
        {/* Main Text */}
        <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white leading-none relative z-20 mix-blend-screen font-sans flex justify-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            {display.split('').map((char, i) => (
                <span key={i} className={`inline-block relative ${i === glitchIndex ? 'text-indigo-200' : ''}`}>
                    {i === glitchIndex ? CHARS[Math.floor(Math.random() * CHARS.length)] : char}
                </span>
            ))}
        </h1>
        
        {/* Cyan Layer - Glitch Offset */}
        <h1 className="absolute top-0 left-0 right-0 text-7xl md:text-8xl font-black italic tracking-tighter text-cyan-400 opacity-70 leading-none pointer-events-none z-10 font-sans flex justify-center mix-blend-screen" 
            style={{ transform: `translate(${offset.c - 2}px, ${offset.c}px)` }}>
            {TARGET}
        </h1>
        
        {/* Red Layer - Glitch Offset */}
        <h1 className="absolute top-0 left-0 right-0 text-7xl md:text-8xl font-black italic tracking-tighter text-red-500 opacity-70 leading-none pointer-events-none z-10 font-sans flex justify-center mix-blend-screen" 
            style={{ transform: `translate(${offset.r + 2}px, ${offset.r}px)` }}>
            {TARGET}
        </h1>

        {/* Scanline Overlay on Text */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_3px,3px_100%] z-30 pointer-events-none mix-blend-overlay" />

        {/* Sub-header with connecting lines */}
        <div className="flex items-center justify-center gap-3 mt-6 opacity-80 relative z-20">
            <div className="h-px w-4 bg-gradient-to-r from-transparent to-indigo-500"></div>
            <div className="h-[2px] w-[2px] bg-indigo-400 rounded-full shadow-[0_0_4px_#6366f1]"></div>
            <p className="text-indigo-400 font-bold text-[10px] tracking-[0.5em] uppercase shadow-indigo-500/50 drop-shadow-sm font-mono">
                Core Skate Network
            </p>
            <div className="h-[2px] w-[2px] bg-indigo-400 rounded-full shadow-[0_0_4px_#6366f1]"></div>
            <div className="h-px w-4 bg-gradient-to-l from-transparent to-indigo-500"></div>
        </div>
    </div>
  );
};

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onShowPrivacy }) => {
  const [mounted, setMounted] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Hold Button Logic
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    
    // Cycle features
    const interval = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveFeatureIndex(prev => (prev + 1) % FEATURES.length);
            setIsTransitioning(false);
        }, 200); 
    }, 3500); 
    
    return () => clearInterval(interval);
  }, []);

  // Hold Interaction Loop
  const animateHold = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const duration = 1200; // 1.2 seconds to unlock
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      
      setProgress(newProgress);

      // Haptic & Sound Tick every 10%
      const currentBlock = Math.floor(newProgress / 10);
      if (currentBlock > lastProgressRef.current && newProgress < 100) {
           triggerHaptic('light'); 
           playSound('data_stream'); // Interactive feedback
           lastProgressRef.current = currentBlock;
      }

      if (newProgress < 100) {
          requestRef.current = requestAnimationFrame(animateHold);
      } else {
          handleComplete();
      }
  };

  const startHold = (e: React.TouchEvent | React.MouseEvent) => {
      if (isComplete) return;
      initAudio(); 
      setIsHolding(true);
      startTimeRef.current = 0;
      lastProgressRef.current = 0;
      requestRef.current = requestAnimationFrame(animateHold);
  };

  const endHold = () => {
      if (isComplete) return;
      setIsHolding(false);
      setProgress(0);
      lastProgressRef.current = 0;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const handleComplete = () => {
      setIsComplete(true);
      setIsHolding(false);
      playSound('uplink_init');
      triggerHaptic('success');
      setTimeout(onLogin, 800); 
  };

  const activeFeature = FEATURES[activeFeatureIndex];

  return (
    <div className="relative h-screen w-full bg-[#020202] flex flex-col justify-between overflow-hidden font-mono isolate select-none">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 z-0 opacity-[0.15]" 
           style={{ 
             backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }}>
      </div>
      
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] z-10 pointer-events-none transition-all duration-500 ${isHolding ? 'scale-90 opacity-80' : 'scale-100 opacity-100'}`} />
      
      <HoloGlobe />

      {/* --- HUD HEADER --- */}
      <div className="relative z-20 flex justify-between px-6 pt-[calc(env(safe-area-inset-top)+1rem)] text-[9px] font-bold tracking-widest text-slate-500">
          <div className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                  <Wifi size={10} className={isHolding ? "text-indigo-500 animate-pulse" : ""} /> 
                  NET: {isHolding ? 'HANDSHAKE...' : 'ONLINE'}
              </span>
              <span className="flex items-center gap-2">
                  <Shield size={10} /> 
                  SECURE: {isComplete ? 'VERIFIED' : 'PENDING'}
              </span>
          </div>
          <div className="text-right flex flex-col gap-1">
              <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              <span>LOC: IND-SECTOR</span>
          </div>
      </div>

      {/* --- MAIN CONTENT CENTER --- */}
      <div className={`relative z-20 flex flex-col items-center flex-1 justify-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* LOGO - Enhanced Cypher Animation */}
        <CypherTitle />

        {/* FEATURE DISPLAY - Mechanical Slide Effect */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-12 h-32">
            
            <div className={`
                transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center
                ${isTransitioning ? 'opacity-0 scale-90 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
            `}>
                {/* Icon Container */}
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 border bg-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden ${activeFeature.color} ${activeFeature.border} ${activeFeature.bg}`}>
                    {/* Inner Scanline for Icon */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-[-100%] animate-[scan_2s_linear_infinite]" />
                    <activeFeature.icon size={40} strokeWidth={1.5} className="relative z-10" />
                </div>
                
                {/* Text Info */}
                <div className="text-center space-y-2">
                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${activeFeature.color}`}>
                        {activeFeature.label}
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-widest font-sans italic">
                        {activeFeature.sub}
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* --- FOOTER CONTROLS --- */}
      <div className={`relative z-20 pb-safe-bottom w-full transition-all duration-1000 delay-200 flex flex-col items-center gap-6 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* INTERACTION PAD */}
          <div className="px-6 w-full max-w-sm relative">
              <button 
                className={`
                    relative w-full h-20 bg-[#0a0a0a] rounded-xl overflow-hidden cursor-pointer select-none transition-all duration-300 group
                    ${isHolding ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-[0.98]' : 'border border-slate-800 hover:border-slate-600'}
                `}
                onMouseDown={startHold}
                onMouseUp={endHold}
                onMouseLeave={endHold}
                onTouchStart={startHold}
                onTouchEnd={endHold}
                onContextMenu={(e) => e.preventDefault()}
              >
                  {/* Fill Progress Bar (Left to Right) */}
                  <div 
                    className="absolute inset-0 bg-white/10 transition-all duration-75 ease-linear origin-left"
                    style={{ width: `${progress}%` }}
                  />
                  
                  {/* Fingerprint / Icon */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 z-10 pointer-events-none">
                      {isComplete ? (
                          <>
                            <Shield className="text-emerald-400 animate-bounce" size={24} />
                            <span className="font-black uppercase tracking-[0.25em] text-emerald-400 text-xs">Uplink Secured</span>
                          </>
                      ) : (
                          <>
                            <div className={`p-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm transition-all ${isHolding ? 'text-white scale-110 border-indigo-500' : 'text-slate-500'}`}>
                                <Fingerprint size={28} className={isHolding ? 'animate-pulse text-indigo-400' : ''} />
                            </div>
                            <div className="flex flex-col items-start">
                                <span className={`font-black uppercase tracking-[0.2em] text-xs transition-colors ${isHolding ? 'text-white' : 'text-slate-200'}`}>
                                    {isHolding ? 'INITIALIZING...' : 'INITIALIZE'}
                                </span>
                                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">
                                    Hold to Connect
                                </span>
                            </div>
                          </>
                      )}
                  </div>

                  {/* Scanline Overlay on Button */}
                  {isHolding && <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#6366f1_2px,#6366f1_4px)] opacity-10 animate-[scan_1s_linear_infinite]" />}
              </button>
              
              {/* Privacy Link */}
              <div className="flex justify-center mt-4">
                  <button onClick={onShowPrivacy} className="text-[8px] text-slate-600 hover:text-indigo-400 font-bold uppercase tracking-widest transition-colors flex items-center gap-1 p-2">
                      [ VIEW PROTOCOLS ]
                  </button>
              </div>
          </div>

          {/* DATA TICKER */}
          <div className="w-full bg-black border-t border-white/10 py-2.5 overflow-hidden flex relative">
              <div className="flex animate-[slide-in-right_20s_linear_infinite] whitespace-nowrap gap-12 text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  {[...LOG_MESSAGES, ...LOG_MESSAGES].map((msg, i) => (
                      <span key={i} className="flex items-center gap-2 opacity-70">
                          <span className="w-1 h-1 bg-indigo-500 rounded-full" /> {msg}
                      </span>
                  ))}
              </div>
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent z-10" />
          </div>
      </div>
    </div>
  );
};

export default LoginView;
