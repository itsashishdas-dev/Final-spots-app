
import { 
  User, Spot, ExtendedSession, Challenge, 
  Skill, Mentor, Crew, 
  VerificationStatus, Discipline, SpotStatus, SpotCategory, Difficulty, SpotPrivacy,
  ChatMessage, ChallengeSubmission, MentorApplication, DailyNote
} from '../types';
import { MOCK_SPOTS, MOCK_CHALLENGES, MOCK_SESSIONS, MOCK_MENTORS, MOCK_NOTES } from '../core/constants';

const safeStorage = {
  getItem: (key: string) => {
    if (typeof window !== 'undefined') return localStorage.getItem(key);
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
  }
};

const STORAGE_KEYS = {
  USER: 'spots_user',
  SPOTS: 'spots_spots_data',
  SESSIONS: 'spots_sessions',
  CHALLENGES: 'spots_challenges',
  CREWS: 'spots_crews',
  MENTORS: 'spots_mentors',
  NOTES: 'spots_notes',
  CUSTOM_SKILLS: 'spots_custom_skills',
  CHATS: 'spots_chats'
};

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

const MOCK_USER: User = {
  id: 'u-1',
  shareId: '8832',
  name: 'System Admin',
  email: 'admin@push.com', // <--- GRANTS MODERATOR ACCESS
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Admin',
  location: 'Mumbai',
  level: 42,
  xp: 15000,
  disciplines: [Discipline.SKATE, Discipline.DOWNHILL],
  stance: 'regular',
  badges: ['badge_veteran_guardian', 'badge_legend_king'],
  masteredSkills: ['ollie', 'kickflip'],
  landedSkills: ['shuvit'],
  pendingSkills: [],
  locker: [],
  completedChallengeIds: [],
  onboardingComplete: false,
  isLinked: true,
  soundEnabled: true,
  notificationsEnabled: false,
  streak: 12,
  stats: { totalSessions: 42 }
};

const MOCK_CREWS_LIST: Crew[] = [
    {
        id: 'crew-1',
        name: 'Bandra Bombers',
        city: 'Mumbai',
        moto: 'Hill Bomb Everything',
        level: 12,
        totalXp: 45000,
        members: ['u-1', 'u-arjun'],
        adminIds: ['u-arjun'],
        avatar: '💣',
        homeSpotId: 'maharashtra-mumbai-carter',
        homeSpotName: 'Carter Road',
        weeklyGoal: { description: 'Land 50 Kickflips total', current: 32, target: 50 },
        requests: []
    }
];

