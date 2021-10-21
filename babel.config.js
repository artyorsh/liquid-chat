module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['react-native-unistyles/plugin', { root: 'src' }],
  ],
};
