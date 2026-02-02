
import { useState, useMemo, useRef, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { Mentor, Discipline } from '../../../types';
import { askAICoach } from '../../../services/geminiService';
import { triggerHaptic } from '../../../utils/haptics';
import { playSound } from '../../../utils/audio';

export const useMentorship = () => {
  const { user, bookMentorSession, mentors } = useAppStore();
  const [activeTab, setActiveTab] = useState<'find' | 'ai-coach' | 'apply'>('find');
  const [searchQuery, setSearchQuery] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState<Discipline | 'ALL'>('ALL');
  
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('Today');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [aiInput, setAiInput] = useState('');
  const [chat, setChat] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (activeTab === 'ai-coach') chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, activeTab]);

  const isEligibleForMentor = user && user.level >= 15 && user.badges.includes('badge_veteran_guardian');

  const filteredMentors = useMemo(() => {
    let result = mentors.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (disciplineFilter !== 'ALL') {
        result = result.filter(m => m.disciplines.includes(disciplineFilter));
    }
    return result;
  }, [mentors, searchQuery, disciplineFilter]);

  const handleAiSend = async (textOverride?: string) => {
    const textToSend = textOverride || aiInput;
    if (!textToSend.trim() || isAiThinking) return;
    
    setAiInput('');
    setChat(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsAiThinking(true);
    triggerHaptic('light');
    playSound('click');
    
    try {
        const response = await askAICoach(textToSend);
        setChat(prev => [...prev, { role: 'model', text: response }]);
        triggerHaptic('medium');
        playSound('data_stream');
    } catch {
        setChat(prev => [...prev, { role: 'model', text: "System Offline. Connection Failed." }]);
    } finally {
        setIsAiThinking(false);
    }
  };

  const handleBookSession = async () => {
      if (!selectedSlot || !selectedMentor) return;
      setIsBooking(true);
      triggerHaptic('medium');
      
      try {
          await bookMentorSession(selectedMentor, selectedDate, selectedSlot);
          
          setIsBooking(false);
          setBookingSuccess(true);
          triggerHaptic('success');
          playSound('success');
      } catch (e) {
          setIsBooking(false);
          triggerHaptic('error');
          playSound('error');
      }
  };

  const closeProfile = () => {
      setSelectedMentor(null);
      setSelectedSlot(null);
      setBookingSuccess(false);
  };

  return {
    user,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    disciplineFilter,
    setDisciplineFilter,
    filteredMentors,
    selectedMentor,
    setSelectedMentor,
    selectedSlot,
    setSelectedSlot,
    isBooking,
    bookingSuccess,
    handleBookSession,
    closeProfile,
    aiInput,
    setAiInput,
    chat,
    isAiThinking,
    chatEndRef,
    handleAiSend,
    isEligibleForMentor
  };
};
