import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  ceremonialTextVariants,
  calculateCeremonialDelay,
  ritualExitVariants,
  EASE_IN_OUT_SINE,
} from '@lib/motion';
import { useLocalNotifications } from '@features/notifications';
import { useRitualStore } from '../../store/ritualStore';

import styles from './NotificationEnroll.module.css';

const PROMPT = 'Can I send you small reminders?';
const SUBTITLE = 'Gentle words, twice a day.';

export interface NotificationEnrollProps {
  testId?: string;
}

/**
 * Notification enrollment step.
 * Offers to enable local notifications for daily love reminders.
 * Skippable - user can decline and still use the app.
 */
export function NotificationEnroll({
  testId = 'notification-enroll',
}: NotificationEnrollProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  const completeOnboarding = useRitualStore((state) => state.completeOnboarding);
  const { requestPermission, skip, isRequesting } = useLocalNotifications();

  // Handle "Yes, remind me" - enable notifications
  const handleEnableNotifications = async (): Promise<void> => {
    await requestPermission();
    completeOnboarding();
  };

  // Handle "No, thanks" - skip notifications
  const handleSkipNotifications = (): void => {
    skip();
    completeOnboarding();
  };

  return (
    <motion.article
      className={styles.container}
      data-testid={testId}
      aria-label="Notification enrollment"
      variants={ritualExitVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.content}>
        {/* Icon - Bell */}
        <motion.div
          className={styles.iconContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE_IN_OUT_SINE }}
          aria-hidden="true"
        >
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Bell body */}
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            {/* Bell clapper */}
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            {/* Small heart inside bell */}
            <path
              d="M12 12.5c-.5-.7-1.5-.9-2.2-.4-.6.4-.8 1.2-.5 1.9.2.4.5.7.9 1l1.8 1.4 1.8-1.4c.4-.3.7-.6.9-1 .3-.7.1-1.5-.5-1.9-.7-.5-1.7-.3-2.2.4z"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </motion.div>

        {/* Prompt */}
        <motion.h1
          className={styles.prompt}
          variants={ceremonialTextVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
          custom={calculateCeremonialDelay(0)}
        >
          {PROMPT}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className={styles.subtitle}
          variants={ceremonialTextVariants}
          initial={shouldAnimate ? 'hidden' : 'visible'}
          animate="visible"
          custom={calculateCeremonialDelay(1)}
        >
          {SUBTITLE}
        </motion.p>

        {/* Buttons */}
        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: EASE_IN_OUT_SINE }}
        >
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              void handleEnableNotifications();
            }}
            disabled={isRequesting}
          >
            {isRequesting ? 'Setting up…' : 'Yes, remind me'}
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleSkipNotifications}
            disabled={isRequesting}
          >
            No, thanks
          </button>
        </motion.div>
      </div>
    </motion.article>
  );
}
