import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { ApiPoi } from '~/lib/apiPois'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

const poi: ApiPoi = require('json-loader!~/cypress/fixtures/teritorio/references/poi/2.geojson')

export default {
  title: 'PoisCard/PoiCardLight',
  component: PoiCardLight,
}

const defaultProps = {
  poi,
  // notebook
}

export const Default = bind(PoiCardLight, {
  ...defaultProps,
})
