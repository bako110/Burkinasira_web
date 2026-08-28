import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'gotours:theme';

function applyThemeToDocument(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', mode);
  }
}

function getInitialMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

const initialMode = getInitialMode();
if (typeof document !== 'undefined') {
  applyThemeToDocument(initialMode);
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyThemeToDocument(mode);
    set({ mode });
  },
}));
