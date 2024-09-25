import { defineConfig } from 'cypress'
import installLogsPrinter from 'cypress-terminal-report/src/installLogsPrinter'
import htmlvalidate from 'cypress-html-validate/plugin'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    retries: 2,
    setupNodeEvents(on, _config) {
      installLogsPrinter(on)

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
            '.cookie__bar__buttons',
          ],
        },
      )
    },
  },
})
