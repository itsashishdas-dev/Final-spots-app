
import { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { VerificationStatus, Discipline } from '../../../types';

export const useAdmin = () => {
  const { spots, refreshSpots, verifySpot, deleteSpot, pendingMentorApplications, loadMentorApplications, reviewMentorApplication } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'verifications' | 'spots' | 'users' | 'mentor-apps'>('verifications');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([
        refreshSpots(),
        loadMentorApplications()
    ]);
    setIsLoading(false);
  };

  const handleAction = async (spotId: string, status: VerificationStatus) => {
    await verifySpot(spotId, status);
  };

  const handleDeleteSpot = async (spotId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this spot? This action cannot be undone.")) return;
    await deleteSpot(spotId);
  };

  const handleReviewApp = async (userId: string, approved: boolean) => {
      await reviewMentorApplication(userId, approved);
  };

  const pendingSpots = spots.filter(s => s.verificationStatus === VerificationStatus.PENDING);
  const filteredSpots = spots.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    spots,
    pendingMentorApplications,
    isLoading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    handleAction,
    handleDeleteSpot,
    handleReviewApp,
    pendingSpots,
    filteredSpots
  };
};
