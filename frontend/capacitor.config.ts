import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.isha1218.BookBroApp',
  appName: 'BookBro',
  webDir: 'build',
  server: {
    // url: "http://10.21.68.6:3000",
    url: "http://192.168.0.19:3000",
    cleartext: true
  }
};

export default config;
