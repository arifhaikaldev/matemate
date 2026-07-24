import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript files
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // React
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // not needed with React 17+ JSX transform
      'react/prop-types': 'off',         // TypeScript handles this

      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // React Refresh (Vite HMR)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Node.js files (compiler CLI)
  {
    files: ['src/compiler/cli.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
      globals: { ...globals.node, ...globals.es2020 },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },

  // Disable formatting rules that conflict with Prettier
  prettierConfig,

  // Ignore build output and dependencies
  {
    ignores: ['dist/**', 'node_modules/**', 'tsconfig.tsbuildinfo'],
  },
]
