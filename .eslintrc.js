module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    // '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:import/warnings',
    'plugin:import/typescript',
    // Make sure "prettier" is the last element in this list.
    'prettier',
  ],
  plugins: ['prettier', 'import', '@typescript-eslint', 'vue'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'vue/multi-word-component-names': 'off',
    'import/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
          'unknown',
        ],
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    'import/internal-regex': '^@/',
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.js', '.vue'],
    },
  },
}
