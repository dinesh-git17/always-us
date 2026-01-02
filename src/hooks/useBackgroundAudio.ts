import { useEffect, useRef, useCallback } from 'react';
import { App, type AppState } from '@capacitor/app';

import { useJourneyStore } from '@features/navigation';

/** Path to the ambient background audio file */
const AUDIO_SOURCE = '/background-music.mp3';

/** Target volume (15-20% range) - sits behind user's internal monologue */
const TARGET_VOLUME = 0.18;

/** Duration of fade-in effect in milliseconds (3-5 second range) */
const FADE_IN_DURATION_MS = 4000;

/** Duration of fade-in when resuming from background */
const RESUME_FADE_DURATION_MS = 500;

/** Interval for volume fade steps in milliseconds */
const FADE_INTERVAL_MS = 50;

/**
 * Manages ambient background audio playback tied to navigation state.
 *
 * Audio behavior:
 * - Initialized paused on app load
 * - Begins playing when user navigates from page 0 to page 1
 * - Slow fade-in over ~4 seconds to prevent startling onset
 * - Loops seamlessly without gaps
 * - Pauses on app background, resumes with quick fade on foreground
 * - Continues playing if user navigates back to page 0
 *
 * Should be called once at app root level (AppShell).
 */
export function useBackgroundAudio(): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  const wasPlayingRef = useRef<boolean>(false);

  const currentStepIndex = useJourneyStore((state) => state.currentStepIndex);

  /**
   * Fades audio volume from current level to target over specified duration.
   */
  const fadeVolumeTo = useCallback((target: number, durationMs: number): void => {
    const audio = audioRef.current;
    if (!audio) return;

    // Clear any existing fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const startVolume = audio.volume;
    const volumeDelta = target - startVolume;
    const steps = Math.ceil(durationMs / FADE_INTERVAL_MS);
    const volumeStep = volumeDelta / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = Math.min(Math.max(startVolume + volumeStep * currentStep, 0), 1);

      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }

      if (currentStep >= steps) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        if (audioRef.current) {
          audioRef.current.volume = target;
        }
      }
    }, FADE_INTERVAL_MS);
  }, []);

  /**
   * Starts audio playback with fade-in effect.
   */
  const startPlayback = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio || hasStartedRef.current) return;

    hasStartedRef.current = true;
    audio.volume = 0;

    void audio.play().then(() => {
      fadeVolumeTo(TARGET_VOLUME, FADE_IN_DURATION_MS);
    });
  }, [fadeVolumeTo]);

  /**
   * Pauses audio immediately (for background transition).
   */
  const pausePlayback = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio) return;

    // Clear any active fade
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    wasPlayingRef.current = !audio.paused;
    audio.pause();
  }, []);

  /**
   * Resumes audio with quick fade-in (for foreground transition).
   */
  const resumePlayback = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio || !wasPlayingRef.current) return;

    audio.volume = 0;
    void audio.play().then(() => {
      fadeVolumeTo(TARGET_VOLUME, RESUME_FADE_DURATION_MS);
    });
  }, [fadeVolumeTo]);

  // Initialize audio element and preload metadata
  useEffect(() => {
    const audio = new Audio();
    audio.src = AUDIO_SOURCE;
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0;

    audioRef.current = audio;

    return (): void => {
      // Cleanup on unmount
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Handle app lifecycle events (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (state: AppState): void => {
      if (!state.isActive) {
        pausePlayback();
      } else {
        resumePlayback();
      }
    };

    const listenerHandle = App.addListener('appStateChange', handleAppStateChange);

    return (): void => {
      void listenerHandle.then((handle) => handle.remove());
    };
  }, [pausePlayback, resumePlayback]);

  // Trigger playback when navigating from page 0 to page 1
  useEffect(() => {
    if (currentStepIndex >= 1 && !hasStartedRef.current) {
      startPlayback();
    }
  }, [currentStepIndex, startPlayback]);
}
