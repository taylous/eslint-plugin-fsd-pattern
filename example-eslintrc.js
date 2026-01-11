// Example ESLint configuration for ESLint 8 and below
// This file shows how to configure @taylous/eslint-plugin-fsd-pattern with legacy .eslintrc format

module.exports = {
  // Basic configuration
  plugins: ['@taylous/fsd-pattern'],
  rules: {
    '@taylous/fsd-pattern/layer-imports': 'error',
  },

  // Or with custom options:
  // plugins: ['@taylous/fsd-pattern'],
  // rules: {
  //   '@taylous/fsd-pattern/layer-imports': ['error', {
  //     usePlural: false,  // Use singular layer names (page, widget, feature, entity)
  //     customLayers: {
  //       // Customize layer names if needed
  //       // pages: 'screens',
  //       // widgets: 'components',
  //     },
  //   }],
  // },
};
