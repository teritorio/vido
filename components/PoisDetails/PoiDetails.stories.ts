import PoiDetails from '~/components/PoisDetails/PoiDetails.vue'
import navMenuEntries from '~/cypress/fixtures/teritorio/references/menu.json'
import poisDeps from '~/cypress/fixtures/teritorio/references/poi/1/deps.json'
import settings from '~/cypress/fixtures/teritorio/references/settings.json'
import { ApiPois } from '~/lib/apiPois'
import { bind, mockData } from '~/lib/storybook-types'

export default {
  title: 'PoisDetails/PoiDetails',
  component: PoiDetails,
  parameters: {
    mockData: [...mockData.style],
  },
}

const defaultProps = {
  settings: settings,
  navMenuEntries: navMenuEntries,
  poi: (poisDeps as ApiPois).features[0],
}

export const Default = bind(PoiDetails, {
  ...defaultProps,
})
