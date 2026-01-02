import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alwaysus.app',
  appName: 'Always-Us',
  webDir: 'dist',
  backgroundColor: '#FAF7F2',
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    backgroundColor: '#FAF7F2',
  },
  server: {
    // Allow loading local resources
    allowNavigation: ['*'],
  },
};

export default config;
