
import { cache, CACHE_KEYS } from '@/services/cache';
import { SyncAction, SyncActionType } from './sync.types';

// Re-export types for backward compatibility with features importing from here
export * from './sync.types';

export const syncQueue = {
  /**
   * Add an action to the persistent queue
   */
  async enqueue(type: SyncActionType, payload: any) {
    const queue = await this.getQueue();
    const action: SyncAction = {
      id: crypto.randomUUID ? crypto.randomUUID() : `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      timestamp: Date.now(),
      retryCount: 0
    };
    
    queue.push(action);
    await this.saveQueue(queue);
    console.log(`[SyncQueue] Enqueued: ${type}`, action.id);
  },

  /**
   * Retrieve the current queue from cache
   */
  async getQueue(): Promise<SyncAction[]> {
    return await cache.get<SyncAction[]>(CACHE_KEYS.SYNC_QUEUE) || [];
  },

  /**
   * Persist the queue to cache
   */
  async saveQueue(queue: SyncAction[]): Promise<void> {
    await cache.set(CACHE_KEYS.SYNC_QUEUE, queue);
  },
  
  /**
   * Clear the entire queue (Emergency Use)
   */
  async clear() {
      await cache.remove(CACHE_KEYS.SYNC_QUEUE);
  },

  /**
   * @deprecated logic moved to sync.engine.ts. Kept blank to prevent import crashes during refactor if called.
   */
  init() {
    // No-op
  }
};
