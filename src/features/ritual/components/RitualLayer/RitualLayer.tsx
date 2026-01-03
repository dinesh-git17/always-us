import { type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useBodyScrollLock } from '@hooks/useBodyScrollLock';
import { useSplashScreen } from '@hooks/useSplashScreen';
import { useRitualStore } from '../../store/ritualStore';
import { THRESHOLD_DURATION_MS } from '../../constants';
import { NameCapture } from '../NameCapture';
import { NameRecognition } from '../NameRecognition';
import { PasscodeSetup } from '../PasscodeSetup';
import { BiometricEnroll } from '../BiometricEnroll';
import { PasscodeEntry } from '../PasscodeEntry';
import { BiometricPrompt } from '../BiometricPrompt';

import styles from './RitualLayer.module.css';

export interface RitualLayerProps {
  /** Main app content to render when unlocked */
  children: ReactNode;
}

/** Easing curve: easeInOutSine - smooth, ceremonial feeling */
const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1] as const;

/** Animation variants for app content enter */
const appEnterVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.7,
      ease: EASE_IN_OUT_SINE,
    },
  },
};

/**
 * Root-level ritual layer that orchestrates the ceremonial entry experience.
 * Wraps the main app content and conditionally renders the ritual flow or app.
 *
 * On app launch:
 * - First-time users see the name capture → passcode setup → biometric enrollment flow
 * - Returning users see Face ID prompt or passcode entry depending on settings
 * - Once authenticated, the ritual dissolves and the main app fades in
 */
export function RitualLayer({ children }: RitualLayerProps): ReactNode {
  // Lock body scroll during ritual (same as AppShell)
  useBodyScrollLock();

  // Initialize splash screen lifecycle
  useSplashScreen();

  const currentStep = useRitualStore((state) => state.currentStep);
  const isUnlocked = useRitualStore((state) => state.isUnlocked);
  const contentReady = useRitualStore((state) => state.contentReady);
  const initialize = useRitualStore((state) => state.initialize);

  // Initialize ritual flow on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading state while initializing
  if (currentStep === 'idle') {
    return (
      <div className={styles.layer}>
        <div className={styles.loading} />
      </div>
    );
  }

  // Render the appropriate step component
  const renderStepContent = (): ReactNode => {
    switch (currentStep) {
      case 'name_capture':
        return <NameCapture />;

      case 'name_recognition':
        return <NameRecognition />;

      case 'passcode_create':
      case 'passcode_confirm':
        return <PasscodeSetup />;

      case 'biometric_enroll':
        return <BiometricEnroll />;

      case 'passcode_entry':
        return <PasscodeEntry />;

      case 'biometric_prompt':
        return <BiometricPrompt />;

      default:
        return null;
    }
  };

  // Show ritual flow
  if (!isUnlocked && currentStep !== 'threshold') {
    return (
      <div className={styles.layer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className={styles.ritual}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Show threshold transition
  if (currentStep === 'threshold') {
    return (
      <div className={styles.layer}>
        {/* App content fading in behind */}
        <motion.div
          className={styles.appContent}
          variants={appEnterVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => {
            // Unlock after app content is visible
            useRitualStore.getState().unlock();
            // Signal that content animations can start
            useRitualStore.getState().setContentReady();
          }}
        >
          {children}
        </motion.div>
        {/* Threshold overlay dissolving out */}
        <motion.div
          className={styles.thresholdOverlay}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{
            duration: THRESHOLD_DURATION_MS / 1000,
            ease: EASE_IN_OUT_SINE,
          }}
        />
      </div>
    );
  }

  // Unlocked: render main app content
  return (
    <motion.div
      className={styles.layer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => {
        // Ensure contentReady is set for direct-to-unlocked path (within timeout)
        if (!contentReady) {
          useRitualStore.getState().setContentReady();
        }
      }}
    >
      {children}
    </motion.div>
  );
}
