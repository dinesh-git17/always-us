import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { storage } from '@lib/storage';
import { RITUAL_STORAGE_KEY, BACKGROUND_LOCK_TIMEOUT_MS } from '../constants';
import { hashPasscode, verifyPasscode } from '../utils/passcodeHash';
import type { RitualState, RitualStore, RitualStep, PersistedRitualState } from '../types';

const initialPersistedState: PersistedRitualState = {
  isOnboarded: false,
  userName: '',
  passcodeHash: '',
  biometricEnabled: false,
  lastActiveTimestamp: 0,
};

const initialSessionState = {
  currentStep: 'idle' as RitualStep,
  isUnlocked: false,
  contentReady: false,
  passcodeAttempt: '',
  passcodeError: false,
  firstPasscodeEntry: '',
};

const initialState: RitualState = {
  ...initialPersistedState,
  ...initialSessionState,
};

/**
 * Global ritual state store with localStorage persistence.
 * Manages the ceremonial entry flow including onboarding, authentication, and app lifecycle.
 *
 * Design note: Only authentication-related data is persisted.
 * Session state (currentStep, isUnlocked, etc.) resets on each app launch.
 */
export const useRitualStore = create<RitualStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: (): void => {
        const { isOnboarded, biometricEnabled, lastActiveTimestamp } = get();
        const now = Date.now();

        if (!isOnboarded) {
          // First-time user: start onboarding flow
          set({ currentStep: 'name_capture', isUnlocked: false });
          return;
        }

        // Returning user: check if we need to re-lock based on timeout
        const timeSinceLastActive = now - lastActiveTimestamp;
        const shouldLock = timeSinceLastActive > BACKGROUND_LOCK_TIMEOUT_MS;

        if (shouldLock || lastActiveTimestamp === 0) {
          // Need to authenticate
          if (biometricEnabled) {
            set({ currentStep: 'biometric_prompt', isUnlocked: false });
          } else {
            set({ currentStep: 'passcode_entry', isUnlocked: false });
          }
        } else {
          // Still within timeout, go directly to app
          set({ currentStep: 'unlocked', isUnlocked: true });
        }
      },

      setStep: (step: RitualStep): void => {
        set({ currentStep: step });
      },

      setUserName: (name: string): void => {
        set({ userName: name });
      },

      appendDigit: (digit: string): void => {
        const { passcodeAttempt } = get();
        if (passcodeAttempt.length < 4) {
          set({ passcodeAttempt: passcodeAttempt + digit, passcodeError: false });
        }
      },

      deleteDigit: (): void => {
        const { passcodeAttempt } = get();
        if (passcodeAttempt.length > 0) {
          set({ passcodeAttempt: passcodeAttempt.slice(0, -1), passcodeError: false });
        }
      },

      clearPasscodeAttempt: (): void => {
        set({ passcodeAttempt: '', passcodeError: false });
      },

      setFirstPasscodeEntry: (passcode: string): void => {
        set({ firstPasscodeEntry: passcode });
      },

      setPasscodeError: (error: boolean): void => {
        set({ passcodeError: error });
      },

      setPasscode: (passcode: string): void => {
        const hash = hashPasscode(passcode);
        set({ passcodeHash: hash });
      },

      setBiometricEnabled: (enabled: boolean): void => {
        set({ biometricEnabled: enabled });
      },

      completeOnboarding: (): void => {
        const now = Date.now();
        set({
          isOnboarded: true,
          lastActiveTimestamp: now,
          currentStep: 'threshold',
        });
      },

      unlock: (): void => {
        const now = Date.now();
        set({
          isUnlocked: true,
          currentStep: 'unlocked',
          lastActiveTimestamp: now,
          passcodeAttempt: '',
          passcodeError: false,
        });
      },

      setContentReady: (): void => {
        set({ contentReady: true });
      },

      lock: (): void => {
        const { biometricEnabled } = get();
        set({
          isUnlocked: false,
          contentReady: false,
          currentStep: biometricEnabled ? 'biometric_prompt' : 'passcode_entry',
          passcodeAttempt: '',
          passcodeError: false,
        });
      },

      updateLastActive: (): void => {
        set({ lastActiveTimestamp: Date.now() });
      },

      verifyPasscode: (attempt: string): boolean => {
        const { passcodeHash } = get();
        return verifyPasscode(attempt, passcodeHash);
      },

      reset: (): void => {
        set(initialState);
      },
    }),
    {
      name: RITUAL_STORAGE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name: string): string | null => storage.getItem(name),
        setItem: (name: string, value: string): void => {
          storage.setItem(name, value);
        },
        removeItem: (name: string): void => {
          storage.removeItem(name);
        },
      })),
      // Only persist authentication-related data
      partialize: (state): PersistedRitualState => ({
        isOnboarded: state.isOnboarded,
        userName: state.userName,
        passcodeHash: state.passcodeHash,
        biometricEnabled: state.biometricEnabled,
        lastActiveTimestamp: state.lastActiveTimestamp,
      }),
    }
  )
);
