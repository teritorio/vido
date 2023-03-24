import type { Config } from '@jest/types'

// Sync object
const config: Config.InitialOptions = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'vue'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': '@vue/vue3-jest',
    '^.+\\.(aac|eot|gif|jpeg|jpg|m4a|mp3|mp4|oga|otf|pdf|png|svg|ttf|wav|webm|webp|woff|woff2)$':
      '<rootDir>/__mocks__/file-mock.js',
  },
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
  ],
  setupFiles: ['<rootDir>/tests/default.jest.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
  testPathIgnorePatterns: ['/node_modules/'],
}

export default config
