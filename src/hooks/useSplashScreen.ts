import { useEffect } from 'react';
import { create } from 'zustand';
import { SplashScreen } from '@capacitor/splash-screen';

/** Duration to show splash screen in milliseconds */
const SPLASH_DURATION_MS = 2000;

interface SplashState {
  /** Whether the splash screen has been hidden and app is ready */
  isReady: boolean;
  /** Mark the app as ready (splash hidden) */
  setReady: () => void;
}

/**
 * Global splash screen state store.
 * Tracks whether the splash screen has been dismissed.
 */
export const useSplashStore = create<SplashState>((set) => ({
  isReady: false,
  setReady: (): void => {
    set({ isReady: true });
  },
}));

/**
 * Hook to initialize and manage the splash screen lifecycle.
 * Should be called once at app root level (e.g., AppShell).
 *
 * Shows splash for SPLASH_DURATION_MS, then hides it and sets isReady state.
 */
export function useSplashScreen(): void {
  const setReady = useSplashStore((state) => state.setReady);

  useEffect(() => {
    const timer = setTimeout(() => {
      void SplashScreen.hide({ fadeOutDuration: 300 }).then(() => {
        setReady();
      });
    }, SPLASH_DURATION_MS);

    return (): void => {
      clearTimeout(timer);
    };
  }, [setReady]);
}

/**
 * Hook to check if the app is ready (splash screen hidden).
 * Use this in components that need to wait for splash to complete.
 */
export function useAppReady(): boolean {
  return useSplashStore((state) => state.isReady);
}
