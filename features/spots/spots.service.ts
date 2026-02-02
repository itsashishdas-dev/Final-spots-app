
import { Spot, VerificationStatus, SpotCategory, Difficulty, SpotPrivacy, SpotStatus, Discipline } from '@/types';
import { cache, CACHE_KEYS } from '@/services/cache';
import { eventBus } from '@/core/events';
import { supabase } from '@/core/supabase/client';

const SPOTS_CACHE_TTL = 1000 * 60 * 60; // 1 Hour

export const spotsService = {
  /**
   * Get spots using Cache-First, then Network (Supabase Read Model)
   */
  getAll: async (): Promise<{ data: Spot[]; source: 'cache' | 'network' }> => {
    try {
      const cached = await cache.get<Spot[]>(CACHE_KEYS.SPOTS, SPOTS_CACHE_TTL);
      if (cached) {
        return { data: cached, source: 'cache' };
      }
      return { data: await spotsService.fetchFresh(), source: 'network' };
    } catch (error) {
      console.warn('[SpotsService] Network failed.', error);
      return { data: [], source: 'network' }; 
    }
  },

  /**
   * Fetch derived data from Supabase `spots` table.
   */
  fetchFresh: async (): Promise<Spot[]> => {
    try {
      // Query the Read Model, not the Event Stream
      const { data, error } = await supabase
        .from('spots')
        .select('*');

      if (error) throw error;

      // Transform DB shape to App shape (if needed)
      // Note: Supabase returns GeoJSON for geography types if configured, 
      // otherwise we might need to parse the WKT or ST_AsGeoJSON in the query.
      // For this example, assuming the Edge function stored simple lat/lng in JSONB or we parse.
      // Simplified mapping:
      const mappedSpots: Spot[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          type: row.type,
          category: row.category,
          difficulty: row.difficulty,
          // Assuming location parsing or stored as separate columns for simplicity in this step
          location: { lat: 0, lng: 0, address: 'Map Data' }, 
          // Real implementation: Parsing PostGIS point string "POINT(lng lat)"
          notes: row.description,
          isVerified: row.is_verified,
          verificationStatus: row.is_verified ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
          status: SpotStatus.DRY, // Status is usually ephemeral/real-time, separate redis/table
          privacy: SpotPrivacy.PUBLIC,
          rating: 0,
          images: [],
          sessions: [],
          ownerId: row.created_by
      }));

      await cache.set(CACHE_KEYS.SPOTS, mappedSpots);
      return mappedSpots;
    } catch (error) {
      const cached = await cache.get<Spot[]>(CACHE_KEYS.SPOTS);
      if (cached) return cached;
      throw error;
    }
  },

  /**
   * Create a new spot.
   * 1. Updates Local Cache (Optimistic).
   * 2. Emits SPOT_ADDED event.
   * 3. SyncEngine picks up event -> Sends to Supabase Events -> Edge Function -> Supabase Spots.
   */
  create: async (data: Partial<Spot>): Promise<Spot> => {
    const tempId = crypto.randomUUID();
    const newSpot: Spot = {
        id: tempId,
        name: data.name || 'New Spot',
        type: data.type || Discipline.SKATE,
        category: data.category || SpotCategory.STREET,
        difficulty: data.difficulty || Difficulty.BEGINNER,
        state: 'Unknown',
        surface: 'Concrete',
        location: data.location || { lat: 0, lng: 0, address: '' },
        notes: data.notes || '',
        isVerified: false,
        verificationStatus: VerificationStatus.PENDING,
        status: SpotStatus.DRY,
        privacy: data.privacy || SpotPrivacy.PUBLIC,
        rating: 0,
        images: data.images || [],
        sessions: [],
        ownerId: data.ownerId,
        pendingSync: true
    };

    // 1. Optimistic Cache Update
    const current = (await cache.get<Spot[]>(CACHE_KEYS.SPOTS)) || [];
    await cache.set(CACHE_KEYS.SPOTS, [...current, newSpot]);

    // 2. Emit Event (Sync Listener will queue this for Supabase)
    eventBus.emit('SPOT_ADDED', { spot: newSpot, userId: data.ownerId });

    return newSpot;
  },

  verify: async (id: string, status: VerificationStatus): Promise<void> => {
    // 1. Optimistic
    const current = (await cache.get<Spot[]>(CACHE_KEYS.SPOTS)) || [];
    const updated = current.map(s => 
      s.id === id 
        ? { ...s, verificationStatus: status, isVerified: status === VerificationStatus.VERIFIED } 
        : s
    );
    await cache.set(CACHE_KEYS.SPOTS, updated);

    // 2. Emit
    eventBus.emit('SPOT_VERIFIED', { spotId: id, status, adminId: 'current-user' });
  },
};
