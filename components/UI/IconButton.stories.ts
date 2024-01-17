import IconButton from '~/components/UI/IconButton.vue'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

export default {
  title: 'UI/IconButton',
  component: IconButton,
}

const defaultProps = {
  label: 'Plop',
}

export const DefaultButton = bind(
  IconButton,
  {
    ...defaultProps,
  },
  { slots: 'ABC' },
)

export const DefaultLink = bind(
  IconButton,
  {
    ...defaultProps,
    href: 'https://www.teritorio.fr/',
  },
  { slots: 'ABC' },
)
