import LeisureParkGardenIcon from '@/assets/icons/leisure-park-garden•.svg?inline'

import CategoryButton from './CategoryButton'

export default {
  title: 'Components/CategoryButton',
  component: CategoryButton,
}

const DefaultTemplate = (_, { argTypes }) => {
  return {
    components: { CategoryButton, LeisureParkGardenIcon },
    props: Object.keys(argTypes),
    template: `
    <category-button v-bind="$props" v-on="$props">
      <leisure-park-garden-icon class="w-6 h-6" />
    </category-button>`,
  }
}

export const Default = DefaultTemplate.bind({})
Default.args = {
  color: 'red',
  name: 'Santé',
  badge: '2',
  selected: false,
}

export const Selected = DefaultTemplate.bind({})
Selected.args = {
  color: 'red',
  name: 'Santé',
  badge: '2',
  selected: true,
}
