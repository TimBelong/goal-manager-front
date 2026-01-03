import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Theme } from '../types';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  return { theme, toggleTheme };
}

