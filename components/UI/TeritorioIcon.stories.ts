import TeritorioIcon from '~/components/UI/TeritorioIcon.vue'
import { bind } from '~/lib/storybook-types'
import '@teritorio/font-teritorio/teritorio/teritorio.css'

export default {
  title: 'UI/TeritorioIcon',
  component: TeritorioIcon,
}

const defaultProps = {
  picto: 'teritorio teritorio-restaurant',
  colorText: '#000000',
  // useNativeAlignment:
}

export const Default = bind(TeritorioIcon, {
  ...defaultProps,
})

export const TextColor = bind(TeritorioIcon, {
  ...defaultProps,
  colorText: '#ff0000',
})

export const Fontawesome = bind(TeritorioIcon, {
  ...defaultProps,
  picto: 'phone',
})

export const FontawesomeTextColor = bind(TeritorioIcon, {
  ...defaultProps,
  picto: 'phone',
  colorText: '#ff0000',
})

export const Image = bind(TeritorioIcon, {
  ...defaultProps,
  image:
    'https://www.teritorio.fr/wp-content/themes/teritorio/img/favicon/favicon-194x194.png',
})
