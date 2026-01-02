import type { ReactNode } from 'react';

import { AppShell } from '@app/AppShell';
import { ProgressIndicator, ControlLayer, EpigraphLayer } from '@components/index';
import { DeckNavigator } from '@features/navigation';
import { renderPages } from '@features/pages';
import { RitualLayer } from '@features/ritual';

/**
 * Root application component that assembles the journey UI.
 * Wrapped in RitualLayer for ceremonial entry experience.
 * Renders the app shell with progress indicator, deck navigator, control layer, and epigraph layer.
 */
function App(): ReactNode {
  const pages = renderPages();

  return (
    <RitualLayer>
      <AppShell
        header={<ProgressIndicator />}
        overlay={
          <>
            <EpigraphLayer />
            <ControlLayer />
          </>
        }
      >
        <DeckNavigator>{pages}</DeckNavigator>
      </AppShell>
    </RitualLayer>
  );
}

export default App;
