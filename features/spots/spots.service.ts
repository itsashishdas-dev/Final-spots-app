
import { Spot, VerificationStatus, SpotCategory, Difficulty, SpotPrivacy, SpotStatus, Discipline } from '@/types';
import { cache, CACHE_KEYS } from '@/services/cache';
import { eventBus } from '@/core/events';
import { supabase } from '@/core/supabase/client';
import { MOCK_SPOTS } from '@/core/constants';

const SPOTS_CACHE_TTL = 1000 * 60 * 60; // 1 Hour

// Robustly parse Geometry (Point or LineString)
const parseGeometry = (geo: any): { path?: [number, number][], lat?: number, lng?: number } => {
  if (!geo) return {};

  let geometry = geo;
  // Handle case where PostGIS returns a string instead of JSON object
  if (typeof geo === 'string') {
    try {
      geometry = JSON.parse(geo);
    } catch {
      return {};
    }
  }

  if (typeof geometry !== 'object') return {};

  // Handle LineString (Routes)
  if (geometry.type === 'LineString' && Array.isArray(geometry.coordinates)) {
    // GeoJSON is [lng, lat], Leaflet wants [lat, lng]
    const path = geometry.coordinates.map((p: number[]) => [p[1], p[0]] as [number, number]);
    return { path };
  }

  // Handle Point (Spots)
  if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
    // GeoJSON is [lng, lat]
    return { 
        lat: geometry.coordinates[1], 
        lng: geometry.coordinates[0] 
    };
  }

  return {};
};

const mapBackendType = (type: string): { type: Discipline, category: SpotCategory } => {
  const t = (type || '').toLowerCase();
  if (t === 'downhill') return { type: Discipline.DOWNHILL, category: SpotCategory.DOWNHILL };
  if (t === 'park') return { type: Discipline.SKATE, category: SpotCategory.PARK };
  return { type: Discipline.SKATE, category: SpotCategory.STREET };
};

export const spotsService = {
  getAll: async (): Promise<{ data: Spot[]; source: 'cache' | 'network' }> => {
    try {
      const cached = await cache.get<Spot[]>(CACHE_KEYS.SPOTS, SPOTS_CACHE_TTL);
      if (cached && cached.length > 0) return { data: cached, source: 'cache' };
      
      const fresh = await spotsService.fetchFresh();
      return { data: fresh, source: 'network' };
    } catch (error) {
      // Final Fallback to MOCK_SPOTS to ensure app usability
      return { data: MOCK_SPOTS, source: 'network' }; 
    }
  },

  fetchFresh: async (): Promise<Spot[]> => {
    try {
      // 1. Fetch from 'spots' table (fallback to this if view missing)
      // Note: We use 'spots' table directly as 'spots_with_latlng' view might not exist in a fresh project
      const { data, error } = await supabase
        .from('spots') 
        .select('*');

      if (error) {
          console.warn('📡 Supabase Fetch Error (Spots):', error.message);
          throw error;
      }

      if (!data || data.length === 0) {
          console.log('📡 Supabase returned 0 spots. Using Mock Data.');
          return MOCK_SPOTS;
      }

      console.log('📡 PUSH Debug: Supabase Spots Received:', data.length);

      const mappedSpots: Spot[] = data.map((row: any) => {
        // Parse location: PostGIS geometry or explicit columns
        const { path, lat: geoLat, lng: geoLng } = parseGeometry(row.location);
        const { type, category } = mapBackendType(row.type);
        
        let lat = Number(row.lat) || Number(row.latitude) || geoLat || 0;
        let lng = Number(row.lng) || Number(row.longitude) || geoLng || 0;

        // Fallback for path start
        if ((lat === 0 || lng === 0) && path && path.length > 0) {
            lat = path[0][0];
            lng = path[0][1];
        }

        return {
          id: row.id,
          name: row.name || 'Unknown Spot',
          type: type,
          category: category,
          difficulty: (row.difficulty || 'beginner').toUpperCase() as Difficulty,
          location: { 
            lat, 
            lng, 
            address: row.address || row.city || 'Map Data' 
          },
          path: path,
          surface: row.surface || 'Unknown',
          notes: row.description || '',
          isVerified: !!row.is_verified,
          verificationStatus: row.is_verified ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
          status: SpotStatus.DRY,
          privacy: SpotPrivacy.PUBLIC,
          rating: 0,
          images: row.images || [], 
          sessions: [],
          ownerId: row.created_by
        };
      });

      // Filter out invalid spots (0,0 coordinates)
      const validSpots = mappedSpots.filter(s => Math.abs(s.location.lat) > 0.1);

      if (validSpots.length === 0) return MOCK_SPOTS;

      await cache.set(CACHE_KEYS.SPOTS, validSpots);
      return validSpots;

    } catch (error) {
      console.error('❌ PUSH Error: Supabase Fetch Failed, falling back to Mocks:', error);
      // On critical failure (e.g. table missing), return Mocks so app works
      return MOCK_SPOTS;
    }
  },

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
        path: data.path,
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
    const current = (await cache.get<Spot[]>(CACHE_KEYS.SPOTS)) || [];
    await cache.set(CACHE_KEYS.SPOTS, [...current, newSpot]);
    eventBus.emit('SPOT_ADDED', { spot: newSpot, userId: data.ownerId });
    return newSpot;
  },

  update: async (id: string, updates: Partial<Spot>): Promise<Spot> => {
    const payload: any = {};
    if (updates.name) payload.name = updates.name;
    if (updates.difficulty) payload.difficulty = updates.difficulty.toLowerCase();
    if (updates.type) payload.type = updates.type;
    
    if (updates.location) {
        // Construct GeoJSON point
        payload.location = {
            type: 'Point',
            coordinates: [updates.location.lng, updates.location.lat]
        };
    }

    try {
        const { data, error } = await supabase
            .from('spots')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
    } catch(e) {
        console.warn('Update failed (Offline/Error), sync queue will handle it.');
    }

    return { ...updates, id } as Spot; 
  },

  logEdit: async (data: { 
    spotId: string, 
    editorId: string, 
    prevLat: number, 
    prevLng: number, 
    newLat: number, 
    newLng: number 
  }): Promise<void> => {
    try {
      const { error } = await supabase
        .from('spot_edits')
        .insert({
          spot_id: data.spotId,
          editor_id: data.editorId,
          previous_lat: data.prevLat,
          previous_lng: data.prevLng,
          new_lat: data.newLat,
          new_lng: data.newLng,
          timestamp: new Date().toISOString()
        });
        
      if (error) console.warn('⚠️ Audit Log Failed (Non-critical):', error.message);
    } catch (e) {
      console.warn('⚠️ Audit Log Exception:', e);
    }
  },

  verify: async (id: string, status: VerificationStatus): Promise<void> => {
    const current = (await cache.get<Spot[]>(CACHE_KEYS.SPOTS)) || [];
    const updated = current.map(s => 
      s.id === id 
        ? { ...s, verificationStatus: status, isVerified: status === VerificationStatus.VERIFIED } 
        : s
    );
    await cache.set(CACHE_KEYS.SPOTS, updated);
    eventBus.emit('SPOT_VERIFIED', { spotId: id, status, adminId: 'current-user' });
  },
};
