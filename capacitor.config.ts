import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.cyther',
  appName: 'CytherNet',
  webDir: 'dist/www',
  android: {
    path: 'dist/android'
  }
};

export default config;
