import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const projectId: string = '9fe3a870-cac3-4d43-a6a3-a291cd5fb90c';

  return {
    ...config,
    name: process.env.APP_NAME,
    slug: 'rnapp',
    newArchEnabled: true,
    icon: './assets/images/ic-launcher.png',
    android: {
      ...config.android,
      edgeToEdgeEnabled: true,
      googleServicesFile: process.env.GOOGLE_SERVICES_FILE_ANDROID ?? './.firebase/google-services.json',
      package: process.env.BUNDLE_IDENTIFIER,
      permissions: ['android.permission.POST_NOTIFICATIONS'],
      adaptiveIcon: {
        backgroundImage: './assets/images/ic-launcher-background.png',
        monochromeImage: './assets/images/ic-launcher-foreground.png',
        foregroundImage: './assets/images/ic-launcher-foreground.png',
      },
    },
    ios: {
      ...config.ios,
      bundleIdentifier: process.env.BUNDLE_IDENTIFIER,
      entitlements: {
        'aps-environment': process.env.NOTIFICATIONS_IOS_APS_ENVIRONMENT,
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_FILE_IOS ?? './.firebase/GoogleService-Info.plist',
    },
    extra: {
      eas: {
        projectId,
      },
    },
    updates: {
      url: `https://u.expo.dev/${projectId}`,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    orientation: 'portrait',
    plugins: [
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      [
        'expo-splash-screen',
        {
          'backgroundColor': '#fbfbfb',
          'image': './assets/images/ic-splash.png', // no-image
        },
      ],
      'expo-secure-store',
      '@react-native-firebase/app',
      '@react-native-firebase/messaging',
    ],
  };
};
