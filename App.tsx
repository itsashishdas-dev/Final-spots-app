
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';

// Components
import AppLayout from '@/components/AppLayout';
import { AddSpotModal, SpotPreviewCard } from '@/features/spots';
import CreateSessionModal from '@/components/CreateSessionModal';
import CreateChallengeModal from '@/components/CreateChallengeModal';
import ChatModal from '@/components/ChatModal';
import LocationPermissionModal from '@/components/LocationPermissionModal';
import CheckInModal from '@/components/CheckInModal';

// Views
import SpotsView from '@/views/SpotsView';
import GridView from '@/views/GridView';
import ChallengesView from '@/views/ChallengesView';
import MentorshipView from '@/views/MentorshipView';
import JourneyView from '@/views/JourneyView';
import ProfileView from '@/views/ProfileView';
import CrewView from '@/views/CrewView';
import AdminDashboardView from '@/views/AdminDashboardView';
import LoginView from '@/views/LoginView';
import OnboardingView from '@/views/OnboardingView';
import PrivacyPolicyView from '@/views/PrivacyPolicyView';

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

  if (showPrivacy) return <PrivacyPolicyView onBack={() => setShowPrivacy(false)} />;
  if (!isAuthenticated) return <LoginView onLogin={handleLogin} onShowPrivacy={() => setShowPrivacy(true)} />;
  if (user && !user.onboardingComplete) return <OnboardingView onComplete={(d) => completeOnboarding(d)} />;

  // Filter data for selected spot
  const spotSessions = selectedSpot ? sessions.filter(s => s.spotId === selectedSpot.id) : [];
  const spotChallenges = selectedSpot ? challenges.filter(c => c.spotId === selectedSpot.id) : [];
  const spotCrew = selectedSpot ? crews.find(c => c.homeSpotId === selectedSpot.id) : undefined;

  // --- MAIN LAYOUT ---
  return (
    <AppLayout>
      {/* ACTIVE VIEW AREA */}
      {currentView === 'MAP' && <SpotsView />} 
      {currentView === 'LIST' && <GridView />}
      {currentView === 'CHALLENGES' && <ChallengesView onNavigate={(t) => setView(t as any)} />}
      {currentView === 'MENTORSHIP' && <MentorshipView />}
      {currentView === 'JOURNEY' && <JourneyView />}
      {currentView === 'PROFILE' && <ProfileView setActiveTab={(t) => setView(t as any)} onLogout={logout} />}
      {currentView === 'CREW' && <CrewView onBack={() => setView(previousView || 'CHALLENGES')} />}
      {currentView === 'ADMIN' && <AdminDashboardView onBack={() => setView('PROFILE')} />}

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
