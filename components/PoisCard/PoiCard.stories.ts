import PoiCard from '~/components/PoisCard/PoiCard.vue'
import type { ApiPoi } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

const poi: ApiPoi = require('json-loader!~/cypress/fixtures/teritorio/references/poi/2.geojson')

export default {
  title: 'PoisCard/PoiCard',
  component: PoiCard,
}

const defaultProps = {
  poi,
  explorerModeEnabled: false,
  favoritesModeEnabled: false,
}

export const Default = bind(PoiCard, {
  ...defaultProps,
})
