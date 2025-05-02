
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ke.co.tenderzvilleportal.supplychain_ke',
  appName: 'SupplyChain_Ke',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    // Add URL for live preview
    url: 'https://58a11674-f67e-4727-b58a-1c6e2834f792.lovableproject.com?forceHideBadge=true'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#999999",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFFFFF'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    backgroundColor: "#FFFFFF",
    iconBackgroundColor: "#FFFFFF",
    buildOptions: {
      keystorePath: "android.keystore",
      keystoreAlias: "key0",
    }
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: true,
    scrollEnabled: true,
    backgroundColor: "#FFFFFF",
    preferredContentMode: "mobile"
  }
};

export default config;
