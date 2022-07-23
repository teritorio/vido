import PoiCard from '~/components/PoisCard/PoiCard.vue'
import { ApiPoi } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

const poi_2 = require('json-loader!~/cypress/fixtures/teritorio/references/poi/2.geojson')

export default {
  title: 'PoisCard/PoiCard',
  component: PoiCard,
}

const poi: ApiPoi = poi_2

const defaultProps = {
  poi,
  // notebook
}

export const Default = bind(PoiCard, {
  ...defaultProps,
})
