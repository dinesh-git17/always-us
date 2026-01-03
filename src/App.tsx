import { type ReactNode, useEffect } from 'react';

import { AppShell } from '@app/AppShell';
import { ProgressIndicator, ControlLayer, EpigraphLayer, SwipeHint } from '@components/index';
import { DeckNavigator } from '@features/navigation';
import { renderPages } from '@features/pages';
import { RitualLayer, useRitualStore, selectIsAuthenticated } from '@features/ritual';

/** Delay before triggering animations for direct unlock path (ms) */
const DIRECT_UNLOCK_ANIMATION_DELAY = 100;

/**
 * Root application component that assembles the journey UI.
 *
 * Architecture:
 * - RitualLayer renders as an overlay for authentication (dissolves when done)
 * - AppShell only mounts after authentication, ensuring page animations start fresh
 *
 * This deferred mounting solves the animation timing issue where page content
 * would animate behind the lock screen and finish before the user could see it.
 */
function App(): ReactNode {
  const pages = renderPages();
  const isAuthenticated = useRitualStore(selectIsAuthenticated);
  const isUnlocked = useRitualStore((state) => state.isUnlocked);
  const currentStep = useRitualStore((state) => state.currentStep);
  const contentReady = useRitualStore((state) => state.contentReady);

  // For direct unlock path (returning users within timeout):
  // Set contentReady after a brief delay to allow page components to mount
  // with animate="hidden" first, then transition to animate="visible".
  // This gives Framer Motion the state change it needs to animate.
  useEffect(() => {
    if (isUnlocked && currentStep === 'unlocked' && !contentReady) {
      const timer = setTimeout(() => {
        useRitualStore.getState().setContentReady();
      }, DIRECT_UNLOCK_ANIMATION_DELAY);
      return (): void => {
        clearTimeout(timer);
      };
    }
  }, [isUnlocked, currentStep, contentReady]);

  return (
    <>
      {/* RitualLayer handles authentication and dissolves via AnimatePresence */}
      <RitualLayer />

      {/* Only mount AppShell after authentication - this ensures animations start fresh */}
      {isAuthenticated && (
        <AppShell
          header={<ProgressIndicator />}
          overlay={
            <>
              <EpigraphLayer />
              <SwipeHint />
              <ControlLayer />
            </>
          }
        >
          <DeckNavigator>{pages}</DeckNavigator>
        </AppShell>
      )}
    </>
  );
}

export default App;
