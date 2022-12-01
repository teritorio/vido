import MapControlsBackground from '~/components/Map/MapControlsBackground.vue'
import { bind } from '~/lib/storybook-types'
import { MapStyleEnum } from '~/utils/types'

export default {
  title: 'Map/MapControlsBackground',
  component: MapControlsBackground,
  decorators: [() => ({ template: '<div id="map"><story/></div>' })],
}

const defaultProps = {
  backgrounds: [MapStyleEnum.vector, MapStyleEnum.aerial, MapStyleEnum.bicycle],
  initialBackground: MapStyleEnum.vector,
}

export const Default = bind(MapControlsBackground, {
  ...defaultProps,
})

export const Selected = bind(MapControlsBackground, {
  ...defaultProps,
  initialBackground: MapStyleEnum.aerial,
})

export const Hidden = bind(MapControlsBackground, {
  ...defaultProps,
  hidden: true,
})
