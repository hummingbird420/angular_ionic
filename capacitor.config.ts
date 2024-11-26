import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'RENESSA HR',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    //icon: 'assets/icon/splash_icon.png',
    //splash: 'assets/icon/splash_icon.png'
  },
  ios: {
    // allowMixedContent:true
    // icon: 'assets/icon/splash_icon.png',
    // splash: 'assets/icon/splash_icon.png'
  }
};

export default config;
//'assets/icon/splash_icon.png'
