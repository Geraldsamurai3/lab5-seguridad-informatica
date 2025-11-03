import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        // Esto le indica a ESLint que Mocha está disponible
        describe: "readonly",
        it: "readonly",
        before: "readonly",
        after: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly"
             
      },
    },
  },
];
