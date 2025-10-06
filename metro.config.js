const { withRozenite } = require("@rozenite/metro");
const { withRozeniteExpoAtlasPlugin } = require('@rozenite/expo-atlas-plugin');
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname, {
  includeWebReplay: false,
});

/**
 * @see https://lingui.dev/ref/metro-transformer#installation
 */
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("@lingui/metro-transformer/expo"),
};

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, "po", "pot"],
};

module.exports = withRozenite(config, {
  enabled: true,
  enhanceMetroConfig: (config) => withRozeniteExpoAtlasPlugin(config),
});
