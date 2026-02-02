
import { backend } from '@/services/mockBackend';
import { cache, CACHE_KEYS } from '@/services/cache';
import { syncQueue } from '@/services/sync/queue';
import { Challenge } from '@/types';

const CHALLENGES_TTL = 1000 * 60 * 60; // 1 hour

export const challengesService = {
    /**
     * Get challenges with cache-first strategy
     */
    getAll: async () => {
        const cached = await cache.get<Challenge[]>(CACHE_KEYS.CHALLENGES, CHALLENGES_TTL);
        if (cached) return { data: cached, source: 'cache' as const };
        
        try {
            const fresh = await backend.getAllChallenges();
            await cache.set(CACHE_KEYS.CHALLENGES, fresh);
            return { data: fresh, source: 'network' as const };
        } catch (error) {
            // Fallback to expired cache if available
            const expired = await cache.get<Challenge[]>(CACHE_KEYS.CHALLENGES);
            return { data: expired || [], source: 'cache' as const };
        }
    },
    
    /**
     * Upvote submission with offline queue support
     */
    upvote: async (submissionId: string) => {
        if (navigator.onLine) {
            try {
                await backend.upvoteSubmission(submissionId);
            } catch {
                await syncQueue.enqueue('UPVOTE_SUBMISSION', { submissionId });
            }
        } else {
            await syncQueue.enqueue('UPVOTE_SUBMISSION', { submissionId });
        }
    }
};
