import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import navMenuEntries from '~/cypress/fixtures/teritorio/references/articles.json'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import settings from '~/cypress/fixtures/teritorio/references/settings'
import type { ApiPois } from '~/lib/apiPois'
import { bind, parametersMap } from '~/lib/storybook-types'

export default {
  title: 'PoisDetails/PoiDetails',
  component: PoiDetails,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {
  settings,
  navMenuEntries,
  poi: (poisDeps as ApiPois).features[0],
}

export const Default = bind(PoiDetails, {
  ...defaultProps,
})
