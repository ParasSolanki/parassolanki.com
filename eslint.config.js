import eslintPluginAstro from "eslint-plugin-astro";
// import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";

const config = [
  ...eslintPluginAstro.configs.recommended,
  // ...eslintPluginJsxA11y.configs.recommended,
];

export default config;
