import { createRequire } from 'node:module';
import globals from 'globals';
import nextParser from 'eslint-config-next/parser';
import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Flat config for ESLint 10 (Next 16 removed `next lint`).
 *
 * This mirrors `eslint-config-next/core-web-vitals`, minus the
 * `typescript-eslint` block: typescript-eslint refuses to load under the
 * TypeScript 7 this project uses (https://github.com/typescript-eslint/typescript-eslint/issues/10940),
 * and the project's own rules live in the blocks below instead of .eslintrc.
 */
const requireFromNext = createRequire(
  new URL('./node_modules/eslint-config-next/package.json', import.meta.url)
);
const reactPlugin = requireFromNext('eslint-plugin-react');
const jsxA11yPlugin = requireFromNext('eslint-plugin-jsx-a11y');
const importPlugin = requireFromNext('eslint-plugin-import');

const config = [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/**', 'drizzle/**'],
  },
  {
    name: 'next',
    files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parser: nextParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        allowImportExportEverywhere: true,
        ecmaFeatures: { jsx: true },
        babelOptions: {
          presets: ['next/babel'],
          caller: { supportsTopLevelAwait: true },
        },
      },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: {
      // Explicit, because `version: 'detect'` calls `context.getFilename()`,
      // which ESLint 10 removed.
      react: { version: '19.3' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'import/no-anonymous-default-export': 'warn',
      'react/no-unknown-property': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'jsx-a11y/alt-text': ['warn', { elements: ['img'], img: ['Image'] }],
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      // Formerly set in .eslintrc.json; the @typescript-eslint variants of
      // these rules cannot run until typescript-eslint supports TypeScript 7.
    },
  },
  {
    // Base `no-unused-vars` cannot see TypeScript type positions (and the
    // @typescript-eslint replacement is blocked by the TS 7 issue above), so
    // it only applies to plain JS here to avoid false positives on type-only
    // imports like `import type { Metadata }`.
    name: 'js/no-unused-vars',
    files: ['**/*.{js,jsx,mjs,cjs}'],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];

export default config;
