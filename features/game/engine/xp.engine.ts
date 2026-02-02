
import { XP_SOURCES } from '@/core/constants';

/**
 * PURE DOMAIN LOGIC: XP ENGINE
 * No API calls, no Store access, no UI.
 * Just math and business rules.
 */

// Base XP required for level 1 -> 2
const BASE_LEVEL_XP = 100;
// XP scaling factor per level
const LEVEL_MULTIPLIER = 40;

export const XPEngine = {
  /**
   * Calculates the level based on total accumulated XP.
   * Formula: Quadratic progression approx.
   */
  calculateLevel: (totalXp: number): number => {
    let level = 1;
    let xpForNext = BASE_LEVEL_XP;
    let currentTotal = totalXp;

    while (currentTotal >= xpForNext) {
      currentTotal -= xpForNext;
      level++;
      xpForNext = BASE_LEVEL_XP + (level * LEVEL_MULTIPLIER);
    }
    return level;
  },

  /**
   * Calculates XP required to reach the next level from the current level.
   */
  getXpRequiredForNextLevel: (currentLevel: number): number => {
    let total = 0;
    for (let i = 1; i < currentLevel + 1; i++) {
        total += BASE_LEVEL_XP + (i * LEVEL_MULTIPLIER);
    }
    return total;
  },

  /**
   * Calculates progress percentage towards the next level.
   */
  getLevelProgress: (totalXp: number, currentLevel: number): number => {
    // Calculate total XP needed to reach current level
    let xpToReachCurrent = 0;
    for (let i = 1; i < currentLevel; i++) {
        xpToReachCurrent += BASE_LEVEL_XP + (i * LEVEL_MULTIPLIER);
    }

    const xpInCurrentLevel = totalXp - xpToReachCurrent;
    const xpNeededForNext = BASE_LEVEL_XP + (currentLevel * LEVEL_MULTIPLIER);

    return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));
  },

  /**
   * resolving the XP amount for a specific action type
   */
  getXpAmount: (action: keyof typeof XP_SOURCES): number => {
    return XP_SOURCES[action] || 0;
  }
};
