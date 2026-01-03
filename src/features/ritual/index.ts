// Components
export { RitualLayer } from './components/RitualLayer';

export { NameCapture } from './components/NameCapture';
export type { NameCaptureProps } from './components/NameCapture';

export { PasscodeSetup } from './components/PasscodeSetup';
export type { PasscodeSetupProps } from './components/PasscodeSetup';

export { PasscodeEntry } from './components/PasscodeEntry';
export type { PasscodeEntryProps } from './components/PasscodeEntry';

export { PasscodeDot } from './components/PasscodeDot';
export type { PasscodeDotProps } from './components/PasscodeDot';

export { Keypad } from './components/Keypad';
export type { KeypadProps } from './components/Keypad';

export { BiometricEnroll } from './components/BiometricEnroll';
export type { BiometricEnrollProps } from './components/BiometricEnroll';

export { BiometricPrompt } from './components/BiometricPrompt';
export type { BiometricPromptProps } from './components/BiometricPrompt';

// Store
export { useRitualStore, selectIsAuthenticated } from './store/ritualStore';

// Hooks
export { useBiometric } from './hooks/useBiometric';
export type { BiometricState, UseBiometricResult } from './hooks/useBiometric';

// Types
export type {
  RitualStep,
  RitualState,
  RitualActions,
  RitualStore,
  PersistedRitualState,
  SessionRitualState,
} from './types';

// Utils
export { normalizeName } from './utils/nameNormalizer';
export type { NormalizationResult } from './utils/nameNormalizer';
export { hashPasscode, verifyPasscode } from './utils/passcodeHash';

// Constants
export {
  RITUAL_STORAGE_KEY,
  EXPECTED_NAME_PREFIX,
  CANONICAL_NAME,
  NAME_RECOGNITION_DELAY_MS,
  PASSCODE_ERROR_DELAY_MS,
  PASSCODE_LENGTH,
  THRESHOLD_DURATION_MS,
  BACKGROUND_LOCK_TIMEOUT_MS,
} from './constants';
