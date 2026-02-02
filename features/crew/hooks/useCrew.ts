
import { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { triggerHaptic } from '../../../utils/haptics';
import { playSound } from '../../../utils/audio';

const CREW_AVATARS = ['🛹', '🔥', '⚡', '🌊', '💀', '👽', '🦖', '👹'];

export const useCrew = () => {
  const { 
    user, 
    spots, 
    openChat, 
    crews, 
    activeCrew, 
    loadUserCrew, 
    loadCrews, 
    createCrew, 
    requestJoinCrew, 
    respondToJoinRequest,
    leaveCrew
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'browse' | 'create' | 'dashboard'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [requestingCrewId, setRequestingCrewId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    moto: '',
    homeSpotId: '',
    avatar: CREW_AVATARS[0],
    maxMembers: 10
  });

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (user?.crewId) {
        await loadUserCrew(user.crewId);
        setViewMode('dashboard');
      } else {
        await loadCrews();
        setViewMode('browse');
      }
      setIsLoading(false);
    };
    init();
  }, [user?.crewId]);

  const handleCreateCrew = async () => {
    if (!formData.name || !formData.homeSpotId) return;
    triggerHaptic('success');
    playSound('success');
    
    const selectedSpot = spots.find(s => s.id === formData.homeSpotId);
    
    await createCrew({
      name: formData.name,
      city: user?.location || 'Unknown',
      moto: formData.moto || 'Ride or Die',
      homeSpotId: formData.homeSpotId,
      homeSpotName: selectedSpot?.name || 'Unknown Spot',
      avatar: formData.avatar,
      maxMembers: formData.maxMembers
    });
    
    setViewMode('dashboard');
  };

  const handleRequestJoin = async (crewId: string) => {
      setRequestingCrewId(crewId);
      triggerHaptic('medium');
      try {
          await new Promise(resolve => setTimeout(resolve, 600)); // Network sim
          await requestJoinCrew(crewId);
          triggerHaptic('success');
      } catch (e) {
          triggerHaptic('error');
      } finally {
          setRequestingCrewId(null);
      }
  };

  const handleReviewRequest = async (userId: string, approved: boolean) => {
      if (!activeCrew) return;
      triggerHaptic('medium');
      await respondToJoinRequest(activeCrew.id, userId, approved);
      playSound(approved ? 'success' : 'click');
  };

  const handleLeaveCrew = async () => {
      if (!confirm("Confirm removal from Unit? This action will reset your crew reputation.")) return;
      triggerHaptic('heavy');
      
      await leaveCrew();
      
      setShowSettings(false);
      setViewMode('browse');
      playSound('error');
  };

  const handleOpenChat = () => {
      if (activeCrew) {
          triggerHaptic('medium');
          openChat(activeCrew.id, activeCrew.name);
      }
  };

  return {
    user,
    spots,
    crews,
    activeCrew,
    isLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    requestingCrewId,
    showSettings,
    setShowSettings,
    formData,
    setFormData,
    handleCreateCrew,
    handleRequestJoin,
    handleReviewRequest,
    handleLeaveCrew,
    handleOpenChat,
    CREW_AVATARS
  };
};
