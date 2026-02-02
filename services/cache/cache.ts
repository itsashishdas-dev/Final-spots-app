
import { APP_CONFIG } from '@/core/config';

/**
 * Lightweight Cache Layer
 * Abstraction over storage mechanism (currently localStorage).
 * 
 * Why this exists:
 * 1. Decouples business logic from specific storage APIs.
 * 2. Allows easy migration to IndexedDB or AsyncStorage later.
 * 3. Centralizes error handling for storage quotas.
 */

const STORAGE_PREFIX = 'push_v1_';

const formatKey = (key: string) => `${STORAGE_PREFIX}${key}`;

interface CacheEnvelope<T> {
  data: T;
  timestamp: number;
  appVersion: string;
}

export const cache = {
  /**
   * Retrieve data from cache
   * @param key Cache key
   * @param ttlMs Optional Time-To-Live in milliseconds. If provided, invalidates data older than this.
   */
  get: async <T>(key: string, ttlMs?: number): Promise<T | null> => {
    try {
      const serialized = localStorage.getItem(formatKey(key));
      if (!serialized) return null;
      
      // Attempt to parse envelope
      let envelope: CacheEnvelope<T>;
      try {
        envelope = JSON.parse(serialized);
      } catch {
        // If parsing fails, it's likely legacy data or corrupt. Invalidate.
        console.debug(`[Cache] Format mismatch for ${key}. Invalidating.`);
        localStorage.removeItem(formatKey(key));
        return null;
      }

      // Check for valid envelope structure
      if (!envelope || typeof envelope.timestamp !== 'number' || !envelope.appVersion) {
         localStorage.removeItem(formatKey(key));
         return null;
      }

      // 1. Version Check (Invalidate on App Update)
      // This ensures schema changes in new versions don't crash the app with old data.
      if (envelope.appVersion !== APP_CONFIG.version) {
        console.log(`[Cache] Invalidate ${key}: Version mismatch (${envelope.appVersion} vs ${APP_CONFIG.version})`);
        localStorage.removeItem(formatKey(key));
        return null;
      }

      // 2. TTL Check (Invalidate on Time)
      if (ttlMs) {
        const age = Date.now() - envelope.timestamp;
        if (age > ttlMs) {
           console.log(`[Cache] Invalidate ${key}: Expired (${age}ms > ${ttlMs}ms)`);
           localStorage.removeItem(formatKey(key));
           return null;
        }
      }

      return envelope.data;
    } catch (error) {
      console.warn(`[Cache] Read Error (${key}):`, error);
      return null;
    }
  },

  /**
   * Save data to cache with metadata
   */
  set: async <T>(key: string, data: T): Promise<void> => {
    try {
      const envelope: CacheEnvelope<T> = {
        data,
        timestamp: Date.now(),
        appVersion: APP_CONFIG.version
      };
      localStorage.setItem(formatKey(key), JSON.stringify(envelope));
    } catch (error) {
      console.error(`[Cache] Write Error (${key}):`, error);
      // Potential fallback: Clear old cache to make space?
    }
  },

  /**
   * Remove specific key
   */
  remove: async (key: string): Promise<void> => {
    try {
      localStorage.removeItem(formatKey(key));
    } catch (error) {
      console.warn(`[Cache] Delete Error (${key}):`, error);
    }
  },

  /**
   * Clear all app-specific keys
   */
  clear: async (): Promise<void> => {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch (error) {
      console.warn('[Cache] Clear Error:', error);
    }
  }
};
