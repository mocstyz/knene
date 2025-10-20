module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'storybook-static',
    'vite.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
  },
  plugins: ['react-refresh', '@typescript-eslint', 'import'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    // 强制使用@别名导入，禁止相对路径和@/格式
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../*', './*'],
            message:
              '禁止在业务代码中使用相对路径导入，请使用@别名导入。例如：import { Component } from "@components/atoms/Button"',
          },
          {
            group: ['@/*'],
            message:
              '禁止使用@/格式导入，请使用标准@别名格式。例如：import { Component } from "@components/atoms/Button"',
          },
        ],
      },
    ],
    // 确保import顺序：@别名 > 第三方库 > 相对路径（已被禁止）
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js内置模块
          'external', // 第三方库
          'internal', // 内部模块（@别名）
          ['parent', 'sibling', 'index'], // 相对路径（已禁止但保留规则）
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  // 覆盖规则：允许index.ts文件使用相对路径导出
  overrides: [
    {
      files: ['**/index.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            // index.ts文件只禁止@/格式，允许相对路径导出
            patterns: [
              {
                group: ['@/*'],
                message:
                  '禁止使用@/格式导入，请使用标准@别名格式。例如：import { Component } from "@components/atoms/Button"',
              },
            ],
          },
        ],
      },
    },
  ],
}
