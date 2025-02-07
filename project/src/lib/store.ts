import { create } from 'zustand';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AppState {
  sidebarExpanded: boolean;
  chatExpanded: boolean;
  darkMode: boolean;
  currentConversationId: string | null;
  conversations: Conversation[];
  messages: Message[];
  toggleSidebar: () => void;
  toggleChat: () => void;
  toggleDarkMode: () => void;
  setCurrentConversation: (id: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
}

export const useStore = create<AppState>((set) => ({
  sidebarExpanded: true,
  chatExpanded: true,
  darkMode: false,
  currentConversationId: null,
  conversations: [],
  messages: [],
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  toggleChat: () => set((state) => ({ chatExpanded: !state.chatExpanded })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  setConversations: (conversations) => set({ conversations }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));