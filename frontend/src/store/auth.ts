import { create } from 'zustand';

interface Address {
  street: string;
  city: string;
  postalCode: string;
}

interface User {
  _id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  wishlist?: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  loadUserFromStorage: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

export const useAuth = create<AuthStore>((set) => {
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken,

    login: (user, token) => {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      set({ user, token });
    },

    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
    },

    loadUserFromStorage: () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        set({
          user: JSON.parse(storedUser),
          token: storedToken,
        });
      }
    },

    updateUser: (updatedUser) => {
      set((state) => {
        if (!state.user) return state;
        const newUser = { ...state.user, ...updatedUser };
        localStorage.setItem('user', JSON.stringify(newUser));
        return { user: newUser };
      });
    },
  };
});
