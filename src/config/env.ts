/**
 * Environment configuration with type safety and defaults.
 * All environment variables should be accessed through this module.
 */

export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME ?? 'Always-Us',
    version: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },

  api: {
    url: import.meta.env.VITE_API_URL,
    timeout: import.meta.env.VITE_API_TIMEOUT
      ? parseInt(import.meta.env.VITE_API_TIMEOUT, 10)
      : 30000,
  },

  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS === 'true',
    debugMode: import.meta.env.VITE_FEATURE_DEBUG_MODE === 'true',
  },

  services: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  },
} as const;

export type Config = typeof config;
