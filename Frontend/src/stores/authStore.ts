import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock login - in real app, this would call your API
        if (email === 'admin@guesthouse.com' && password === 'password') {
          const mockUser = {
            id: '1',
            email: 'admin@guesthouse.com',
            name: 'Admin User',
          };
          const mockToken = 'mock-jwt-token';

          set({
            token: mockToken,
            user: mockUser,
            isAuthenticated: true,
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
