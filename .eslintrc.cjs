module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', 'forms', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh', 'simple-import-sort', 'unused-imports'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    eqeqeq: ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effects
          ['^\\u0000'],
          // React
          ['^react', '^react-dom', '^react-router', '^react-i18next'],
          // @mui
          ['^@mui/'],
          // @somenergia
          ['^@somenergia/'],
          // Externos (resto)
          ['^@?\\w'],
          // Internos
          ['^\\.\\./', '^\\./', '^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}
