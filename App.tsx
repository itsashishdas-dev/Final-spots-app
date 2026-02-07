
import * as React from 'react';
import { useState, useEffect, Suspense, lazy } from 'react';
import { useAppStore } from '@/store';

// Components
import AppLayout from '@/components/AppLayout';
import { AddSpotModal, SpotPreviewCard } from '@/features/spots';
import CreateSessionModal from '@/components/CreateSessionModal';
import CreateChallengeModal from '@/components/CreateChallengeModal';
import ChatModal from '@/components/ChatModal';
import LocationPermissionModal from '@/components/LocationPermissionModal';
import CheckInModal from '@/components/CheckInModal';
import { LoadingState } from '@/components/LoadingState';

// Lazy Loaded Views
const SpotsView = lazy(() => import('@/views/SpotsView'));
const GridView = lazy(() => import('@/views/GridView'));
const ChallengesView = lazy(() => import('@/views/ChallengesView'));
const MentorshipView = lazy(() => import('@/views/MentorshipView'));
const JourneyView = lazy(() => import('@/views/JourneyView'));
const ProfileView = lazy(() => import('@/views/ProfileView'));
const CrewView = lazy(() => import('@/views/CrewView'));
const AdminDashboardView = lazy(() => import('@/views/AdminDashboardView'));
const LoginView = lazy(() => import('@/views/LoginView'));
const OnboardingView = lazy(() => import('@/views/OnboardingView'));
const PrivacyPolicyView = lazy(() => import('@/views/PrivacyPolicyView'));

// Services & Utils
import { triggerHaptic } from '@/utils/haptics';
import { playSound, setSoundEnabled } from '@/utils/audio';

const App: React.FC = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  
  const { 
    user, 
    isAuthenticated,
    checkAuth,
    login,
    logout,
    completeOnboarding,
    initializeData, 
    setUserLocation, 
    closeModal,
    openModal,
    setView,
    crews,
    
    // Selectors
    currentView, 
    previousView,
    activeModal, 
    selectedSpot,
    sessions,
    challenges, 
  } = useAppStore();

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      setIsAuthChecking(true);
      const isLogged = await checkAuth();
      if (isLogged) {
        await initializeData();
      }
      setIsAuthChecking(false);
    };
    init();
  }, []);

  // Sync sound settings when user loads
  useEffect(() => {
      if (user) {
          setSoundEnabled(user.soundEnabled);
      }
  }, [user]);

  const handleLogin = async () => {
    await login();
    await initializeData();
  };

  const handleLocationAllow = () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (pos) => {
                  setUserLocation(pos.coords.latitude, pos.coords.longitude);
                  setShowLocationPrompt(false);
                  playSound('radar_complete');
                  triggerHaptic('success');
              },
              (err) => {
                  console.warn("Location access denied or failed", err);
                  setShowLocationPrompt(false);
                  triggerHaptic('error');
              },
              { enableHighAccuracy: true }
          );
      } else {
          setShowLocationPrompt(false);
      }
  };

  // --- RENDERING GUARDS ---
  if (isAuthChecking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black gap-4">
        <div className="text-white font-bold tracking-widest text-sm animate-pulse">LOADING PUSH...</div>
      </div>
    );
  }

  // Lazy load wrapper for fullscreen views
  const renderView = () => (
    <Suspense fallback={<LoadingState fullscreen />}>
      {showPrivacy ? <PrivacyPolicyView onBack={() => setShowPrivacy(false)} /> :
       !isAuthenticated ? <LoginView onLogin={handleLogin} onShowPrivacy={() => setShowPrivacy(true)} /> :
       user && !user.onboardingComplete ? <OnboardingView onComplete={(d) => completeOnboarding(d)} /> :
       null}
    </Suspense>
  );

  if (showPrivacy || !isAuthenticated || (user && !user.onboardingComplete)) {
      return renderView();
  }

  // Filter data for selected spot
  const spotSessions = selectedSpot ? sessions.filter(s => s.spotId === selectedSpot.id) : [];
  const spotChallenges = selectedSpot ? challenges.filter(c => c.spotId === selectedSpot.id) : [];
  const spotCrew = selectedSpot ? crews.find(c => c.homeSpotId === selectedSpot.id) : undefined;

  // --- MAIN LAYOUT ---
  return (
    <AppLayout>
      <Suspense fallback={<LoadingState fullscreen={false} />}>
        {currentView === 'MAP' && <SpotsView />} 
        {currentView === 'LIST' && <GridView />}
        {currentView === 'CHALLENGES' && <ChallengesView onNavigate={(t) => setView(t as any)} />}
        {currentView === 'MENTORSHIP' && <MentorshipView />}
        {currentView === 'JOURNEY' && <JourneyView />}
        {currentView === 'PROFILE' && <ProfileView setActiveTab={(t) => setView(t as any)} onLogout={logout} />}
        {currentView === 'CREW' && <CrewView onBack={() => setView(previousView || 'CHALLENGES')} />}
        {currentView === 'ADMIN' && <AdminDashboardView onBack={() => setView('PROFILE')} />}
      </Suspense>

      {/* GLOBAL OVERLAYS */}
      
      {showLocationPrompt && (
          <LocationPermissionModal 
              onAllow={handleLocationAllow}
              onDeny={() => setShowLocationPrompt(false)}
          />
      )}
      
      {/* Spot Preview Card Overlay */}
      {activeModal === 'SPOT_DETAIL' && selectedSpot && (
         <>
            {/* Backdrop (Only for compact mode conceptually, but we can keep it global) */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-40 animate-[fadeIn_0.2s_ease-out] md:hidden" onClick={closeModal} />
            
            {/* Sheet / Panel */}
            <SpotPreviewCard 
                spot={selectedSpot}
                sessions={spotSessions}
                challenges={spotChallenges}
                crew={spotCrew}
                onClose={closeModal}
                onCheckIn={() => {
                    openModal('CHECK_IN');
                }}
            />
         </>
      )}

      {activeModal === 'ADD_SPOT' && <AddSpotModal />}
      {activeModal === 'CREATE_SESSION' && <CreateSessionModal />}
      {activeModal === 'CREATE_CHALLENGE' && <CreateChallengeModal />}
      {activeModal === 'CHAT' && <ChatModal onClose={closeModal} />}
      {activeModal === 'CHECK_IN' && <CheckInModal />}
    </AppLayout>
  );
};

export default App;
