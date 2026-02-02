
import { StoreSlice, SessionState } from './types';
import { backend } from '../services/mockBackend';
import { Mentor, ExtendedSession } from '../types';

export const createSessionSlice: StoreSlice<SessionState> = (set, get) => ({
  sessions: [],
  mentors: [],
  pendingMentorApplications: [],
  chatChannel: null,
  chatMessages: {},

  refreshSessions: async () => {
    const [sessions, mentors] = await Promise.all([
        backend.getAllSessions(),
        backend.getMentors()
    ]);
    set({ sessions, mentors });
  },

  createSession: async (data: Partial<ExtendedSession>) => {
    await backend.createSession(data);
    await get().refreshSessions();
  },

  joinSession: async (sessionId: string) => {
    await backend.joinSession(sessionId);
    await get().refreshSessions();
  },

  bookMentorSession: async (mentor: Mentor, date: string, time: string) => {
    await backend.bookMentorSession(mentor, date, time);
    await get().refreshSessions(); 
  },

  loadMentorApplications: async () => {
      const apps = await backend.getPendingMentorApplications();
      set({ pendingMentorApplications: apps });
  },

  reviewMentorApplication: async (userId: string, approved: boolean) => {
      await backend.reviewMentorApplication(userId, approved);
      await get().loadMentorApplications();
      await get().refreshSessions(); // Mentors list might change
  },

  openChat: (channelId: string, title: string) => {
    set({ activeModal: 'CHAT', chatChannel: { id: channelId, title } });
    get().loadChatMessages(channelId);
  },

  loadChatMessages: async (channelId: string) => {
      const msgs = await backend.getChatMessages(channelId);
      set(state => ({
          chatMessages: { ...state.chatMessages, [channelId]: msgs }
      }));
  },

  sendChatMessage: async (channelId: string, text: string) => {
      await backend.sendChatMessage(channelId, text);
      await get().loadChatMessages(channelId);
  }
});
