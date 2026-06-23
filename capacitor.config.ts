import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.haven.app',
  appName: 'HAVEN',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  server: {
    androidScheme: 'https',
    allowNavigation: [
      "*.supabase.co",
      "*.turso.tech",
      "your-coolify-domain.com"
    ]
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
