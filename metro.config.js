const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// When Metro resolves package `exports` fields, prefer CJS-compatible
// conditions over "import" (ESM), which would pull in .mjs files containing
// `import.meta` — invalid syntax in Metro's non-module bundle format.
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'default',
];

module.exports = config;
