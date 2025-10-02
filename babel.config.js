module.exports = (api) => {
  api.cache(true);

  const isTest = process.env.NODE_ENV === 'test';

  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['react-native-unistyles/plugin', { root: 'src' }],
  ];

  if(!isTest) {
    plugins.push(['@lingui/babel-plugin-lingui-macro']);
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: plugins,
  }
};
