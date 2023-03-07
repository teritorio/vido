import { config } from '@vue/test-utils'

import settings from '~/cypress/fixtures/teritorio/references/settings.json'
import fr from '~/locales/fr.js'

config.global.mocks['$t'] = (k: string) =>
  // @ts-ignore
  k.split('.').reduce((sum, k: string) => sum[k], fr)

config.global.mocks['$settings'] = settings
