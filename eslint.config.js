import eslintPluginAstro from "eslint-plugin-astro";
// import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";

import tsParser from '@typescript-eslint/parser';

const config = [
  ...eslintPluginAstro.configs.recommended,
  // ...eslintPluginJsxA11y.configs.recommended,
  {
    files: ['**/*.astro', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    rules: {}
  }
];

export default config;
