// Flat ESLint config (ESLint 9) built on Expo's shared rules.
const expoFlat = require('eslint-config-expo/flat');

module.exports = [
  ...expoFlat,
  {
    ignores: ['node_modules/**', 'dist/**', '.expo/**', 'assets/**', 'babel.config.js'],
  },
];
