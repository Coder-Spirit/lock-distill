const rootdir = __dirname

const extensions = [
  '.js',
  '.cjs',
  '.mjs',
  '.ts',
  '.mts',
  '.cts',
  '.d.ts',
  '.d.mts',
  '.d.cts',
]

const commonPaths = [
  'node_modules',
  'node_modules/@types',
  'node_modules/@types/node',
]

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    tsConfigRootDir: rootdir,
    project: ['./tsconfig.json', './tsconfig.tests.json'],
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'prettier',
    'promise',
    'sonarjs',
    'unicorn',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:node/recommended-module',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  rules: {
    'node/no-missing-import': [
      'off', // For now, until TS 4.7 is released and the linter understands .mjs imports
      {
        resolvePaths: [
          `${rootdir}/src`,
          `${rootdir}/node_modules`,
          `${rootdir}/node_modules/@types`,
          `${rootdir}/node_modules/@types/node`,
        ],
        tryExtensions: extensions,
      },
    ],
    'prettier/prettier': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    'sort-imports': 'error',
    'unicorn/filename-case': 'off',
    'unicorn/prevent-abbreviations': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          'src',
          'node_modules',
          'node_modules/@types',
          'node_modules/@types/node',
        ],
        extensions: extensions,
      },
      typescript: {},
    },
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.test.ts'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      env: {
        'jest/globals': true,
      },
      rules: {
        'jest/no-disabled-tests': 'error',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/consistent-test-it': 'error',
        'jest/valid-expect': ['error', { alwaysAwait: true }],
        'node/no-unpublished-import': 'off',
      },
    },
  ],
  ignorePatterns: [
    'bin/distiller.mjs',
    '.eslintrc.cjs',
    'jest.config.mjs',
    'tsconfig.json',
    'tsconfig.base.json',
    'tsconfig.tests.json',
  ],
}
