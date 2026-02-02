
import { StoreSlice, GameState } from './types';
import { backend } from '../services/mockBackend';
import { Challenge, Skill } from '../types';
import { SKILL_LIBRARY } from '../core/constants';
import { challengesService } from '../features/challenges/challenges.service';
import { gameService } from '../features/game/game.service';
import { XPEngine } from '../features/game/engine/xp.engine';

export const createGameSlice: StoreSlice<GameState> = (set, get) => ({
  challenges: [],
  quests: [],
  skills: [],
  notes: [],
  selectedSkill: null,

  initializeGameData: async () => {
    // Parallel fetch for speed
    const [challengesResult, quests, customSkills, notes, spots] = await Promise.all([
      challengesService.getAll(),
      backend.getDailyQuests(),
      backend.getCustomSkills(),
      backend.getDailyNotes(),
      backend.getSpots()
    ]);

    const enrichedChallenges = challengesResult.data.map(c => {
      const spot = spots.find(s => s.id === c.spotId);
      return { ...c, spotName: spot ? spot.name : 'Unknown Spot' };
    });

    const allSkills = [...SKILL_LIBRARY, ...customSkills];

    set({ 
      challenges: enrichedChallenges, 
      quests, 
      skills: allSkills,
      notes
    });
  },

  createChallenge: async (data: Partial<Challenge>) => {
    await backend.createChallenge(data);
    // Refresh challenges
    await get().initializeGameData();
  },

  upvoteSubmission: async (submissionId: string) => {
    // Optimistic UI updates are handled in the component/view usually
    // This action ensures the backend (or queue) gets the request
    await challengesService.upvote(submissionId);
  },

  selectSkill: (skill: Skill | null) => {
    set({ selectedSkill: skill });
  },

  markSkillLanded: async (skillId: string) => {
      // 1. Optimistic Update using Engine Logic (if needed) or pure state append
      const currentUser = get().user;
      if (currentUser && !currentUser.landedSkills.includes(skillId)) {
          const reward = 80; // Should ideally come from Skill definition via Engine
          const newXp = currentUser.xp + reward;
          const newLevel = XPEngine.calculateLevel(newXp);
          
          set({ 
              user: { 
                  ...currentUser, 
                  landedSkills: [...currentUser.landedSkills, skillId],
                  xp: newXp,
                  level: newLevel
              } 
          });
      }

      // 2. Persist
      const updatedUser = await backend.markSkillLanded(skillId);
      
      // 3. Reconcile
      set({ user: updatedUser });
  },

  masterSkill: async (skillId: string) => {
      const updatedUser = await backend.masterSkill(skillId);
      set({ user: updatedUser });
  },

  saveDailyNote: async (text: string, mediaUrl?: string, mediaType?: 'image'|'video') => {
      const newNote = await backend.saveDailyNote(text, mediaUrl, mediaType);
      set(state => ({ notes: [newNote, ...state.notes] }));
  },

  completeChallengeAction: async (challengeId: string) => {
      const { newUnlocks, user } = await backend.completeChallenge(challengeId);
      set({ user });
      return { newUnlocks };
  },

  grantXp: async (amount: number, reason: string) => {
      const currentUser = get().user;
      
      // 1. Pure Logic Calculation (Offline First)
      if (currentUser) {
          const newXp = currentUser.xp + amount;
          const newLevel = XPEngine.calculateLevel(newXp);
          
          // Apply optimistic update immediately
          set({ 
              user: { 
                  ...currentUser, 
                  xp: newXp,
                  level: newLevel
              } 
          });
      }

      // 2. Service Call (Queued if offline)
      // The service returns the *server* version of the user if online, or null if queued.
      const serverUser = await gameService.grantXp(amount, reason);
      
      // 3. Reconcile if server returned data
      if (serverUser) {
          set({ user: serverUser });
      }
  },

  updateQuestProgress: async (questId: string, amount: number) => {
      await backend.updateQuestProgress(questId, amount);
      const quests = await backend.getDailyQuests();
      set({ quests });
  }
});
