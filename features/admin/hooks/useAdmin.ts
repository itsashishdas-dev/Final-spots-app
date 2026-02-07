
import { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { VerificationStatus } from '../../../types';

export const useAdmin = () => {
  const { 
      spots, refreshSpots, verifySpot, deleteSpot, selectSpot, openModal,
      pendingMentorApplications, loadMentorApplications, reviewMentorApplication,
      challenges, deleteChallenge,
      crews, loadCrews, deleteCrew
  } = useAppStore();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'verifications' | 'spots' | 'challenges' | 'crews'>('verifications');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
        refreshSpots(),
        loadMentorApplications(),
        loadCrews()
        // Challenges are loaded by GameStore usually, ensuring they are populated
    ]);
    setIsLoading(false);
  };

  const handleAction = async (spotId: string, status: VerificationStatus) => {
    await verifySpot(spotId, status);
  };

  const handleEditSpot = (spot: any) => {
      selectSpot(spot);
      // We rely on the SpotView or parent to render the modal based on selectSpot+isEditMode
      // But for direct admin action, let's open the modal if we can contextually
      // Actually, AdminDashboard doesn't contain the MapLayer logic for `EditSpotModal` directly in the same way.
      // We will trigger the modal from the View.
  };

  const handleDeleteSpot = async (spotId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this spot? This action cannot be undone.")) return;
    await deleteSpot(spotId);
  };

  const handleDeleteChallenge = async (id: string) => {
      if (!confirm("Remove this challenge from the global feed?")) return;
      await deleteChallenge(id);
  };

  const handleDeleteCrew = async (id: string) => {
      if (!confirm("Disband this crew? All members will be ejected.")) return;
      await deleteCrew(id);
  };

  const handleReviewApp = async (userId: string, approved: boolean) => {
      await reviewMentorApplication(userId, approved);
  };

  const handleAddSpot = () => {
      openModal('ADD_SPOT');
  };

  const pendingSpots = spots.filter(s => s.verificationStatus === VerificationStatus.PENDING);
  
  // Filter logic based on active tab
  const filteredSpots = spots.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChallenges = challenges.filter(c => 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.spotName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCrews = crews.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    spots,
    challenges,
    crews,
    pendingMentorApplications,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleAction,
    handleDeleteSpot,
    handleEditSpot,
    handleDeleteChallenge,
    handleDeleteCrew,
    handleReviewApp,
    handleAddSpot,
    selectSpot, // Expose for UI
    pendingSpots,
    filteredSpots,
    filteredChallenges,
    filteredCrews
  };
};
