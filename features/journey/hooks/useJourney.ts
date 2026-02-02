
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { backend } from '../../../services/mockBackend';
import { Discipline } from '../../../types';
import { triggerHaptic } from '../../../utils/haptics';
import { playSound } from '../../../utils/audio';

export const useJourney = () => {
  const { user, sessions, challenges, skills, notes, initializeData, openChat } = useAppStore();
  const [noteInput, setNoteInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'upcoming' | 'tech_tree'>('tech_tree');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      initializeData();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setMediaFile(file);
          setMediaPreview(URL.createObjectURL(file));
          triggerHaptic('light');
          playSound('click');
      }
  };

  const handleAddNote = async () => {
      if (!noteInput.trim() && !mediaFile) return;
      setIsSubmitting(true);
      triggerHaptic('medium');
      playSound('data_stream'); 
      
      const mediaUrl = mediaFile ? mediaPreview : undefined; 
      const mediaType = mediaFile ? (mediaFile.type.startsWith('video') ? 'video' : 'image') : undefined;

      await new Promise(r => setTimeout(r, 800));

      await backend.saveDailyNote(noteInput, mediaUrl, mediaType);
      await initializeData(); 
      
      setNoteInput('');
      setMediaFile(null);
      setMediaPreview(null);
      setIsSubmitting(false);
      
      playSound('success');
      triggerHaptic('success');
  };

  const handleOpenChat = (sessionId: string, title: string, e: React.MouseEvent) => {
      e.stopPropagation();
      triggerHaptic('medium');
      openChat(sessionId, title);
  };

  const skillStats = useMemo(() => {
      if (!user) return { skate: 0, downhill: 0, freestyle: 0 };
      const calculateDiscProgress = (d: Discipline) => {
          const total = skills.filter(s => s.category === d).length;
          const mastered = skills.filter(s => s.category === d && user.masteredSkills.includes(s.id)).length;
          return total > 0 ? Math.round((mastered / total) * 100) : 0;
      };
      return {
          skate: calculateDiscProgress(Discipline.SKATE),
          downhill: calculateDiscProgress(Discipline.DOWNHILL),
          freestyle: calculateDiscProgress(Discipline.FREESTYLE)
      };
  }, [skills, user]);

  const timeline = useMemo(() => {
      const all: any[] = [];
      notes.forEach(n => all.push({ ...n, type: 'note', sortDate: new Date(n.timestamp).getTime() }));
      sessions.forEach(s => {
          if (new Date(s.date) < new Date()) {
              all.push({ ...s, type: 'session', sortDate: new Date(`${s.date}T${s.time}`).getTime() });
          }
      });
      if (user) {
          user.completedChallengeIds.forEach(cid => {
              const challenge = challenges.find(c => c.id === cid);
              if (challenge) {
                  all.push({ ...challenge, type: 'challenge', sortDate: Date.now() - Math.random() * 1000000000 });
              }
          });
      }
      return all.sort((a, b) => b.sortDate - a.sortDate);
  }, [notes, sessions, user, challenges]);

  const upcomingSessions = useMemo(() => {
      const now = new Date();
      now.setHours(0,0,0,0);
      return sessions
        .filter(s => new Date(s.date) >= now)
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
  }, [sessions]);

  return {
    user,
    noteInput,
    setNoteInput,
    isSubmitting,
    activeTab,
    setActiveTab,
    mediaFile,
    setMediaFile,
    mediaPreview,
    setMediaPreview,
    fileInputRef,
    handleFileSelect,
    handleAddNote,
    handleOpenChat,
    skillStats,
    timeline,
    upcomingSessions
  };
};
