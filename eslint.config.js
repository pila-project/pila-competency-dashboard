import pluginVue from 'eslint-plugin-vue';
import typescriptEslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

export default typescriptEslint.config(
  ...typescriptEslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        sourceType: 'module',
        parser: {
          ts: typescriptEslint.parser,
        },
      },
    },
    rules: {
      // note you must disable the base rule
      // as it can report incorrect errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", // or "error"
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    }
  },
);
