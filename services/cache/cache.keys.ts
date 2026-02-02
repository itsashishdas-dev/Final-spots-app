
export const CACHE_KEYS = {
  USER: 'push_user_profile',
  SPOTS: 'push_spots_data',
  SESSIONS: 'push_sessions_data',
  CHALLENGES: 'push_challenges_data',
  CREWS: 'push_crews_data',
  MENTORS: 'push_mentors_data',
  NOTES: 'push_notes_data',
  SYNC_QUEUE: 'push_sync_queue',
  // Dynamic keys usually appended with ID
  CHAT_PREFIX: 'push_chat_',
} as const;
