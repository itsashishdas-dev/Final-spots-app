
import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../../store';
import { triggerHaptic } from '../../../utils/haptics';
import { playSound } from '../../../utils/audio';

export const useProfile = (onLogout: () => void, setActiveTab: (tab: string) => void) => {
  const { user, updateProfile, activeCrew, loadUserCrew, toggleNotifications, toggleSound } = useAppStore();
  const [activeSection, setActiveSection] = useState<'overview' | 'badges' | 'history'>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutLog, setLogoutLog] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [editForm, setEditForm] = useState({
      name: '',
      bio: '',
      stance: 'regular' as 'regular' | 'goofy',
      avatar: '',
      phoneNumber: '',
      address: '',
      age: 0,
      gender: ''
  });
  
  const [isLinked, setIsLinked] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
        if (user) {
            setEditForm({
                name: user.name,
                bio: user.bio || '',
                stance: user.stance || 'regular',
                avatar: user.avatar || '',
                phoneNumber: user.phoneNumber || '',
                address: user.address || '',
                age: user.age || 0,
                gender: user.gender || ''
            });
            setIsLinked(!!user.isLinked);
            if (user.crewId) {
                await loadUserCrew(user.crewId);
            }
        }
    };
    loadData();
  }, [user, showSettings]);

  useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logoutLog]);

  const handleSaveProfile = async () => {
      if (!user) return;
      
      if (!isLinked) {
          triggerHaptic('error');
          playSound('error');
          alert("SECURITY PROTOCOL: You must link a Neural ID (Google/Apple) to save core identity data.");
          return;
      }

      triggerHaptic('success');
      playSound('success');
      
      await updateProfile({
          name: editForm.name,
          bio: editForm.bio,
          stance: editForm.stance,
          avatar: editForm.avatar,
          phoneNumber: editForm.phoneNumber,
          address: editForm.address,
          age: editForm.age,
          gender: editForm.gender,
          isLinked: true
      });
      
      setIsEditing(false);
  };

  const handleLinkAccount = async () => {
      triggerHaptic('success');
      playSound('unlock');
      setIsLinked(true);
      if (user) {
          await updateProfile({ isLinked: true });
      }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          setEditForm(prev => ({ ...prev, avatar: url }));
          triggerHaptic('light');
      }
  };

  const handleToggleSfx = () => {
      if (!user) return;
      toggleSound();
      triggerHaptic('medium');
      if (!user.soundEnabled) playSound('click');
  };

  const handleToggleNotifications = async () => {
      if (!user) return;
      triggerHaptic('medium');
      
      if (!user.notificationsEnabled) {
          if ('Notification' in window) {
              try {
                  const permission = await Notification.requestPermission();
                  if (permission === 'granted') {
                      toggleNotifications();
                      playSound('success');
                  } else {
                      alert("Notifications blocked by browser.");
                  }
              } catch (e) {
                  console.error("Notification Error", e);
              }
          } else {
              toggleNotifications();
              playSound('success');
          }
      } else {
          toggleNotifications();
          playSound('click');
      }
  };

  const handleSectionChange = (section: 'overview' | 'badges' | 'history') => {
      triggerHaptic('medium');
      playSound('tactile_select');
      setActiveSection(section);
  };

  const handleLogout = () => {
      triggerHaptic('heavy');
      playSound('goodbye');
      setShowSettings(false);
      setIsLoggingOut(true);

      const logs = [
          "> INITIATING SEQUENCE...",
          "> ENCRYPTING LOCAL CACHE...",
          "> UPLOADING SESSION STATS...",
          "> SEVERING NEURAL UPLINK...",
          "> SYSTEM HALTED."
      ];

      let delay = 0;
      logs.forEach((log, index) => {
          delay += Math.random() * 80 + 50;
          setTimeout(() => {
              setLogoutLog(prev => [...prev, log]);
              playSound('data_stream');
              if (index === logs.length - 1) {
                  setTimeout(onLogout, 400);
              }
          }, delay);
      });
  };

  const navigateToCrew = () => {
      triggerHaptic('light');
      setActiveTab('CREW');
  };

  return {
    user,
    activeCrew,
    activeSection,
    showSettings,
    setShowSettings,
    showGame,
    setShowGame,
    isEditing,
    setIsEditing,
    isLoggingOut,
    logoutLog,
    bottomRef,
    editForm,
    setEditForm,
    isLinked,
    avatarInputRef,
    handleSaveProfile,
    handleLinkAccount,
    handleAvatarChange,
    handleToggleSfx,
    handleToggleNotifications,
    handleSectionChange,
    handleLogout,
    navigateToCrew
  };
};
