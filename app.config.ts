import { ConfigContext, ExpoConfig } from 'expo/config';

const projectId: string = 'ce29bb1e-6085-47cc-a5a2-061d66dbcdf3';

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
  slug: 'liquid-chat',
  newArchEnabled: true,
  icon: './assets/images/ic-launcher.png',
  android: {
    ...config.android,
    package: process.env.BUNDLE_IDENTIFIER,
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
      'com.apple.developer.kernel.increased-memory-limit': true,
    },
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
        'backgroundColor': '#212121', // uilib > colors.background
        'image': './assets/images/ic-splash.png', // no-image
        'dark': {
          'backgroundColor': '#212121',
          'image': './assets/images/ic-splash.png',
        },
      },
    ],
    'expo-secure-store',
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
