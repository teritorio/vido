import CategoryButton from '~/components/Categories/CategoryButton/CategoryButton.vue'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Categories/CategoryButton',
  component: CategoryButton,
}

const defaultProps = {
  colorFill: '#00ff00',
  categoryId: 765,
  label: 'Leisure & Skiing',
  picto: 'teritorio teritorio-hosting',
}

export const Default = bind(CategoryButton, {
  ...defaultProps,
})

export const Large = bind(CategoryButton, {
  ...defaultProps,
  type: 'large',
})

export const Activities = bind(CategoryButton, {
  ...defaultProps,
  activeSubCategories: 33,
})

export const ActivitiesLarge = bind(CategoryButton, {
  ...defaultProps,
  type: 'large',
  activeSubCategories: 33,
})

export const Link = bind(CategoryButton, {
  ...defaultProps,
  href: 'https://example.com',
})

export const LinkLarge = bind(CategoryButton, {
  ...defaultProps,
  type: 'large',
  href: 'https://example.com',
})

export const EdgeCases = bind(CategoryButton, {
  ...defaultProps,
  type: 'compact',
  activeSubCategories: 97647,
  label: 'Leisure & Skiing and misc Ananas',
})
