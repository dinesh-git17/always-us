import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alwaysus.app',
  appName: 'Always-Us',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
  },
  server: {
    // Allow loading local resources
    allowNavigation: ['*'],
  },
};

export default config;
