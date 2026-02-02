
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '../../../store';
import { backend } from '../../../services/mockBackend';
import { Challenge, Crew, Collectible, ChallengeSubmission } from '../../../types';
import { triggerHaptic } from '../../../utils/haptics';
import { playSound } from '../../../utils/audio';
import { COLLECTIBLES_DATABASE } from '../../../core/constants';

export const useChallenges = () => {
  const { challenges, user, isLoading, updateUser, spots, sessions, openChat, upvoteSubmission } = useAppStore();
  
  const [viewingSubmission, setViewingSubmission] = useState<ChallengeSubmission | null>(null);
  const [uploadingChallenge, setUploadingChallenge] = useState<(Challenge & { spotName: string }) | null>(null);
  const [unlockedItem, setUnlockedItem] = useState<Collectible | null>(null);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, ChallengeSubmission[]>>({});
  const [myCrew, setMyCrew] = useState<Crew | null>(null);
  const [votedSubmissions, setVotedSubmissions] = useState<Set<string>>(new Set());
  
  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
      const loadCrew = async () => {
          if (user?.crewId) {
              const c = await backend.getUserCrew(user.crewId);
              setMyCrew(c);
          }
      };
      loadCrew();
  }, [user]);

  const filteredChallenges = useMemo(() => {
     let result = challenges;
     if (user && user.disciplines && user.disciplines.length > 0) {
        result = result.filter(c => {
            const spot = spots.find(s => s.id === c.spotId);
            return spot && user.disciplines.includes(spot.type);
        });
     }
     return result;
  }, [challenges, user?.disciplines, spots]);

  const mySessions = useMemo(() => {
      if (!user) return [];
      const now = new Date();
      now.setHours(0,0,0,0);
      
      return sessions
        .filter(s => s.participants.includes(user.id) && new Date(s.date) >= now)
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [sessions, user]);

  useEffect(() => {
    const fetchSubs = async () => {
        const map: Record<string, ChallengeSubmission[]> = {};
        for (const c of filteredChallenges) {
            map[c.id] = await backend.getChallengeSubmissions(c.id);
        }
        setSubmissionsMap(map);
    };
    if (filteredChallenges.length > 0) fetchSubs();
  }, [filteredChallenges]);

  const handleUploadComplete = async (file: File) => {
    if (!uploadingChallenge || !user) return;
    try {
      const { newUnlocks, user: updatedUser } = await backend.completeChallenge(uploadingChallenge.id);
      updateUser(updatedUser);
      
      const updatedSubmissions = await backend.getChallengeSubmissions(uploadingChallenge.id);
      setSubmissionsMap(prev => ({ ...prev, [uploadingChallenge.id]: updatedSubmissions }));

      setUploadingChallenge(null);
      playSound('unlock');
      if (newUnlocks.length > 0) {
         const item = COLLECTIBLES_DATABASE.find(c => c.id === newUnlocks[0]);
         if (item) setUnlockedItem(item);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (submissionId: string, challengeId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (votedSubmissions.has(submissionId)) return;

      triggerHaptic('medium');
      playSound('click');
      
      setVotedSubmissions(prev => new Set(prev).add(submissionId));
      await upvoteSubmission(submissionId);

      setSubmissionsMap(prev => ({
          ...prev,
          [challengeId]: prev[challengeId].map(s => 
              s.id === submissionId ? { ...s, votes: s.votes + 1 } : s
          ).sort((a, b) => b.votes - a.votes)
      }));
      
      if (viewingSubmission && viewingSubmission.id === submissionId) {
          setViewingSubmission(prev => prev ? { ...prev, votes: prev.votes + 1 } : null);
      }
  };

  const handleOpenChat = (sessionId: string, title: string, e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic('medium');
      playSound('click');
      openChat(sessionId, title);
  };

  const togglePlay = () => {
      if (videoRef.current) {
          if (isPlaying) videoRef.current.pause();
          else videoRef.current.play();
          setIsPlaying(!isPlaying);
      }
  };

  return {
    challenges: filteredChallenges,
    mySessions,
    myCrew,
    isLoading,
    viewingSubmission,
    setViewingSubmission,
    uploadingChallenge,
    setUploadingChallenge,
    unlockedItem,
    setUnlockedItem,
    submissionsMap,
    votedSubmissions,
    videoRef,
    isPlaying,
    user,
    handleUploadComplete,
    handleVote,
    handleOpenChat,
    togglePlay
  };
};
