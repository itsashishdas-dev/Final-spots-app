
// --- ENUMS & SHARED CONTRACTS ---

export enum Discipline {
  SKATE = 'SKATE',
  DOWNHILL = 'DOWNHILL',
  FREESTYLE = 'FREESTYLE'
}

export enum Difficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  PRO = 'PRO'
}

export enum BadgeTier {
  ROOKIE = 'ROOKIE',
  INITIATE = 'INITIATE',
  SKILLED = 'SKILLED',
  VETERAN = 'VETERAN',
  LEGEND = 'LEGEND'
}

export enum MentorBadge {
  CERTIFIED = 'CERTIFIED',
  EXPERT = 'EXPERT'
}

export enum SpotCategory {
  PARK = 'PARK',
  STREET = 'STREET',
  DOWNHILL = 'DOWNHILL',
  DIY = 'DIY',
  FLATGROUND = 'FLATGROUND'
}

export enum SpotStatus {
  DRY = 'DRY',
  WET = 'WET',
  CROWDED = 'CROWDED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum SpotPrivacy {
  PUBLIC = 'PUBLIC',
  CREW = 'CREW',
  PRIVATE = 'PRIVATE'
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED'
}

export enum CollectibleType {
  DECK = 'DECK',
  STICKER = 'STICKER',
  WHEEL = 'WHEEL',
  TRUCK = 'TRUCK'
}

export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

// --- DATA INTERFACES ---

export interface Spot {
  id: string;
  name: string;
  type: Discipline;
  category: SpotCategory;
  difficulty: Difficulty;
  state: string;
  surface: string;
  location: { lat: number; lng: number; address: string };
  notes: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  status: SpotStatus;
  privacy: SpotPrivacy;
  rating: number;
  images: string[];
  ownerId?: string;
  videoUrl?: string;
  sessions?: string[];
  verificationNote?: string;
  pendingSync?: boolean; // Indicates locally created, waiting for sync
}

export interface User {
  id: string;
  shareId: string;
  name: string;
  email?: string;
  avatar: string;
  bio?: string;
  location: string;
  level: number;
  xp: number;
  disciplines: Discipline[];
  stance: 'regular' | 'goofy';
  crewId?: string;
  badges: string[];
  masteredSkills: string[];
  landedSkills: string[];
  pendingSkills: string[];
  locker: string[];
  completedChallengeIds: string[];
  onboardingComplete: boolean;
  isLinked: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  streak: number;
  stats: { totalSessions: number };
  phoneNumber?: string;
  address?: string;
  age?: number;
  gender?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: Discipline;
  difficulty: Difficulty;
  tier: 1 | 2 | 3 | 4;
  xpReward: number;
  description: string;
  tutorialUrl?: string;
  prerequisiteId?: string;
}

export type SkillState = 'LOCKED' | 'LEARNING' | 'LANDED' | 'MASTERED';

export interface Challenge {
  id: string;
  spotId: string;
  spotName: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  xpReward: number;
  completions: number;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  videoUrl: string;
  thumbnailUrl: string;
  date: string;
  votes: number;
}

export interface ExtendedSession {
  id: string;
  userId: string;
  userName: string;
  title: string;
  date: string;
  time: string;
  spotId: string;
  spotName: string;
  spotType: Discipline;
  intent?: string;
  participants: string[];
}

export interface Crew {
  id: string;
  name: string;
  city: string;
  moto: string;
  level: number;
  totalXp: number;
  members: string[];
  adminIds: string[];
  avatar: string;
  homeSpotId: string;
  homeSpotName: string;
  weeklyGoal: { description: string; current: number; target: number };
  requests: string[];
  maxMembers?: number;
}

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  disciplines: Discipline[];
  rate: number;
  bio: string;
  rating: number;
  reviewCount: number;
  earnings: number;
  studentsTrained: number;
  badges: MentorBadge[];
  stats?: { technical: number; style: number; teaching: number };
}

export interface MentorApplication {
  experience: string;
  style: string;
  rate: number;
  demoUrl?: string;
}

export interface Booking {
  id: string;
  mentorId: string;
  userId: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  tier: BadgeTier;
  icon: string;
  conditionDescription: string;
}

export interface Collectible {
  id: string;
  name: string;
  type: CollectibleType;
  rarity: Rarity;
  imageUrl: string;
  description: string;
}

export interface DailyNote {
  id: string;
  userId: string;
  date: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export type AppView = 'MAP' | 'LIST' | 'CHALLENGES' | 'MENTORSHIP' | 'JOURNEY' | 'PROFILE' | 'CREW' | 'ADMIN';
export type ModalType = 'NONE' | 'SPOT_DETAIL' | 'ADD_SPOT' | 'CREATE_SESSION' | 'CREATE_CHALLENGE' | 'CHAT' | 'CHECK_IN';
