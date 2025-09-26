const { getSentryExpoConfig } = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

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

module.exports = config;
