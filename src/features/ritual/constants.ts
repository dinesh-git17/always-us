/** Storage key for persisting ritual state */
export const RITUAL_STORAGE_KEY = 'ritual-state';

/**
 * Expected name prefix for soft validation.
 * Input is normalized and checked if it starts with this prefix.
 * Handles variations like "carolinaaaa", "CAROLINA", "carolina😊"
 */
export const EXPECTED_NAME_PREFIX = 'carolin';

/** Canonical display name when input matches expected prefix */
export const CANONICAL_NAME = 'Carolina';

/** Delay in milliseconds before transitioning after name recognition */
export const NAME_RECOGNITION_DELAY_MS = 3000;

/** Delay in milliseconds before clearing dots after wrong passcode */
export const PASSCODE_ERROR_DELAY_MS = 500;

/** Required length for passcode */
export const PASSCODE_LENGTH = 4;

/** Salt for passcode hashing (not cryptographically secure, emotional threshold only) */
export const PASSCODE_SALT = 'always-us-ritual-2025';

/** Threshold transition duration in milliseconds */
export const THRESHOLD_DURATION_MS = 1500;

/** Background duration before re-lock in milliseconds (5 minutes) */
export const BACKGROUND_LOCK_TIMEOUT_MS = 5 * 60 * 1000;
