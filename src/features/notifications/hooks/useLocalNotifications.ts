import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalNotifications, type PermissionStatus } from '@capacitor/local-notifications';

import { storage } from '@lib/storage';
import {
  NOTIFICATION_STORAGE_KEY,
  MORNING_NOTIFICATION_HOUR,
  EVENING_NOTIFICATION_HOUR,
  MORNING_MESSAGES,
  EVENING_MESSAGES,
  FLEXIBLE_MESSAGES,
  NOTIFICATION_SCHEDULE_DAYS,
} from '../constants';
import type { NotificationState, NotificationSlot } from '../types';

const DEFAULT_STATE: NotificationState = {
  isEnabled: false,
  hasBeenAsked: false,
  lastScheduledAt: 0,
};

/**
 * Get a random message for the given time slot.
 * Combines slot-specific messages with flexible messages for variety.
 */
function getRandomMessage(slot: NotificationSlot): string {
  const slotMessages = slot === 'morning' ? MORNING_MESSAGES : EVENING_MESSAGES;

  // Combine slot-specific messages with flexible messages (weighted toward slot-specific)
  const allMessages: readonly string[] = [...slotMessages, ...slotMessages, ...FLEXIBLE_MESSAGES];
  const randomIndex = Math.floor(Math.random() * allMessages.length);

  return allMessages[randomIndex] ?? slotMessages[0];
}

/**
 * Generate unique notification ID from date and slot.
 * Format: YYYYMMDDS where S is 0 for morning, 1 for evening.
 */
function generateNotificationId(date: Date, slot: NotificationSlot): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const slotSuffix = slot === 'morning' ? 0 : 1;

  return year * 100000 + month * 1000 + day * 10 + slotSuffix;
}

/**
 * Load notification state from storage.
 */
function loadState(): NotificationState {
  const stored = storage.getItem(NOTIFICATION_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as NotificationState;
    } catch {
      return DEFAULT_STATE;
    }
  }
  return DEFAULT_STATE;
}

/**
 * Save notification state to storage.
 */
function saveState(state: NotificationState): void {
  storage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(state));
}

export interface UseLocalNotificationsResult {
  /** Whether notifications are enabled */
  isEnabled: boolean;
  /** Whether the user has been asked about notifications */
  hasBeenAsked: boolean;
  /** Whether we're currently requesting permission */
  isRequesting: boolean;
  /** Request notification permission and schedule if granted */
  requestPermission: () => Promise<boolean>;
  /** Skip notifications without requesting permission */
  skip: () => void;
  /** Reschedule notifications (call on app foreground) */
  reschedule: () => Promise<void>;
}

/**
 * Hook for managing local notifications.
 * Handles permission requests, scheduling, and state persistence.
 */
export function useLocalNotifications(): UseLocalNotificationsResult {
  const [state, setState] = useState<NotificationState>(loadState);
  const [isRequesting, setIsRequesting] = useState(false);

  // Schedule notifications for the next N days
  const scheduleNotifications = useCallback(async (): Promise<void> => {
    try {
      // Cancel any existing notifications first
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({ notifications: pending.notifications });
      }

      const now = new Date();
      const notifications: {
        id: number;
        title: string;
        body: string;
        schedule: { at: Date; allowWhileIdle: boolean };
      }[] = [];

      // Schedule for the next NOTIFICATION_SCHEDULE_DAYS days
      for (let dayOffset = 0; dayOffset < NOTIFICATION_SCHEDULE_DAYS; dayOffset++) {
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + dayOffset);

        // Morning notification
        const morningTime = new Date(targetDate);
        morningTime.setHours(MORNING_NOTIFICATION_HOUR, 0, 0, 0);

        // Only schedule if in the future
        if (morningTime > now) {
          notifications.push({
            id: generateNotificationId(targetDate, 'morning'),
            title: 'Always Us',
            body: getRandomMessage('morning'),
            schedule: {
              at: morningTime,
              allowWhileIdle: true,
            },
          });
        }

        // Evening notification
        const eveningTime = new Date(targetDate);
        eveningTime.setHours(EVENING_NOTIFICATION_HOUR, 0, 0, 0);

        // Only schedule if in the future
        if (eveningTime > now) {
          notifications.push({
            id: generateNotificationId(targetDate, 'evening'),
            title: 'Always Us',
            body: getRandomMessage('evening'),
            schedule: {
              at: eveningTime,
              allowWhileIdle: true,
            },
          });
        }
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
      }

      // Update last scheduled timestamp
      const newState = { ...state, lastScheduledAt: Date.now() };
      setState(newState);
      saveState(newState);
    } catch {
      // Silently fail - notifications are nice-to-have, not critical
    }
  }, [state]);

  // Request permission and schedule if granted
  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsRequesting(true);

    try {
      // Check current permission status
      let permissionStatus: PermissionStatus = await LocalNotifications.checkPermissions();

      // Request if not granted
      if (permissionStatus.display !== 'granted') {
        permissionStatus = await LocalNotifications.requestPermissions();
      }

      const granted = permissionStatus.display === 'granted';

      // Update state
      const newState: NotificationState = {
        isEnabled: granted,
        hasBeenAsked: true,
        lastScheduledAt: 0,
      };
      setState(newState);
      saveState(newState);

      // Schedule notifications if granted
      if (granted) {
        await scheduleNotifications();
      }

      return granted;
    } catch {
      // Failed to request permission - mark as asked but not enabled
      const newState: NotificationState = {
        isEnabled: false,
        hasBeenAsked: true,
        lastScheduledAt: 0,
      };
      setState(newState);
      saveState(newState);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [scheduleNotifications]);

  // Skip notifications
  const skip = useCallback((): void => {
    const newState: NotificationState = {
      isEnabled: false,
      hasBeenAsked: true,
      lastScheduledAt: 0,
    };
    setState(newState);
    saveState(newState);
  }, []);

  // Reschedule notifications (call when app comes to foreground)
  const reschedule = useCallback(async (): Promise<void> => {
    if (!state.isEnabled) return;

    // Only reschedule if it's been more than 12 hours since last schedule
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const timeSinceLastSchedule = Date.now() - state.lastScheduledAt;

    if (timeSinceLastSchedule > TWELVE_HOURS_MS) {
      await scheduleNotifications();
    }
  }, [state.isEnabled, state.lastScheduledAt, scheduleNotifications]);

  // Track if we've already scheduled on mount
  const hasScheduledOnMount = useRef(false);

  // Reschedule on mount if enabled (run once)
  useEffect(() => {
    if (state.isEnabled && !hasScheduledOnMount.current) {
      hasScheduledOnMount.current = true;
      void reschedule();
    }
  }, [state.isEnabled, reschedule]);

  return {
    isEnabled: state.isEnabled,
    hasBeenAsked: state.hasBeenAsked,
    isRequesting,
    requestPermission,
    skip,
    reschedule,
  };
}
