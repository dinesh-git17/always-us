// Hooks
export { useLocalNotifications } from './hooks/useLocalNotifications';
export type { UseLocalNotificationsResult } from './hooks/useLocalNotifications';

// Types
export type { NotificationState, NotificationSlot, ScheduledNotification } from './types';

// Constants
export {
  NOTIFICATION_STORAGE_KEY,
  MORNING_NOTIFICATION_HOUR,
  EVENING_NOTIFICATION_HOUR,
  MORNING_MESSAGES,
  EVENING_MESSAGES,
  FLEXIBLE_MESSAGES,
  NOTIFICATION_SCHEDULE_DAYS,
} from './constants';
