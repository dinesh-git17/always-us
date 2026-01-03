import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { useRitualStore } from '@features/ritual/store/ritualStore';

import styles from './WelcomePage.module.css';

/**
 * Content blocks for the welcome page.
 * Each block animates in sequence with staggered timing.
 */
const WELCOME_CONTENT = [
  { text: 'Hi my love,', isGreeting: true },
  { text: 'I made this space for us.', isGreeting: false },
  { text: 'Slowly. Gently. With care.', isGreeting: false },
  { text: "There's no rush here, and nothing you need to do.", isGreeting: false },
  { text: 'Just words meant to be felt, not hurried.', isGreeting: false },
  { text: 'This is simply a moment we get to share.', isGreeting: false },
  { text: 'Just you and me.', isGreeting: false },
  { text: 'Just us.', isGreeting: false },
] as const;

const CLOSING_TEXT = 'Take your time.';

/** Animation timing constants */
const ANIMATION_DURATION = 0.8;
const STAGGER_DELAY = 0.8;
const INITIAL_DELAY = 0.4;

/**
 * Motion variants for the "Exhale" entrance animation.
 * Text blocks fade in and drift up from a subtle offset.
 */
const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION,
      ease: 'easeOut',
      delay: INITIAL_DELAY + index * STAGGER_DELAY,
    },
  }),
};

/**
 * Closing text appears last, after all main content blocks.
 */
const closingVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION,
      ease: 'easeOut',
      delay: INITIAL_DELAY + WELCOME_CONTENT.length * STAGGER_DELAY,
    },
  },
};

export interface WelcomePageProps {
  /** Test ID for automated testing */
  testId?: string;
}

/**
 * Welcome page - the entry point of the Always Us journey.
 *
 * This is a "Special Content Page" that deviates from the standard Page layout.
 * The text reveals itself slowly to create an unhurried, contemplative experience.
 * Respects prefers-reduced-motion for accessibility.
 */
export function WelcomePage({ testId = 'page-0' }: WelcomePageProps): ReactNode {
  // Use Framer Motion's built-in hook for reduced motion detection
  const prefersReducedMotion = useReducedMotion();

  // Wait for ritual transition to complete before starting animations
  const contentReady = useRitualStore((state) => state.contentReady);

  // Determine animation state: start only when content is ready (after threshold transition)
  const animationState = prefersReducedMotion || contentReady ? 'visible' : 'hidden';

  return (
    <article
      className={styles.page}
      data-testid={testId}
      data-scrollable
      aria-label="Welcome to Always Us"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {WELCOME_CONTENT.map((block, index) => (
            <motion.p
              key={block.text}
              className={block.isGreeting ? styles.greeting : styles.body}
              variants={textVariants}
              initial="hidden"
              animate={animationState}
              custom={index}
            >
              {block.text}
            </motion.p>
          ))}
        </div>

        <motion.p
          className={styles.closing}
          variants={closingVariants}
          initial="hidden"
          animate={animationState}
        >
          {CLOSING_TEXT}
        </motion.p>
      </div>
    </article>
  );
}
