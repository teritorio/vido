import Stars from './Stars.vue'

import { bind } from '~/lib/storybook-types'

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Stars',
  component: Stars,
}

export const Primary = () => ({
  components: { Stars },
  template: '<Stars stars="3" />',
})

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
