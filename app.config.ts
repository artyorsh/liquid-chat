import { ConfigContext, ExpoConfig } from 'expo/config';

const projectId: string = '9fe3a870-cac3-4d43-a6a3-a291cd5fb90c';

/**
 * Font families as they stored in node_modules/@expo-google-fonts dir.
 */
const fontFamilies: string[] = [
  'Inter/300Light',
  'Inter/400Regular',
  'Inter/500Medium',
  'Inter/600SemiBold',
];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME,
  slug: 'rnapp',
  newArchEnabled: true,
  icon: './assets/images/ic-launcher.png',
  android: {
    ...config.android,
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
    infoPlist: {
      'ITSAppUsesNonExemptEncryption': false,
    },
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
          buildReactNativeFromSource: true,
          useFrameworks: 'static',
        },
      },
    ],
    [
      'expo-font',
      {
        'fonts': fontFamilies.map(f => {
          const [family, weightStyle] = f.split('/');
          const dirName: string = `${family.toLowerCase()}/${weightStyle}`;
          const fileName: string = `${family}_${weightStyle}.ttf`;

          return `node_modules/@expo-google-fonts/${dirName}/${fileName}`;
        }),
      },
    ],
    [
      'expo-splash-screen',
      {
        'backgroundColor': '#F5F5F5', // uilib > colors.background
        'image': './assets/images/ic-splash.png', // no-image
        'dark': {
          'backgroundColor': '#212121',
          'image': './assets/images/ic-splash.png',
        },
      },
    ],
    'expo-secure-store',
    '@react-native-firebase/app',
    '@react-native-firebase/messaging',
    [
      '@sentry/react-native/expo',
      {
        'url': 'https://sentry.io/',
        'project': process.env.SENTRY_PROJECT,
        'organization': process.env.SENTRY_ORGANIZATION,
      },
    ],
  ],
});
