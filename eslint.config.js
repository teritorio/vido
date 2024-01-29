import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: ['.yarn/*'],
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-unused-refs': 0,
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
    },
  },
)
