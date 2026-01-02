import type { ReactNode } from 'react';

import { AppShell } from '@app/AppShell';
import { ProgressIndicator, ActionBar } from '@components/index';
import { DeckNavigator } from '@features/navigation';
import { renderPages } from '@features/pages';

/**
 * Root application component that assembles the journey UI.
 * Renders the app shell with progress indicator, deck navigator, and action bar.
 */
function App(): ReactNode {
  const pages = renderPages();

  return (
    <AppShell header={<ProgressIndicator />} footer={<ActionBar />}>
      <DeckNavigator>{pages}</DeckNavigator>
    </AppShell>
  );
}

export default App;
