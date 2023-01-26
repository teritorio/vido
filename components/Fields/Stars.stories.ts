import Stars from './Stars.vue'

import { bind } from '~/lib/storybook-types'

export default {
  title: 'Fields/Stars',
  component: Stars,
}

let defaultProps = {
  stars: 3,
}

export const Default = bind(Stars, {
  ...defaultProps,
})

export const More = bind(Stars, {
  stars: 10,
})

export const None = bind(Stars, {
  stars: 0,
})
