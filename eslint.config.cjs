module.exports = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'bun.lock',
      'package-lock.json',
      '*.d.ts',
      '**/*.spec.ts',
    ],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];
