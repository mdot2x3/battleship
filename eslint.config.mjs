import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended", "prettier"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    // add esLint rules for jest
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
  // ignore all webpack files because they are not written in ESM syntax (they are CommonJS)
  // and trigger ESLint since it was set up for ESM during install
  globalIgnores(["webpack.*.js"]),
]);
