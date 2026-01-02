import type { ReactNode } from 'react';

import { AppShell } from '@app/AppShell';
import { ProgressIndicator, ControlLayer } from '@components/index';
import { DeckNavigator } from '@features/navigation';
import { renderPages } from '@features/pages';

/**
 * Root application component that assembles the journey UI.
 * Renders the app shell with progress indicator, deck navigator, and control layer.
 */
function App(): ReactNode {
  const pages = renderPages();

  return (
    <AppShell header={<ProgressIndicator />} overlay={<ControlLayer />}>
      <DeckNavigator>{pages}</DeckNavigator>
    </AppShell>
  );
}

export default App;
