
import React, { useRef } from 'react';
import Navigation from './Navigation';
import { useLayoutMode } from '../hooks/useLayoutMode';
import { useAppStore } from '../store';
import { AppView } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface AppLayoutProps {
  children: React.ReactNode;
}

const TABS: AppView[] = ['MAP', 'CHALLENGES', 'MENTORSHIP', 'JOURNEY', 'PROFILE'];

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const mode = useLayoutMode();
  const { currentView, previousView, setView } = useAppStore();

  // Determine Animation Direction
  const getAnimationClass = () => {
      // Disable swipe animation for desktop/tablet regular mode layout
      if (mode === 'regular') return 'animate-view';

      const currentIndex = currentView === 'LIST' ? 0 : TABS.indexOf(currentView);
      const prevIndex = previousView === 'LIST' ? 0 : (previousView && TABS.includes(previousView) ? TABS.indexOf(previousView) : -1);

      if (prevIndex === -1) return 'animate-view'; // First load or non-tab view
      if (currentIndex === prevIndex) return 'animate-view'; // Same tab (e.g. Map/List toggle)

      if (currentIndex > prevIndex) {
          return 'animate-slide-in-right';
      } else {
          return 'animate-slide-in-left';
      }
  };

  const animationClass = getAnimationClass();

  // Swipe Logic Refs
  const touchStartRef = useRef<number | null>(null);
  const touchYRef = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.changedTouches[0].clientX;
    touchYRef.current = e.changedTouches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null || touchYRef.current === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartRef.current - touchEnd;
    const diffY = touchYRef.current - touchEndY;

    // Reset
    touchStartRef.current = null;
    touchYRef.current = null;

    // Ignore if vertical scroll was dominant (user is scrolling down a list)
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    // Ignore if swipe is too short
    if (Math.abs(diffX) < 50) return;

    // Disable global swipe on MAP view to allow map panning
    if (currentView === 'MAP') return;

    // Treat LIST view as part of the first slot
    const currentIndex = currentView === 'LIST' ? 0 : TABS.indexOf(currentView);
    if (currentIndex === -1) return;

    if (diffX > 0) {
      // Swipe Left -> Next Tab
      if (currentIndex < TABS.length - 1) {
        triggerHaptic('light');
        setView(TABS[currentIndex + 1]);
      }
    } else {
      // Swipe Right -> Prev Tab
      if (currentIndex > 0) {
        triggerHaptic('light');
        setView(TABS[currentIndex - 1]);
      }
    }
  };

  return (
    <div 
      className={`flex h-full w-full bg-[#020202] overflow-hidden ${mode === 'regular' ? 'flex-row' : 'flex-col'}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      
      {/* 
        NAVIGATION
        - Compact: Rendered at bottom (via fixed positioning in Nav component)
        - Regular: Rendered as left rail
      */}
      {mode === 'regular' && (
        <aside className="w-24 shrink-0 h-full border-r border-white/5 bg-[#050505] z-50 pl-[env(safe-area-inset-left)]">
          <Navigation mode="rail" />
        </aside>
      )}

      {/* 
        MAIN CONTENT AREA 
        - Flex-1 to fill remaining space
        - Relative positioning to contain absolute children (maps, overlays)
        - Added padding-bottom in compact mode to ensure content isn't hidden behind the fixed nav
        - Added safe area padding for right side (landscape notch)
      */}
      <main className={`flex-1 relative h-full overflow-hidden flex flex-col pr-[env(safe-area-inset-right)] ${mode === 'compact' ? 'pb-16 pl-[env(safe-area-inset-left)]' : ''}`}>
        <div key={currentView} className={`w-full h-full ${animationClass}`}>
            {children}
        </div>
      </main>

      {/* BOTTOM NAVIGATION (Compact Only) */}
      {mode === 'compact' && (
        <Navigation mode="bottom" />
      )}
    </div>
  );
};

export default AppLayout;
