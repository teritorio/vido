import antfu from '@antfu/eslint-config'

export default antfu(
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-unused-refs': 0,
    },
  },
  {
    rules: {
      'node/prefer-global/process': 0,
    },
  },
)
