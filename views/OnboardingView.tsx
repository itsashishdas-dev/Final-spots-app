
import React, { useState, useRef, useEffect } from 'react';
import { Discipline } from '../types';
import { ChevronRight, ChevronLeft, Loader2, Mountain, Crosshair, RefreshCw, Footprints, Terminal, Wifi, Check, Fingerprint, Activity, Radio, Scan, Shield, Apple, MapPin, Radar } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { playSound } from '../utils/audio';

interface OnboardingViewProps {
  onComplete: (data: any) => void;
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ghost',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ninja',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Samurai',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Cyborg',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Glitch',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=System',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Punk',
];

const RANDOM_NAMES = ['GHOST', 'PHANTOM', 'VAPOR', 'SHREDDER', 'KAIJU', 'RONIN', 'SPECTRE', 'VECTOR', 'GLITCH', 'NOMAD', 'SABRE', 'COBRA', 'VIPER', 'SHADOW'];

// --- CUSTOM ICONS ---
const SkateboardIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 9c1.5 2 3.5 2 5 2h10c1.5 0 3.5 0 5-2" />
    <circle cx="7.5" cy="14" r="2.5" />
    <circle cx="16.5" cy="14" r="2.5" />
    <path d="M7.5 11v0.5" />
    <path d="M16.5 11v0.5" />
  </svg>
);

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  // STEPS: 0=Identity, 1=Discipline, 2=Stance, 3=Location, 4=Boot
  const [step, setStep] = useState(0);
  const [bootLog, setBootLog] = useState<string[]>([]);
  
  // Data State
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<string>(PRESET_AVATARS[0]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([Discipline.SKATE]);
  const [stance, setStance] = useState<'regular' | 'goofy'>('regular');
  const [locationName, setLocationName] = useState('');
  const [isLinked, setIsLinked] = useState(false);
  const [scanStatus, setScanStatus] = useState('INITIALIZING...');
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  
  const [isLocating, setIsLocating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
      // Auto-generate a random identity on mount so user can just click "Next"
      handleRandomizeIdentity();
  }, []);

  // --- SCAN SEQUENCE ANIMATION ---
  useEffect(() => {
    if (step === 0) {
      const statuses = ['CALIBRATING...', 'ANALYZING BIO-METRICS...', 'SEARCHING DATABASE...', 'IDENTITY MATCH CONFIRMED'];
      let i = 0;
      const interval = setInterval(() => {
        setScanStatus(statuses[i]);
        i++;
        if (i >= statuses.length) {
            clearInterval(interval);
            setScanStatus(isLinked ? 'UPLINK VERIFIED' : 'IDENTITY MATCH');
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step, isLinked]);

  // --- BOOT SEQUENCE LOGIC (FINAL STEP) ---
  useEffect(() => {
    if (step === 4) {
        const logs = [
            `> BOOT_SEQUENCE_INIT...`,
            `> MEMORY_CHECK: OK`,
            `> REGISTERING OPERATIVE: ${username}...`,
            `> CALIBRATING PHYSICS [${stance.toUpperCase()}]...`,
            `> LOADING CLASS: ${disciplines[0].toUpperCase()}...`,
            `> ESTABLISHING SECURE UPLINK...`,
            `> TARGET SECTOR: ${locationName || 'UNKNOWN'}`,
            `> DECRYPTING ASSETS...`,
            `> SYSTEM READY.`
        ];

        let delay = 0;
        logs.forEach((log, index) => {
            // Speed up the sequence: Reduced random interval
            delay += Math.random() * 80 + 40; 
            setTimeout(() => {
                setBootLog(prev => [...prev, log]);
                playSound('data_stream');
                if (index === logs.length - 1) {
                    // Reduced final wait time
                    setTimeout(() => {
                        playSound('success');
                        onComplete({
                            name: username,
                            bio: '',
                            location: locationName,
                            disciplines: disciplines,
                            avatar: avatar,
                            stance: stance,
                            level: 1,
                            xp: 0,
                            masteredCount: 0,
                            locker: [],
                            isLinked: isLinked
                        });
                    }, 500);
                }
            }, delay);
        });
    }
  }, [step]);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bootLog]);

  // --- ACTIONS ---

  const handleRandomizeIdentity = () => {
      const randomName = `${RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]}-${Math.floor(Math.random() * 999)}`;
      const randomAvatar = PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)];
      setUsername(randomName);
      setAvatar(randomAvatar);
      // Reset scan animation slightly
      setScanStatus('RE-CALIBRATING...');
      setTimeout(() => setScanStatus('IDENTITY MATCH'), 1000);
  };

  const handleSocialLink = () => {
      triggerHaptic('success');
      playSound('unlock');
      setIsLinked(true);
  };

  const handleDisciplineSelect = (d: Discipline) => {
      triggerHaptic('medium');
      playSound('tactile_select');
      setDisciplines([d]);
      setTimeout(() => setStep(2), 250); 
  };

  const handleStanceSelect = (s: 'regular' | 'goofy') => {
      triggerHaptic('medium');
      playSound('tactile_select');
      setStance(s);
      setTimeout(() => setStep(3), 250);
  };

  const handleLocation = () => {
    setIsLocating(true);
    triggerHaptic('heavy');
    playSound('radar_scan'); 
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (pos) => {
              setLocationName('GPS_LOCKED');
              completeLocation();
          },
          (err) => {
              setLocationName('MANUAL_OVERRIDE'); // Fallback
              completeLocation();
          },
          { timeout: 5000 }
      );
    } else {
        setLocationName('MANUAL_OVERRIDE');
        completeLocation();
    }
  };

  const completeLocation = () => {
      setTimeout(() => {
          setIsLocating(false);
          playSound('radar_complete'); 
          triggerHaptic('success');
          setStep(4); // Go to Boot
      }, 1500); 
  };

  const skipLocation = () => {
      triggerHaptic('medium');
      setLocationName('UNKNOWN_SECTOR');
      setStep(4);
  };

  // --- RENDERERS ---

  // 0. IDENTITY
  if (step === 0) {
      return (
          <OnboardingLayout 
            step="01" 
            title="IDENTITY" 
            subtitle="OPERATIVE CONFIG"
            onNext={() => { triggerHaptic('medium'); playSound('click'); setStep(1); }}
            nextLabel={isLinked ? "LINKED // PROCEED" : "CONFIRM ID"}
            canProceed={!!username}
          >
              <div className="flex flex-col items-center justify-center h-full w-full gap-6 py-4">
                  {/* Avatar Scanner Frame */}
                  <div className="relative group">
                      {/* Technical Crosshairs - Animated */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 animate-[pulse_2s_infinite]" />
                      <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-500/50 animate-[pulse_2s_infinite]" />
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-500/50 animate-[pulse_2s_infinite]" />
                      <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 animate-[pulse_2s_infinite]" />

                      <div className={`w-32 h-32 bg-[#050505] border-2 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)] transition-all duration-500 ${isLinked ? 'border-indigo-500 shadow-indigo-500/20' : 'border-slate-800'}`}>
                          {/* Inner Grid */}
                          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
                          
                          <img src={avatar} className="w-full h-full object-cover relative z-10 animate-[fadeIn_0.5s_ease-out]" style={{ imageRendering: 'pixelated' }} />
                          
                          {/* Scanning Line */}
                          <div className="absolute left-0 w-full h-1 bg-emerald-500/80 animate-[scan-line_2.5s_linear_infinite] z-20 shadow-[0_0_15px_#10b981]" />
                          
                          {/* Status Text - Dynamic */}
                          <div className="absolute bottom-1 left-2 text-[6px] font-mono text-emerald-500 font-bold tracking-widest z-20 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm border border-emerald-500/20">
                              BIO_SCAN: <span className="animate-pulse">{scanStatus}</span>
                          </div>
                      </div>
                      
                      <button 
                        onClick={() => { triggerHaptic('light'); playSound('glitch'); handleRandomizeIdentity(); }}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#111] text-emerald-500 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/10 active:scale-95 transition-all shadow-lg z-30"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)' }}
                      >
                          <RefreshCw size={14} className="animate-[spin_4s_linear_infinite_reverse]" />
                      </button>
                  </div>

                  {/* Name Input - Heavy Industrial Style */}
                  <div className="w-full max-w-xs relative">
                      <div className="flex justify-between text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                          <span>Callsign Assignment</span>
                          <span className="text-emerald-500 animate-pulse">REQ_INPUT</span>
                      </div>
                      <div className="bg-[#0a0a0a] border-2 border-slate-800 flex items-center relative overflow-hidden group focus-within:border-emerald-500/50 transition-colors h-14">
                          {/* Caution Stripes */}
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#333_2px,#333_4px)] opacity-50" />
                          
                          <div className="pl-6 pr-4 flex-1 flex items-center">
                              <span className="text-emerald-600 font-mono mr-2 text-lg">{'>'}</span>
                              <input 
                                  type="text" 
                                  value={username}
                                  onChange={e => setUsername(e.target.value.toUpperCase())}
                                  placeholder="ENTER_ID"
                                  className="bg-transparent border-none outline-none text-xl font-black text-white uppercase w-full placeholder:text-slate-800 tracking-[0.1em] font-sans"
                              />
                          </div>
                          
                          <div className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center border-l border-slate-800 bg-[#111]">
                              <Terminal size={12} className="text-slate-600" />
                          </div>
                      </div>
                  </div>

                  {/* Social Signup Options */}
                  <div className="w-full max-w-xs space-y-3">
                      <div className="flex items-center gap-4 w-full opacity-50">
                          <div className="h-px bg-slate-700 flex-1" />
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">OR SECURE UPLINK</span>
                          <div className="h-px bg-slate-700 flex-1" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={handleSocialLink}
                            className={`flex items-center justify-center gap-2 p-3 rounded bg-[#111] border transition-all active:scale-95 ${isLinked ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}
                          >
                              {/* Google G Logo Sim */}
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Google</span>
                              {isLinked && <Check size={10} />}
                          </button>
                          
                          <button 
                            onClick={handleSocialLink}
                            className={`flex items-center justify-center gap-2 p-3 rounded bg-[#111] border transition-all active:scale-95 ${isLinked ? 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}
                          >
                              <Apple size={12} />
                              <span className="text-[9px] font-black uppercase tracking-widest">Apple</span>
                              {isLinked && <Check size={10} />}
                          </button>
                      </div>
                  </div>
              </div>
          </OnboardingLayout>
      );
  }

  // 1. DISCIPLINE
  if (step === 1) {
      return (
          <OnboardingLayout 
            step="02" 
            title="CLASS" 
            subtitle="SELECT DISCIPLINE"
            onBack={() => setStep(0)}
          >
              {/* Changed alignment to start with padding for better balance */}
              <div className="flex flex-col justify-start pt-12 h-full gap-5">
                  <SelectCard 
                      title="SKATEBOARDING" 
                      subtitle="STREET // PARK // FREESTYLE" 
                      icon={<SkateboardIcon size={28} />} 
                      isSelected={disciplines.includes(Discipline.SKATE)} 
                      onClick={() => handleDisciplineSelect(Discipline.SKATE)}
                      code="CLS-01"
                  />
                  <SelectCard 
                      title="DOWNHILL" 
                      subtitle="FREERIDE // RACE // TECH SLIDE" 
                      icon={<Mountain size={28} />} 
                      isSelected={disciplines.includes(Discipline.DOWNHILL)} 
                      onClick={() => handleDisciplineSelect(Discipline.DOWNHILL)}
                      code="CLS-02"
                  />
              </div>
          </OnboardingLayout>
      );
  }

  // 2. STANCE
  if (step === 2) {
      return (
          <OnboardingLayout 
            step="03" 
            title="STANCE" 
            subtitle="PHYSICS CONFIG"
            onBack={() => setStep(1)}
          >
              {/* Changed alignment to start with padding for better balance */}
              <div className="flex flex-col justify-start pt-12 h-full gap-5">
                  <SelectCard 
                      title="REGULAR" 
                      subtitle="LEFT FOOT LEAD" 
                      icon={<Footprints size={32} className="rotate-90" />} 
                      isSelected={stance === 'regular'} 
                      onClick={() => handleStanceSelect('regular')}
                      code="STN-L"
                  />
                  <SelectCard 
                      title="GOOFY" 
                      subtitle="RIGHT FOOT LEAD" 
                      icon={<Footprints size={32} className="-rotate-90 scale-x-[-1]" />} 
                      isSelected={stance === 'goofy'} 
                      onClick={() => handleStanceSelect('goofy')}
                      code="STN-R"
                  />
              </div>
          </OnboardingLayout>
      );
  }

  // 3. LOCATION (IMPROVED RADAR WITH TOGGLE)
  if (step === 3) {
      return (
          <OnboardingLayout 
            step="04" 
            title="UPLINK" 
            subtitle="SECTOR SCAN"
            onBack={() => setStep(2)}
            hideNext
          >
              <div className="flex flex-col items-center justify-center h-full gap-10 pb-20">
                  
                  {/* Tactical Radar Container */}
                  <div className="relative w-80 h-80 flex items-center justify-center">
                      
                      {/* 1. Static Grid Background */}
                      <div className={`absolute inset-0 rounded-full border bg-black shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-500 ${isLocationEnabled ? 'border-[#1a1a1a]' : 'border-red-900/30'}`}>
                          {/* Grid Lines */}
                          <div className="absolute inset-0" style={{ 
                              backgroundImage: isLocationEnabled 
                                ? 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)'
                                : 'radial-gradient(circle, #2a0a0a 1px, transparent 1px)', 
                              backgroundSize: '20px 20px', 
                              backgroundPosition: 'center' 
                          }} />
                          
                          {/* Concentric Rings */}
                          {[1, 2, 3].map(i => (
                              <div key={i} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 ${isLocationEnabled ? 'border-[#1a1a1a]' : 'border-red-900/20'}`}
                                   style={{ width: `${i * 33}%`, height: `${i * 33}%` }} />
                          ))}

                          {/* Crosshairs */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isLocationEnabled ? 'opacity-30' : 'opacity-10'}`}>
                              <div className={`w-full h-px ${isLocationEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <div className={`h-full w-px absolute ${isLocationEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          </div>

                          {/* Green Dots (Blips) */}
                          {isLocationEnabled && (
                              <>
                                  <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-emerald-500 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                                  <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />

                                  <div className="absolute bottom-[30%] right-[25%] w-2 h-2 bg-emerald-500 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                                  <div className="absolute bottom-[30%] right-[25%] w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />

                                  <div className="absolute top-[15%] right-[40%] w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-pulse shadow-[0_0_5px_#34d399]" />
                              </>
                          )}
                      </div>

                      {/* 2. Active Scanner Sweep - Perfectly Centered */}
                      {isLocating && isLocationEnabled && (
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_320deg,rgba(16,185,129,0.1)_340deg,rgba(16,185,129,0.8)_360deg)] animate-[spin_2s_linear_infinite] origin-center" 
                              />
                          </div>
                      )}

                      {/* 3. Center Status Icon */}
                      <div className={`relative z-10 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm p-4 rounded-full border transition-colors duration-500 ${isLocationEnabled ? 'border-white/5' : 'border-red-500/20'}`}>
                          {isLocating ? (
                              <>
                                  <div className="relative">
                                      <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-30 animate-pulse" />
                                      <Radar size={32} className="text-emerald-500 relative z-10 animate-spin" style={{ animationDuration: '3s' }} />
                                  </div>
                                  <div className="absolute -bottom-8 w-max">
                                      <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-[0.2em] animate-pulse">
                                          ACQUIRING...
                                      </span>
                                  </div>
                              </>
                          ) : (
                              <>
                                  <Radar size={32} className={`transition-colors duration-300 ${isLocationEnabled ? 'text-[#333]' : 'text-red-900'}`} />
                                  <div className="absolute -bottom-8 w-max">
                                      <span className={`text-[10px] font-mono font-bold tracking-[0.2em] transition-colors ${isLocationEnabled ? 'text-[#333]' : 'text-red-900'}`}>
                                          {isLocationEnabled ? 'WAITING' : 'OFFLINE'}
                                      </span>
                                  </div>
                              </>
                          )}
                      </div>

                      {/* 4. Outer Decorative Ring */}
                      <div className={`absolute inset-[-4px] rounded-full border border-dashed transition-colors duration-500 animate-[spin_60s_linear_infinite] ${isLocationEnabled ? 'border-[#222]' : 'border-red-900/30'}`} />
                  </div>

                  <div className="w-full max-w-xs space-y-4 relative z-10">
                      
                      {/* Toggle Card */}
                      <div 
                          onClick={() => { 
                              setIsLocationEnabled(!isLocationEnabled); 
                              triggerHaptic('light'); 
                              playSound('click'); 
                          }}
                          className={`w-full border-2 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300 group ${
                              isLocationEnabled 
                              ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                              : 'bg-[#111] border-slate-800 hover:border-slate-700'
                          }`}
                      >
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                  isLocationEnabled ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-500'
                              }`}>
                                  <MapPin size={18} strokeWidth={2.5} />
                              </div>
                              <div className="text-left">
                                  <div className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                                      isLocationEnabled ? 'text-white' : 'text-slate-500'
                                  }`}>
                                      Location Services
                                  </div>
                                  <div className={`text-[8px] font-bold font-mono transition-colors ${
                                      isLocationEnabled ? 'text-emerald-500' : 'text-slate-600'
                                  }`}>
                                      {isLocationEnabled ? 'SIGNAL: ACTIVE' : 'SIGNAL: OFFLINE'}
                                  </div>
                              </div>
                          </div>

                          {/* Physical Switch Graphic */}
                          <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 relative ${
                              isLocationEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}>
                              <div className={`w-3 h-3 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                  isLocationEnabled ? 'translate-x-5' : 'translate-x-0'
                              }`} />
                          </div>
                      </div>

                      {/* Action Button */}
                      <button 
                          onClick={isLocationEnabled ? handleLocation : skipLocation}
                          disabled={isLocating}
                          className={`w-full h-14 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all active:scale-95 group relative overflow-hidden rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] ${isLocating ? 'bg-slate-800 text-slate-500 cursor-not-allowed border-none shadow-none' : isLocationEnabled ? 'bg-[#b0b0b0] hover:bg-white text-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-none shadow-none'}`}
                      >
                          {/* Crosshair Icon Circle (Only if locating or enabled) */}
                          {(isLocationEnabled || isLocating) && (
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${isLocating ? 'border-slate-600' : 'border-black'}`}>
                                  {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} strokeWidth={2.5} />}
                              </div>
                          )}
                          <span>{isLocating ? 'TRIANGULATING...' : isLocationEnabled ? 'ENABLE GPS LINK' : 'PROCEED OFFLINE'}</span>
                      </button>
                  </div>
              </div>
          </OnboardingLayout>
      );
  }

  // 4. BOOT SEQUENCE
  if (step === 4) {
      return (
          <div className="h-screen w-full bg-black font-mono p-8 flex flex-col justify-end relative overflow-hidden">
              {/* Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,255,0,0.05)_50%),linear-gradient(90deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02),rgba(0,0,0,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-20" />
              
              <div className="space-y-2 text-xs md:text-sm leading-relaxed opacity-90 relative z-30 mb-8 font-medium">
                  {bootLog.map((log, i) => (
                      <div key={i} className="animate-[fadeIn_0.05s_linear] tracking-wider text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                          {log}
                      </div>
                  ))}
                  <div ref={bottomRef} />
              </div>
              
              <div className="mt-6 h-1 w-full bg-emerald-900/30 overflow-hidden relative z-30 mb-safe-bottom">
                  <div 
                    className="h-full bg-emerald-500 animate-[shimmer_1s_infinite] w-full origin-left transition-transform duration-300 ease-out shadow-[0_0_10px_#10b981]" 
                    style={{ transform: `scaleX(${bootLog.length / 9})` }} 
                  />
              </div>
              
              <div className="absolute top-12 right-8 text-[9px] font-black text-emerald-700 tracking-widest z-10 animate-pulse">
                  SYSTEM_BOOT // {Math.min(100, Math.round((bootLog.length / 9) * 100))}%
              </div>
          </div>
      );
  }

  return null;
};

// --- LAYOUT COMPONENTS ---

const ScrewCorners = () => (
    <>
        <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-slate-700 rounded-full border border-slate-900 opacity-50" />
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-700 rounded-full border border-slate-900 opacity-50" />
        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-slate-700 rounded-full border border-slate-900 opacity-50" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-slate-700 rounded-full border border-slate-900 opacity-50" />
    </>
);

const OnboardingLayout = ({ step, title, subtitle, children, onNext, onBack, nextLabel = "NEXT", canProceed = true, hideNext = false }: any) => {
    return (
        <div className="h-full w-full bg-[#020202] flex flex-col pt-safe-top font-mono animate-view relative">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }}>
            </div>

            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Shield size={140} className="text-slate-500" />
            </div>

            {/* Header */}
            <div className="px-6 pt-6 mb-2 relative z-10 shrink-0">
                {onBack && (
                    <button onClick={onBack} className="text-[9px] font-bold text-slate-500 mb-6 flex items-center gap-1 uppercase tracking-widest hover:text-white transition-colors">
                        <ChevronLeft size={12} /> Return
                    </button>
                )}
                <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">{subtitle}</span>
                        </div>
                        <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter leading-[0.8] font-sans">{title}</h1>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-[3rem] font-black text-slate-800 leading-none -mb-2">{step}</div>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">/04</span>
                    </div>
                </div>
            </div>

            {/* Content Area - Centered and Filled */}
            <div className="flex-1 px-6 relative z-10 flex flex-col">
                <div className="flex-1 relative">
                    {children}
                </div>
            </div>

            {/* Footer Nav */}
            {!hideNext && onNext && (
                <div className="p-6 pt-0 pb-8 shrink-0 relative z-20">
                    <button 
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`w-full h-16 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-between px-6 transition-all active:scale-[0.98] group relative overflow-hidden ${
                            !canProceed 
                            ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800' 
                            : 'bg-white text-black hover:bg-slate-200 border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        }`}
                        style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                        <span>{nextLabel}</span>
                        <ChevronRight size={16} strokeWidth={3} className={`transition-transform ${canProceed ? 'group-hover:translate-x-1' : ''}`} />
                        
                        {/* Shimmer Effect */}
                        {canProceed && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

const SelectCard = ({ title, subtitle, icon, isSelected, onClick, code }: any) => {
    return (
        <button 
            onClick={onClick}
            className={`w-full relative py-6 flex items-center justify-between px-6 transition-all duration-200 active:scale-[0.98] group overflow-hidden border-2
            ${isSelected 
                ? 'bg-emerald-950/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                : 'bg-[#080808] border-slate-800 hover:border-slate-600'
            }`}
            style={{ clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)' }}
        >
            <div className="flex items-center gap-5 relative z-10 w-full">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shrink-0 border ${isSelected ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-slate-600 border-slate-800 bg-slate-900/50'}`}>
                    {icon}
                </div>
                <div className="text-left flex-1 min-w-0">
                    <h3 className={`text-xl font-black italic uppercase tracking-tighter mb-0.5 font-sans ${isSelected ? 'text-white' : 'text-slate-500'}`}>{title}</h3>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.15em] ${isSelected ? 'text-emerald-500' : 'text-slate-600'}`}>{subtitle}</p>
                </div>
            </div>
            
            {isSelected && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-emerald-500 text-black rounded-full p-0.5 shadow-[0_0_10px_#10b981]">
                    <Check size={14} strokeWidth={4} />
                </div>
            )}

            {/* Decorative Code */}
            <div className={`absolute top-2 right-3 text-[7px] font-mono font-bold tracking-widest opacity-60 ${isSelected ? 'text-emerald-700' : 'text-slate-800'}`}>
                {code}
            </div>

            {/* Scanline */}
            {isSelected && <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />}
        </button>
    );
};

export default OnboardingView;
