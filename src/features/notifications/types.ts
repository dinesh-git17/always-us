/**
 * Notification time slot identifiers.
 */
export type NotificationSlot = 'morning' | 'evening';

/**
 * Persisted notification state - survives app restarts.
 */
export interface NotificationState {
  /** Whether notification permission has been granted */
  isEnabled: boolean;
  /** Whether the user has been asked about notifications (even if declined) */
  hasBeenAsked: boolean;
  /** Timestamp of last notification scheduling */
  lastScheduledAt: number;
}

/**
 * Scheduled notification data for persistence.
 */
export interface ScheduledNotification {
  id: number;
  slot: NotificationSlot;
  message: string;
  scheduledAt: Date;
}
