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

/** Easing curve: easeInOutSine - smooth, ceremonial feeling */
const EASE_IN_OUT_SINE = [0.37, 0, 0.63, 1] as const;

/**
 * Root-level ritual layer that orchestrates the ceremonial entry experience.
 * Renders as an overlay that dissolves away when authentication completes.
 *
 * On app launch:
 * - First-time users see the name capture → passcode setup → biometric enrollment flow
 * - Returning users see Face ID prompt or passcode entry depending on settings
 * - Once authenticated, the ritual overlay dissolves and unmounts
 *
 * The main app content (AppShell) is rendered separately in App.tsx and mounts
 * when isAuthenticated becomes true, ensuring page animations start at the right moment.
 */
export function RitualLayer(): ReactNode {
  // Lock body scroll during ritual
  useBodyScrollLock();

  // Initialize splash screen lifecycle
  useSplashScreen();

  const currentStep = useRitualStore((state) => state.currentStep);
  const isUnlocked = useRitualStore((state) => state.isUnlocked);
  const initialize = useRitualStore((state) => state.initialize);

  // Initialize ritual flow on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Render the appropriate step component
  const renderStepContent = (): ReactNode => {
    switch (currentStep) {
      case 'name_capture':
        return <NameCapture key="name_capture" />;

      case 'name_recognition':
        return <NameRecognition key="name_recognition" />;

      case 'passcode_create':
      case 'passcode_confirm':
        return <PasscodeSetup key="passcode_setup" />;

      case 'biometric_enroll':
        return <BiometricEnroll key="biometric_enroll" />;

      case 'passcode_entry':
        return <PasscodeEntry key="passcode_entry" />;

      case 'biometric_prompt':
        return <BiometricPrompt key="biometric_prompt" />;

      default:
        return null;
    }
  };

  // Determine if ritual layer should be visible
  const isRitualActive = !isUnlocked && currentStep !== 'threshold' && currentStep !== 'unlocked';
  const isThresholdActive = currentStep === 'threshold';

  return (
    <AnimatePresence>
      {/* Ritual flow screens (name capture, passcode entry, etc.) */}
      {isRitualActive && (
        <motion.div
          key="ritual-layer"
          className={styles.layer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
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
        </motion.div>
      )}

      {/* Threshold dissolve overlay - sits on top while app content fades in behind */}
      {isThresholdActive && (
        <motion.div
          key="threshold-overlay"
          className={styles.thresholdOverlay}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.05 }}
          transition={{
            duration: THRESHOLD_DURATION_MS / 1000,
            ease: EASE_IN_OUT_SINE,
          }}
          onAnimationComplete={() => {
            // Unlock after threshold animation completes
            useRitualStore.getState().unlock();
            // Signal that content animations can continue
            useRitualStore.getState().setContentReady();
          }}
        />
      )}

      {/* Loading state while initializing */}
      {currentStep === 'idle' && (
        <motion.div
          key="loading"
          className={styles.layer}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={styles.loading} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
