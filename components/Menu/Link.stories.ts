import Link from '~/components/Menu/Link.vue'
import type { ApiMenuLink } from '~/types/api/menu'
import { bind } from '~/lib/storybook-types'

export default {
  title: 'Menu/Link',
  component: Link,
}

const menuLink: ApiMenuLink = {
  id: 123,
  selected_by_default: false,
  index_order: 1,
  link: {
    href: 'https://example.com',
    name: { fr: 'Example.com' },
    icon: 'teritorio teritorio-bar',
    color_fill: '#284627',
    color_line: '#284627',
    display_mode: 'compact',
  },
}

const defaultProps = {
  menuLink,
  size: 'lg',
  displayModeDefault: 'large',
}

export const Default = bind(Link, {
  ...defaultProps,
})

export const Large = bind(Link, {
  ...defaultProps,
  menuLink: {
    ...defaultProps.menuLink,
    link: {
      ...menuLink.link,
      display_mode: 'large',
    },
  },
})
