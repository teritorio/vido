import { defineConfig } from 'cypress'
import htmlvalidate from 'cypress-html-validate/plugin'

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    setupNodeEvents(on, config) {
      require('cypress-terminal-report/src/installLogsPrinter')(on)

      htmlvalidate.install(
        on,
        {
          rules: {
            'require-sri': 'off',
            'valid-id': 'off',
            'prefer-native-element': 'off',
            'heading-level': 'off',
            'empty-heading': 'off',
            'aria-label-misuse': 'off',
            'no-missing-references': 'off',
          },
        },
        {
          exclude: [
            '.maplibregl-marker',
            '.filters-number-range',
            '.category-selector',
          ],
        }
      )
    },
  },
})
