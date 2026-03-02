import { create } from 'zustand';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatStore {
  zustandMessage: Message[];
  setZustandMessage: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  zustandMessage: [],
  setZustandMessage: (messages) => set({ zustandMessage: messages }),
  addMessage: (message) =>
    set((state) => ({
      zustandMessage: [...state.zustandMessage, message],
    })),
  clearMessages: () => set({ zustandMessage: [] }),
}));
