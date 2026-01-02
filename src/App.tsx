import type { ReactNode } from 'react';

import { AppShell } from '@app/AppShell';
import { ProgressIndicator, ControlLayer, EpigraphLayer } from '@components/index';
import { DeckNavigator } from '@features/navigation';
import { renderPages } from '@features/pages';

/**
 * Root application component that assembles the journey UI.
 * Renders the app shell with progress indicator, deck navigator, control layer, and epigraph layer.
 */
function App(): ReactNode {
  const pages = renderPages();

  return (
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
  );
}

export default App;
