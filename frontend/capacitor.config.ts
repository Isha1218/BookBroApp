import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.isha1218.BookBroApp',
  appName: 'BookBro',
  webDir: 'build',
  server: {
    url: "http://192.168.0.19:3000",
    cleartext: true
  },
  ios: {
    webContentsDebuggingEnabled: true,
    allowsLinkPreview: false,
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
