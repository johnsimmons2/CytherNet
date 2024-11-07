import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.cyther',
  appName: 'CytherNet',
  webDir: 'dist/app/browser',
  android: {
    path: 'dist/app/android'
  }
};

export default config;
