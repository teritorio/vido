import PoiCard from '~/components/PoisCard/PoiCard.vue'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

import poi from '~/cypress/fixtures/teritorio/references/poi/2.json'

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
