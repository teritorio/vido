import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import settings from '~/cypress/fixtures/teritorio/references/settings.json'
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
  poi: (poisDeps as ApiPois).features[0],
}

export const Default = bind(PoiDetails, {
  ...defaultProps,
})
