import MenuGroup from '~/components/Categories/MenuGroup.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/MenuGroup',
  component: MenuGroup,
}

const defaultProps = {
  colorFill: '#00ff00',
  categoryId: 765,
  label: 'Leisure & Skiing',
  picto: 'teritorio teritorio-hosting',
}

export const Default = bind(MenuGroup, {
  ...defaultProps,
})

export const Large = bind(MenuGroup, {
  ...defaultProps,
  type: 'large',
})

export const Activities = bind(MenuGroup, {
  ...defaultProps,
  activeSubCategories: 33,
})

export const ActivitiesLarge = bind(MenuGroup, {
  ...defaultProps,
  type: 'large',
  activeSubCategories: 33,
})

export const Link = bind(MenuGroup, {
  ...defaultProps,
  href: 'https://example.com',
})

export const LinkLarge = bind(MenuGroup, {
  ...defaultProps,
  type: 'large',
  href: 'https://example.com',
})

export const EdgeCases = bind(MenuGroup, {
  ...defaultProps,
  type: 'compact',
  activeSubCategories: 97647,
  label: 'Leisure & Skiing and misc Ananas',
})
