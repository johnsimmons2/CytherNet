import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.cyther',
  appName: 'CytherNet',
  webDir: 'dist/app',
  android: {
    path: 'dist/android'
  }
};

export default config;
