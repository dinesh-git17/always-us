/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;

  // API Configuration
  readonly VITE_API_URL?: string;
  readonly VITE_API_TIMEOUT?: string;

  // Feature Flags
  readonly VITE_FEATURE_ANALYTICS?: string;
  readonly VITE_FEATURE_DEBUG_MODE?: string;

  // Third-party Services
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
