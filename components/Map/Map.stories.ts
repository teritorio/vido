import Map from '~/components/Map/Map.vue'
import { bind, parametersMap } from '~/lib/storybook-types'

export default {
  title: 'Map/Map',
  component: Map,
  parameters: {
    ...parametersMap,
  },
}

const defaultProps = {}

export const Default = bind(Map, {
  ...defaultProps,
})

export const FullScreen = bind(Map, {
  ...defaultProps,
  fullscreenControl: true,
})
