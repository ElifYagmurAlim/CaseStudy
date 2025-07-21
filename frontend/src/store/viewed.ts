// src/store/viewed.ts (zustand örneği)
import { create } from 'zustand';

interface ViewedState {
  recent: string[];
  addViewed: (id: string) => void;
}

export const useViewedStore = create<ViewedState>((set) => ({
  recent: [],
  addViewed: (id) =>
    set((state) => {
      const newList = [...new Set([id, ...state.recent])].slice(0, 3);
      return { recent: newList };
    }),
}));
