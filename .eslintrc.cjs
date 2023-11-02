module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser", // Specify TypeScript parser
  parserOptions: {
    ecmaVersion: 2020, // Use a specific ECMAScript version
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Enable JSX support
    },
  },
  settings: {
    react: {
      version: "18.2",
    },
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"], // Add TypeScript ESLint plugin
  rules: {
    "no-unused-vars": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off", // Disable prop-type validation
    "@typescript-eslint/no-unused-vars": "off", // Disable TypeScript unused variable check
  },
};
