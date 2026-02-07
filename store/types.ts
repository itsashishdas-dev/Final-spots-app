
import { StateCreator } from 'zustand';
import { 
  User, Spot, ExtendedSession, Challenge, Skill, Mentor, 
  AppView, ModalType, Crew, ChatMessage, VerificationStatus, DailyNote, MentorApplication
} from '../types';

export interface UIState {
  currentView: AppView;
  previousView: AppView | null;
  activeModal: ModalType;
  mapViewSettings: { center: { lat: number; lng: number }; zoom: number } | null;
  isLoading: boolean;
  error: string | null;
  isPinDropActive: boolean;
  
  setView: (view: AppView) => void;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  setMapViewSettings: (settings: { center: { lat: number; lng: number }; zoom: number } | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPinDropActive: (active: boolean) => void;
}

export interface UserState {
  user: User | null;
  location: { lat: number; lng: number } | null;
  isAuthenticated: boolean;
  
  initializeUser: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: any) => Promise<void>;
  setUserLocation: (lat: number, lng: number) => void;
  updateUser: (user: User) => void; 
  updateProfile: (data: Partial<User>) => Promise<void>; 
  toggleSound: () => void;
  toggleNotifications: () => void;
}

export interface SpotsState {
  spots: Spot[];
  selectedSpot: Spot | null;
  lastUpdated: number;
  isStale: boolean;
  lastEdit: { spotId: string, previousState: Spot } | null;
  tempLocation: { lat: number, lng: number } | null;
  
  refreshSpots: () => Promise<void>;
  addNewSpot: (spotData: Partial<Spot>) => Promise<Spot>;
  updateSpot: (id: string, updates: Partial<Spot>) => Promise<void>;
  undoLastEdit: () => Promise<void>;
  selectSpot: (spot: Spot | null) => void;
  verifySpot: (spotId: string, status: VerificationStatus) => Promise<void>;
  deleteSpot: (spotId: string) => Promise<void>;
  setTempLocation: (loc: { lat: number, lng: number } | null) => void;
}

export interface SessionState {
  sessions: ExtendedSession[];
  mentors: Mentor[];
  pendingMentorApplications: { user: User, application: MentorApplication }[];
  chatChannel: { id: string; title: string } | null;
  chatMessages: Record<string, ChatMessage[]>;
  
  refreshSessions: () => Promise<void>;
  createSession: (data: Partial<ExtendedSession>) => Promise<void>;
  joinSession: (sessionId: string) => Promise<void>;
  bookMentorSession: (mentor: Mentor, date: string, time: string) => Promise<void>;
  loadMentorApplications: () => Promise<void>;
  reviewMentorApplication: (userId: string, approved: boolean) => Promise<void>;
  openChat: (channelId: string, title: string) => void;
  loadChatMessages: (channelId: string) => Promise<void>;
  sendChatMessage: (channelId: string, text: string) => Promise<void>;
}

export interface GameState {
  challenges: Challenge[];
  quests: any[];
  skills: Skill[];
  notes: DailyNote[];
  selectedSkill: Skill | null;
  
  initializeGameData: () => Promise<void>;
  createChallenge: (data: Partial<Challenge>) => Promise<void>;
  deleteChallenge: (challengeId: string) => Promise<void>;
  upvoteSubmission: (submissionId: string) => Promise<void>;
  selectSkill: (skill: Skill | null) => void;
  markSkillLanded: (skillId: string) => Promise<void>;
  masterSkill: (skillId: string) => Promise<void>;
  saveDailyNote: (text: string, mediaUrl?: string, mediaType?: 'image'|'video') => Promise<void>;
  completeChallengeAction: (challengeId: string) => Promise<{ newUnlocks: string[] }>;
  grantXp: (amount: number, reason: string) => Promise<void>;
  updateQuestProgress: (questId: string, amount: number) => Promise<void>;
}

export interface CrewState {
  crews: Crew[];
  activeCrew: Crew | null;
  
  loadCrews: () => Promise<void>;
  loadUserCrew: (crewId: string) => Promise<void>;
  createCrew: (data: Partial<Crew>) => Promise<void>;
  deleteCrew: (crewId: string) => Promise<void>;
  requestJoinCrew: (crewId: string) => Promise<void>;
  respondToJoinRequest: (crewId: string, userId: string, approved: boolean) => Promise<void>;
  leaveCrew: () => Promise<void>;
}

export type AppState = UIState & UserState & SpotsState & SessionState & GameState & CrewState;

export type StoreSlice<T> = StateCreator<AppState, [], [], T>;
