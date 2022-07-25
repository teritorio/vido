import { config } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'

import settings from '~/cypress/fixtures/teritorio/references/settings.json'
import fr from '~/locales/fr.js'

Vue.use(Vuex)

config.mocks['$t'] = (k: string) =>
  // @ts-ignore
  k.split('.').reduce((sum, k: string) => sum[k], fr)
config.mocks['$tc'] = config.mocks['$t']

config.mocks['$settings'] = settings
