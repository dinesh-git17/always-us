import { PASSCODE_SALT } from '../constants';

/**
 * Simple hash function for passcode storage.
 * This is NOT cryptographically secure - it serves as an emotional threshold,
 * not a security barrier. Uses a basic string-based hash for obfuscation.
 */
export function hashPasscode(passcode: string): string {
  const input = `${PASSCODE_SALT}:${passcode}`;
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Verify a passcode attempt against a stored hash.
 */
export function verifyPasscode(attempt: string, storedHash: string): boolean {
  return hashPasscode(attempt) === storedHash;
}
