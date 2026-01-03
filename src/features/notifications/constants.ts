/** Storage key for notification state */
export const NOTIFICATION_STORAGE_KEY = 'notification-state';

/** Morning notification hour (24h format) */
export const MORNING_NOTIFICATION_HOUR = 7;

/** Evening notification hour (24h format) */
export const EVENING_NOTIFICATION_HOUR = 21;

/** Notification channel ID for Android (required by Capacitor) */
export const NOTIFICATION_CHANNEL_ID = 'always-us-reminders';

/** Notification channel name */
export const NOTIFICATION_CHANNEL_NAME = 'Love Reminders';

/** Morning notification messages */
export const MORNING_MESSAGES = [
  'Good morning. I wake up still choosing us.',
  'First thought today: you, quietly and completely.',
  "Another morning, and you're still my favorite constant.",
  "The day feels softer knowing you're in it.",
  'I carry you with me as today begins.',
  'Morning light, steady heart, still us.',
  'Today starts gently, because you exist.',
  "I'm here, thinking of you as the day opens.",
] as const;

/** Evening notification messages */
export const EVENING_MESSAGES = [
  "However today went, I'm glad it ends with you.",
  'The world quiets down, and I still choose you.',
  "Rest easy tonight. I'm holding us steady.",
  'Another day lived, another day choosing you.',
  "I'm grateful for today because it had you in it.",
  'Night feels calmer when I think of you.',
  'I end today the same way I began it: with you.',
  'As the day closes, my heart stays open to you.',
] as const;

/** Flexible messages that can be used for either time slot */
export const FLEXIBLE_MESSAGES = [
  "I'm still here, still choosing you.",
  "You're part of how I move through every day.",
  'This is me, quietly loving you.',
  'Time passes, and my choice stays the same.',
  'I carry us with care.',
  "No matter the hour, it's still you.",
] as const;

/** Number of days to schedule notifications in advance */
export const NOTIFICATION_SCHEDULE_DAYS = 7;
