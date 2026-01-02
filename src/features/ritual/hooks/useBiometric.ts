import { useCallback, useState, useEffect } from 'react';
import { NativeBiometric, type BiometryType } from '@capgo/capacitor-native-biometric';

export interface BiometricState {
  /** Whether biometric auth is available on this device */
  isAvailable: boolean;
  /** The type of biometric available (Face ID, Touch ID, etc.) */
  biometryType: BiometryType | null;
  /** Whether biometric check is in progress */
  isChecking: boolean;
  /** Error message if biometric failed */
  error: string | null;
}

export interface UseBiometricResult extends BiometricState {
  /** Check if biometric is available */
  checkAvailability: () => Promise<boolean>;
  /** Perform biometric authentication */
  authenticate: () => Promise<boolean>;
  /** Clear any error state */
  clearError: () => void;
}

/**
 * Hook for managing biometric authentication.
 * Abstracts the Capacitor biometric plugin for ceremonial use.
 */
export function useBiometric(): UseBiometricResult {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    biometryType: null,
    isChecking: false,
    error: null,
  });

  // Check biometric availability on mount
  useEffect(() => {
    const checkOnMount = async (): Promise<void> => {
      try {
        const result = await NativeBiometric.isAvailable();
        setState((prev) => ({
          ...prev,
          isAvailable: result.isAvailable,
          biometryType: result.biometryType,
        }));
      } catch {
        // Biometric not available (web, simulator, etc.)
        setState((prev) => ({
          ...prev,
          isAvailable: false,
          biometryType: null,
        }));
      }
    };

    void checkOnMount();
  }, []);

  // Check availability (can be called manually)
  const checkAvailability = useCallback(async (): Promise<boolean> => {
    try {
      const result = await NativeBiometric.isAvailable();
      setState((prev) => ({
        ...prev,
        isAvailable: result.isAvailable,
        biometryType: result.biometryType,
      }));
      return result.isAvailable;
    } catch {
      setState((prev) => ({
        ...prev,
        isAvailable: false,
        biometryType: null,
      }));
      return false;
    }
  }, []);

  // Perform biometric authentication
  const authenticate = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isChecking: true, error: null }));

    try {
      await NativeBiometric.verifyIdentity({
        reason: "Verify it's you",
        title: 'Welcome Back',
        subtitle: 'Use Face ID to enter',
        description: '',
      });

      setState((prev) => ({ ...prev, isChecking: false }));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      setState((prev) => ({
        ...prev,
        isChecking: false,
        error: message,
      }));
      return false;
    }
  }, []);

  // Clear error state
  const clearError = useCallback((): void => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    checkAvailability,
    authenticate,
    clearError,
  };
}
