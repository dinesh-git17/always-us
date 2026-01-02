import { EXPECTED_NAME_PREFIX, CANONICAL_NAME } from '../constants';

/**
 * Result of name normalization attempt.
 */
export interface NormalizationResult {
  /** Whether the input matches the expected name */
  isMatch: boolean;
  /** The normalized display name */
  displayName: string;
  /** The raw normalized string (lowercase, no special chars) */
  normalized: string;
}

/**
 * Remove emojis and special characters, keeping only letters.
 */
function removeSpecialCharacters(input: string): string {
  // Remove emojis and non-letter characters
  return input.replace(/[^a-zA-Z]/g, '');
}

/**
 * Collapse repeating characters (e.g., "aaa" → "a").
 */
function collapseRepeats(input: string): string {
  return input.replace(/(.)\1+/g, '$1');
}

/**
 * Capitalize first letter, lowercase rest.
 */
function toTitleCase(input: string): string {
  if (input.length === 0) return input;
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

/**
 * Normalize a name input for validation and display.
 *
 * Examples:
 * - "carolinaaaa" → { isMatch: true, displayName: "Carolina" }
 * - "CAROLINA!!!" → { isMatch: true, displayName: "Carolina" }
 * - "carolina😊" → { isMatch: true, displayName: "Carolina" }
 * - "Sarah" → { isMatch: false, displayName: "Sarah" }
 */
export function normalizeName(input: string): NormalizationResult {
  // Step 1: Trim whitespace
  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { isMatch: false, displayName: '', normalized: '' };
  }

  // Step 2: Remove emojis and special characters (keep letters only for matching)
  const lettersOnly = removeSpecialCharacters(trimmed);

  // Step 3: Normalize repeating characters
  const collapsed = collapseRepeats(lettersOnly);

  // Step 4: Convert to lowercase for comparison
  const normalized = collapsed.toLowerCase();

  // Step 5: Check if it starts with expected prefix
  const isMatch = normalized.startsWith(EXPECTED_NAME_PREFIX);

  // Step 6: Determine display name
  const displayName = isMatch ? CANONICAL_NAME : toTitleCase(lettersOnly);

  return { isMatch, displayName, normalized };
}
