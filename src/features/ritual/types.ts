/**
 * Ritual step identifiers for the entry flow state machine.
 * First-time users progress: idle → name_capture → name_recognition → passcode_create → passcode_confirm → biometric_enroll → notification_enroll → threshold → unlocked
 * Returning users progress: idle → biometric_prompt (if enabled) → passcode_entry (fallback) → threshold → unlocked
 */
export type RitualStep =
  | 'idle'
  | 'name_capture'
  | 'name_recognition'
  | 'passcode_create'
  | 'passcode_confirm'
  | 'biometric_enroll'
  | 'notification_enroll'
  | 'threshold'
  | 'passcode_entry'
  | 'biometric_prompt'
  | 'unlocked';

/**
 * Persisted ritual state - survives app restarts.
 * Contains authentication data and user preferences.
 */
export interface PersistedRitualState {
  /** Whether the user has completed the initial onboarding ritual */
  isOnboarded: boolean;
  /** User's display name (normalized) */
  userName: string;
  /** Hashed passcode for verification */
  passcodeHash: string;
  /** Whether Face ID is enabled for quick unlock */
  biometricEnabled: boolean;
  /** Timestamp of last activity (for 5-minute lock timeout) */
  lastActiveTimestamp: number;
}

/**
 * Session-only ritual state - resets on app restart.
 * Contains current flow state and UI state.
 */
export interface SessionRitualState {
  /** Current step in the ritual flow */
  currentStep: RitualStep;
  /** Whether the app is currently unlocked */
  isUnlocked: boolean;
  /** Whether content animations should start (set after threshold transition) */
  contentReady: boolean;
  /** Current passcode entry attempt (0-4 digits) */
  passcodeAttempt: string;
  /** Whether to show passcode error state */
  passcodeError: boolean;
  /** First passcode entry during setup (for confirmation matching) */
  firstPasscodeEntry: string;
}

/**
 * Complete ritual state combining persisted and session state.
 */
export interface RitualState extends PersistedRitualState, SessionRitualState {}

/**
 * Actions available for ritual state manipulation.
 */
export interface RitualActions {
  /** Initialize the ritual flow based on persisted state */
  initialize: () => void;
  /** Set the current step in the ritual flow */
  setStep: (step: RitualStep) => void;
  /** Store the user's name after normalization */
  setUserName: (name: string) => void;
  /** Append a digit to the current passcode attempt */
  appendDigit: (digit: string) => void;
  /** Remove the last digit from the passcode attempt */
  deleteDigit: () => void;
  /** Clear the current passcode attempt */
  clearPasscodeAttempt: () => void;
  /** Store the first passcode entry for confirmation */
  setFirstPasscodeEntry: (passcode: string) => void;
  /** Set the passcode error state */
  setPasscodeError: (error: boolean) => void;
  /** Hash and store the passcode, mark as onboarded */
  setPasscode: (passcode: string) => void;
  /** Enable or disable biometric authentication */
  setBiometricEnabled: (enabled: boolean) => void;
  /** Mark onboarding as complete */
  completeOnboarding: () => void;
  /** Unlock the app and transition to main content */
  unlock: () => void;
  /** Mark content as ready for animations (after threshold transition) */
  setContentReady: () => void;
  /** Lock the app (typically on background timeout) */
  lock: () => void;
  /** Update the last active timestamp */
  updateLastActive: () => void;
  /** Verify a passcode attempt against stored hash */
  verifyPasscode: (attempt: string) => boolean;
  /** Reset all state (development only) */
  reset: () => void;
}

/**
 * Complete ritual store type combining state and actions.
 */
export type RitualStore = RitualState & RitualActions;
