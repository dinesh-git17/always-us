import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { logger } from '@utils/logger';
import { config } from '@config/env';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

logger.info(`${config.app.name} v${config.app.version} starting...`);

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
