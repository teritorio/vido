import { defineConfig } from 'cypress'
import htmlvalidate from 'cypress-html-validate/plugin'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      require('cypress-terminal-report/src/installLogsPrinter')(on)

      htmlvalidate.install(on, {
        rules: {
          'require-sri': 'off',
        },
      })
    },
  },
})
