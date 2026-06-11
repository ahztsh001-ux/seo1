module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  // Fix from review: never lint build artifacts or packaged output.
  ignorePatterns: ["dist/", "release/", "node_modules/", "*.min.js"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.3" } },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-empty": ["warn", { allowEmptyCatch: true }],
  },
  overrides: [
    { files: ["electron/**/*.cjs"], parserOptions: { sourceType: "script" } },
  ],
};
