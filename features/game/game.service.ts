
import { backend } from '@/services/mockBackend';
import { syncQueue } from '@/services/sync/queue';

export const gameService = {
    /**
     * Grant XP with offline queue support.
     * Returns the updated user if online, or null if queued.
     */
    grantXp: async (amount: number, reason: string) => {
        if (navigator.onLine) {
            try {
                return await backend.grantXp(amount, reason);
            } catch {
                await syncQueue.enqueue('GRANT_XP', { amount, reason });
                return null;
            }
        } else {
            await syncQueue.enqueue('GRANT_XP', { amount, reason });
            return null;
        }
    }
};
