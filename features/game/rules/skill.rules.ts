
import { Skill, User } from '@/types';

/**
 * PURE DOMAIN LOGIC: SKILL RULES
 * Defines the conditions under which skills can be learned or mastered.
 */

export const SkillRules = {
  /**
   * Checks if a user has met the prerequisites to learn a specific skill.
   */
  canLearnSkill: (user: User, skill: Skill): { allowed: boolean; reason?: string } => {
    if (!skill.prerequisiteId) {
      return { allowed: true };
    }

    const hasLanded = user.landedSkills.includes(skill.prerequisiteId);
    const hasMastered = user.masteredSkills.includes(skill.prerequisiteId);

    if (hasLanded || hasMastered) {
      return { allowed: true };
    }

    return { allowed: false, reason: 'Prerequisite skill not verified.' };
  },

  /**
   * Checks if a skill is fully mastered by the user.
   */
  isMastered: (user: User, skillId: string): boolean => {
    return user.masteredSkills.includes(skillId);
  },

  /**
   * Checks if a skill is currently in the "Learning" list.
   */
  isLearning: (user: User, skillId: string): boolean => {
    return user.pendingSkills.includes(skillId);
  }
};
