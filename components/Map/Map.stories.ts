import Map from '~/components/Map/Map.vue'
import { bind, mockData } from '~/lib/storybook-types'

export default {
  title: 'Map/Map',
  component: Map,
  parameters: {
    mockData: [mockData.styleGlEmpty],
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
