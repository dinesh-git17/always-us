import { useEffect } from 'react';

/**
 * Locks the body scroll to prevent iOS rubber-band scrolling effect.
 * This creates a native app-like feel by disabling elastic overscroll.
 *
 * Should be called once at the app root level.
 */
export function useBodyScrollLock(): void {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;
    const originalHeight = document.body.style.height;

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    // Prevent touchmove on document to stop any remaining scroll behavior
    function preventScroll(event: TouchEvent): void {
      // Allow scroll within scrollable containers
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-scrollable]')) {
        return;
      }
      event.preventDefault();
    }

    document.addEventListener('touchmove', preventScroll, { passive: false });

    return (): void => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
      document.body.style.height = originalHeight;
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);
}
