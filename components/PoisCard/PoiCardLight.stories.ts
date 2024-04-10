import PoiCardLight from '~/components/PoisCard/PoiCardLight.vue'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

import poi from '~/cypress/fixtures/teritorio/references/poi/2.json'

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
