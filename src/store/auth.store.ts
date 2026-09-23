import { create } from 'zustand';

import type { UserPublic } from '../shared/api/types';
import { queryClient } from '../shared/queryClient';

interface AuthState {
  accessToken: string | null;
  user: UserPublic | null;
  isAuthenticated: boolean;
  setSession: (accessToken: string, user: UserPublic) => void;
  updateUser: (user: UserPublic) => void;
  clearSession: () => void;
}

const TOKEN_KEY = 'burkinasira:token';
const USER_KEY = 'burkinasira:user';

function readStoredUser(): UserPublic | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserPublic;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem(TOKEN_KEY),
  user: readStoredUser(),
  isAuthenticated: Boolean(localStorage.getItem(TOKEN_KEY)),
  setSession: (accessToken, user) => {
    // Un nouveau compte peut se connecter juste après un autre (tests, poste
    // partagé) : on vide le cache pour ne jamais montrer les établissements/
    // réservations du compte précédent le temps que les requêtes se rechargent.
    queryClient.clear();
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ accessToken, user, isAuthenticated: true });
  },
  updateUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },
  clearSession: () => {
    queryClient.clear();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
}));
