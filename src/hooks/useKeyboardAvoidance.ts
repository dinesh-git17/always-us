import { useState, useEffect } from 'react';
import { Keyboard, type KeyboardInfo } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

/** Keyboard avoidance offset above keyboard in pixels */
const KEYBOARD_AVOIDANCE_OFFSET = 30;

export interface KeyboardAvoidanceState {
  /** Y-axis transform value in pixels (negative when keyboard is open) */
  translateY: number;
  /** Whether the keyboard is currently visible */
  isKeyboardVisible: boolean;
  /** Keyboard height in pixels */
  keyboardHeight: number;
}

interface KeyboardAvoidanceOptions {
  /** Additional offset to apply above keyboard (default: 30) */
  offset?: number;
}

/**
 * Hook that provides keyboard avoidance animation values for iOS.
 * Returns a translateY value that can be applied to containers to
 * smoothly animate content up when the keyboard opens.
 *
 * Only active on native iOS platform. Returns zero values on web/Android.
 */
export function useKeyboardAvoidance(options?: KeyboardAvoidanceOptions): KeyboardAvoidanceState {
  const offset = options?.offset ?? KEYBOARD_AVOIDANCE_OFFSET;

  const [state, setState] = useState<KeyboardAvoidanceState>({
    translateY: 0,
    isKeyboardVisible: false,
    keyboardHeight: 0,
  });

  useEffect(() => {
    // Only active on native iOS
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'ios') {
      return;
    }

    let showHandle: PluginListenerHandle | null = null;
    let hideHandle: PluginListenerHandle | null = null;
    let isSubscribed = true;

    const handleKeyboardWillShow = (info: KeyboardInfo): void => {
      if (!isSubscribed) return;
      // Move content up by half the keyboard height plus offset
      const targetY = -(info.keyboardHeight / 2) - offset;
      setState({
        translateY: targetY,
        isKeyboardVisible: true,
        keyboardHeight: info.keyboardHeight,
      });
    };

    const handleKeyboardWillHide = (): void => {
      if (!isSubscribed) return;
      setState({
        translateY: 0,
        isKeyboardVisible: false,
        keyboardHeight: 0,
      });
    };

    const setupListeners = async (): Promise<void> => {
      try {
        if (!isSubscribed) return;

        showHandle = await Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow);
        hideHandle = await Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide);
      } catch {
        // Keyboard plugin not available - fail silently
      }
    };

    void setupListeners();

    return (): void => {
      isSubscribed = false;
      if (showHandle) {
        void showHandle.remove();
      }
      if (hideHandle) {
        void hideHandle.remove();
      }
    };
  }, [offset]);

  return state;
}
