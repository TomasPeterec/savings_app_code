import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // 1️⃣ JS/JSX súbory
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaVersion: 2025, sourceType: "module", ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // 2️⃣ TypeScript súbory
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // 3️⃣ React súbory
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react: reactPlugin, "react-hooks": reactHooksPlugin },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    settings: { react: { version: "detect" } },
  },
]);