class MockBackendService {
  private initDB() {
    if (!safeStorage.getItem(STORAGE_KEYS.SPOTS)) {
        safeStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(MOCK_SPOTS));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.SESSIONS)) {
        safeStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(MOCK_SESSIONS));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
        safeStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.MENTORS)) {
        safeStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(MOCK_MENTORS));
    }
    if (!safeStorage.getItem(STORAGE_KEYS.NOTES)) {
        safeStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(MOCK_NOTES));
    }
  }

  private safeParse<T>(key: string, fallback: T): T {
      const data = safeStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
  }

  async login(): Promise<User> {
    this.initDB();
    const storedUser = this.safeParse<User | null>(STORAGE_KEYS.USER, null);
    if (storedUser) return storedUser;
    
    return MOCK_USER;
  }

  async isLoggedIn(): Promise<boolean> {
      // Always return true if user key exists, or if we want to auto-login mock user
      const hasUser = !!safeStorage.getItem(STORAGE_KEYS.USER);
      if (!hasUser) {
          // Auto-seed for dev convenience
          await this.login();
          return true;
      }
      return true;
  }

  async logout(): Promise<void> {
      safeStorage.setItem(STORAGE_KEYS.USER, '');
  }

  async getUser(): Promise<User> {
      const u = this.safeParse<User | null>(STORAGE_KEYS.USER, null);
      return u || MOCK_USER;
  }

  async updateUser(user: User): Promise<User> {
      safeStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return user;
  }

  async completeOnboarding(data: Partial<User>): Promise<User> {
      const user = await this.getUser();
      const updated = { ...user, ...data, onboardingComplete: true };
      return this.updateUser(updated);
  }

  async getSpots(): Promise<Spot[]> {
      this.initDB();
      return this.safeParse<Spot[]>(STORAGE_KEYS.SPOTS, MOCK_SPOTS);
  }

  async addSpot(spotData: Partial<Spot>): Promise<Spot> {
      const spots = await this.getSpots();
      const newSpot: Spot = {
          id: generateId('spot'),
          name: spotData.name || 'Unknown Spot',
          type: spotData.type || Discipline.SKATE,
          category: SpotCategory.STREET,
          difficulty: spotData.difficulty || Difficulty.BEGINNER,
          state: 'Unknown',
          surface: 'Concrete',
          location: spotData.location || { lat: 0, lng: 0, address: '' },
          notes: spotData.notes || '',
          isVerified: false,
          verificationStatus: VerificationStatus.PENDING,
          status: SpotStatus.DRY,
          privacy: spotData.privacy || SpotPrivacy.PUBLIC,
          rating: 0,
          images: spotData.images || [],
          videoUrl: spotData.videoUrl,
          ownerId: spotData.ownerId,
          sessions: [],
          verificationNote: 'User submitted via app'
      };
      spots.push(newSpot);
      safeStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots));
      return newSpot;
  }

  async updateVerification(spotId: string, status: VerificationStatus): Promise<void> {
      const spots = await this.getSpots();
      const idx = spots.findIndex(s => s.id === spotId);
      if (idx !== -1) {
          spots[idx].verificationStatus = status;
          spots[idx].isVerified = status === VerificationStatus.VERIFIED;
          safeStorage.setItem(STORAGE_KEYS.SPOTS, JSON.stringify(spots));
      }
  }

  async getAllSessions(): Promise<ExtendedSession[]> {
      this.initDB();
      return this.safeParse<ExtendedSession[]>(STORAGE_KEYS.SESSIONS, MOCK_SESSIONS);
  }

  async createSession(data: Partial<ExtendedSession>): Promise<ExtendedSession> {
      const sessions = await this.getAllSessions();
      const user = await this.getUser();
      const newSession: ExtendedSession = {
          id: generateId('sess'),
          userId: user.id,
          userName: user.name,
          title: data.title || 'Session',
          date: data.date || new Date().toISOString().split('T')[0],
          time: data.time || '12:00',
          spotId: data.spotId || '',
          spotName: data.spotName || '',
          spotType: data.spotType || Discipline.SKATE,
          intent: data.intent,
          participants: [user.id]
      };
      sessions.push(newSession);
      safeStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      
      user.stats.totalSessions++;
      this.updateUser(user);
      
      return newSession;
  }

  async joinSession(sessionId: string): Promise<void> {
      const sessions = await this.getAllSessions();
      const user = await this.getUser();
      const idx = sessions.findIndex(s => s.id === sessionId);
      if (idx !== -1 && !sessions[idx].participants.includes(user.id)) {
          sessions[idx].participants.push(user.id);
          safeStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      }
  }

  async getAllChallenges(): Promise<Challenge[]> {
      this.initDB();
      return this.safeParse<Challenge[]>(STORAGE_KEYS.CHALLENGES, MOCK_CHALLENGES);
  }

  async createChallenge(data: Partial<Challenge>): Promise<Challenge> {
      const challenges = await this.getAllChallenges();
      const user = await this.getUser();
      const newChallenge: Challenge = {
          id: generateId('chall'),
          spotId: data.spotId || '',
          spotName: data.spotName || '',
          creatorId: user.id,
          creatorName: user.name,
          title: data.title || 'New Challenge',
          description: data.description || '',
          difficulty: data.difficulty || Difficulty.INTERMEDIATE,
          xpReward: data.xpReward || 300,
          completions: 0
      };
      challenges.push(newChallenge);
      safeStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
      return newChallenge;
  }

  async getChallengeSubmissions(id: string): Promise<ChallengeSubmission[]> {
      return [ 
          { id: 'sub-1', challengeId: id, userId: 'u-1', userName: 'Rahul', userAvatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Rahul', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnailUrl: 'https://picsum.photos/seed/skate/200/300', date: '2 days ago', votes: Math.floor(Math.random() * 50) + 10 },
          { id: 'sub-2', challengeId: id, userId: 'u-2', userName: 'Priya', userAvatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Priya', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnailUrl: 'https://picsum.photos/seed/downhill/200/300', date: '5 days ago', votes: Math.floor(Math.random() * 100) + 20 },
          { id: 'sub-3', challengeId: id, userId: 'u-3', userName: 'Vikram', userAvatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Vikram', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnailUrl: 'https://picsum.photos/seed/tech/200/300', date: '1 day ago', votes: Math.floor(Math.random() * 20) + 1 }
      ].sort((a, b) => b.votes - a.votes);
  }

  async upvoteSubmission(submissionId: string): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 200));
  }

  async completeChallenge(challengeId: string): Promise<{ newUnlocks: string[], user: User }> {
      const user = await this.getUser();
      if (!user.completedChallengeIds.includes(challengeId)) {
          user.completedChallengeIds.push(challengeId);
          const challenges = await this.getAllChallenges();
          const ch = challenges.find(c => c.id === challengeId);
          if (ch) {
              user.xp += ch.xpReward;
              if (Math.random() > 0.5) {
                  user.locker.push('sticker_7_day');
                  return { newUnlocks: ['sticker_7_day'], user: await this.updateUser(user) };
              }
          }
      }
      return { newUnlocks: [], user: await this.updateUser(user) };
  }

  async getDailyQuests(): Promise<any[]> {
      return [
          { id: 'CHECK_IN', title: 'Daily Check-in', progress: 0, total: 1, reward: 50 },
          { id: 'SESSION', title: 'Complete a Session', progress: 0, total: 1, reward: 100 }
      ];
  }

  async updateQuestProgress(id: string, amount: number): Promise<void> {
      // Mock implementation
  }

  async getCustomSkills(): Promise<Skill[]> {
      this.initDB();
      return this.safeParse<Skill[]>(STORAGE_KEYS.CUSTOM_SKILLS, []);
  }

  async masterSkill(skillId: string): Promise<User> {
      const user = await this.getUser();
      if (!user.masteredSkills.includes(skillId)) {
          user.masteredSkills.push(skillId);
          user.xp += 200;
          return this.updateUser(user);
      }
      return user;
  }

  async markSkillLanded(skillId: string): Promise<User> {
      const user = await this.getUser();
      if (!user.landedSkills.includes(skillId)) {
          user.landedSkills.push(skillId);
          user.xp += 80;
          return this.updateUser(user);
      }
      return user;
  }

  async getMentors(): Promise<Mentor[]> {
      this.initDB();
      return this.safeParse<Mentor[]>(STORAGE_KEYS.MENTORS, MOCK_MENTORS);
  }

  async bookMentorSession(mentor: Mentor, date: string, time: string): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, 1000));
  }

  async getPendingMentorApplications(): Promise<{ user: User, application: MentorApplication }[]> {
      return this.safeParse('spots_db_mentor_apps', []);
  }

  async applyToBecomeMentor(data: any): Promise<void> {
      const user = await this.getUser();
      const apps = this.safeParse<{ user: User, application: any }[]>('spots_db_mentor_apps', []);
      apps.push({ user, application: data });
      safeStorage.setItem('spots_db_mentor_apps', JSON.stringify(apps));
  }

  async reviewMentorApplication(userId: string, approved: boolean): Promise<void> {
      const apps = this.safeParse<{ user: User, application: any }[]>('spots_db_mentor_apps', []);
      const index = apps.findIndex((a) => a.user.id === userId);
      if (index !== -1) {
          if (approved) {
              const app = apps[index];
              const mentors = await this.getMentors();
              if (!mentors.some(m => m.userId === userId)) {
                  const newMentor: Mentor = {
                      id: generateId('m'),
                      userId: userId,
                      name: app.user.name,
                      avatar: app.user.avatar || '',
                      disciplines: app.user.disciplines || [Discipline.SKATE],
                      rate: app.application.rate || 0,
                      bio: app.application.style || '',
                      rating: 5.0,
                      reviewCount: 0,
                      earnings: 0,
                      studentsTrained: 0,
                      badges: []
                  };
                  mentors.push(newMentor);
                  safeStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(mentors));
              }
          }
          apps.splice(index, 1);
          safeStorage.setItem('spots_db_mentor_apps', JSON.stringify(apps));
      }
  }

  async getDailyNotes(): Promise<DailyNote[]> {
      this.initDB();
      return this.safeParse<DailyNote[]>(STORAGE_KEYS.NOTES, MOCK_NOTES);
  }

  async saveDailyNote(text: string, mediaUrl?: string, mediaType?: 'image'|'video'): Promise<DailyNote> {
      const notes = await this.getDailyNotes();
      const user = await this.getUser();
      const newNote: DailyNote = {
          id: generateId('note'),
          userId: user.id,
          date: new Date().toISOString().split('T')[0],
          text,
          mediaUrl,
          mediaType,
          timestamp: new Date().toISOString()
      };
      notes.unshift(newNote);
      safeStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
      return newNote;
  }

  async getAllCrews(): Promise<Crew[]> {
      this.initDB();
      return this.safeParse<Crew[]>(STORAGE_KEYS.CREWS, MOCK_CREWS_LIST);
  }

  async getUserCrew(crewId: string): Promise<Crew | null> {
      const crews = await this.getAllCrews();
      return crews.find(c => c.id === crewId) || null;
  }

  async createCrew(data: Partial<Crew>): Promise<Crew> {
      const crews = await this.getAllCrews();
      const user = await this.getUser();
      const newCrew: Crew = {
          id: generateId('crew'),
          name: data.name || 'New Unit',
          city: data.city || 'Unknown',
          moto: data.moto || '',
          level: 1,
          totalXp: 0,
          members: [user.id],
          adminIds: [user.id],
          avatar: data.avatar || '🛡️',
          homeSpotId: data.homeSpotId || '',
          homeSpotName: data.homeSpotName || '',
          weeklyGoal: { description: 'Establish Presence', current: 0, target: 10 },
          requests: [],
          maxMembers: data.maxMembers || 10
      };
      crews.push(newCrew);
      safeStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(crews));
      
      user.crewId = newCrew.id;
      this.updateUser(user);
      
      return newCrew;
  }

  async requestJoinCrew(crewId: string): Promise<void> {
      const crews = await this.getAllCrews();
      const user = await this.getUser();
      const crew = crews.find(c => c.id === crewId);
      if (crew && !crew.members.includes(user.id) && !crew.requests.includes(user.id)) {
          crew.requests.push(user.id);
          safeStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(crews));
      }
  }

  async respondToJoinRequest(crewId: string, userId: string, approved: boolean): Promise<Crew> {
      const crews = await this.getAllCrews();
      const crewIndex = crews.findIndex(c => c.id === crewId);
      if (crewIndex === -1) throw new Error("Crew not found");
      
      const crew = crews[crewIndex];
      const reqIdx = crew.requests.indexOf(userId);
      if (reqIdx !== -1) {
          crew.requests.splice(reqIdx, 1);
          if (approved) {
              crew.members.push(userId);
          }
          safeStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(crews));
      }
      return crew;
  }

  async leaveCrew(): Promise<User> {
      const user = await this.getUser();
      if (user.crewId) {
          const crews = await this.getAllCrews();
          const crew = crews.find(c => c.id === user.crewId);
          if (crew) {
              crew.members = crew.members.filter(m => m !== user.id);
              crew.adminIds = crew.adminIds.filter(a => a !== user.id);
              safeStorage.setItem(STORAGE_KEYS.CREWS, JSON.stringify(crews));
          }
          user.crewId = undefined;
          return this.updateUser(user);
      }
      return user;
  }

  async getChatMessages(channelId: string): Promise<ChatMessage[]> {
      const chats = this.safeParse<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHATS, {});
      return chats[channelId] || [];
  }

  async sendChatMessage(channelId: string, text: string): Promise<ChatMessage> {
      const chats = this.safeParse<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHATS, {});
      const user = await this.getUser();
      const msg: ChatMessage = {
          id: generateId('msg'),
          channelId,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          text,
          timestamp: new Date().toISOString()
      };
      
      if (!chats[channelId]) chats[channelId] = [];
      chats[channelId].push(msg);
      
      safeStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
      return msg;
  }

  async grantXp(amount: number, reason: string): Promise<User> {
      const user = await this.getUser();
      user.xp += amount;
      return this.updateUser(user);
  }
}

export const backend = new MockBackendService();
