/**
 * Storage abstraction layer for cross-platform persistence.
 * Uses localStorage for web/development and can be extended
 * to use Capacitor Preferences for native iOS.
 */

const STORAGE_PREFIX = 'always-us:';

export interface StorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

function createStorageKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Synchronous storage adapter using localStorage.
 * Suitable for Zustand's persist middleware which expects sync operations.
 */
export const storage: StorageAdapter = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(createStorageKey(key));
    } catch {
      // localStorage may be unavailable in some contexts
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(createStorageKey(key), value);
    } catch {
      // Silently fail if storage is unavailable or quota exceeded
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(createStorageKey(key));
    } catch {
      // Silently fail if storage is unavailable
    }
  },
};
