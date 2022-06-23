import FavoriteIcon from '@/components/UI/FavoriteIcon.vue'

import { bind } from '~/lib/storybook-types'

export default {
  title: 'UI/FavoriteIcon',
  component: FavoriteIcon,
}

const defaultProps = {}

export const Default = bind(FavoriteIcon, {
  ...defaultProps,
})

export const Active = bind(FavoriteIcon, {
  ...defaultProps,
  isActive: true,
})

export const Colored = bind(FavoriteIcon, {
  ...defaultProps,
  colorLine: '#ff0000',
})
