// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['.yarn/*'],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-unused-refs': 0,
      'vue/valid-v-slot': 0,
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'antfu/no-import-node-modules-by-path': 0,
    },
  },
  {
    rules: {
      'node/prefer-global/process': 0,
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      'ts/ban-ts-comment': 'off',
    },
  },
)
