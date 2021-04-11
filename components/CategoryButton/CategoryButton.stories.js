import LeisureIcon from '@/assets/icons/leisure•.svg?inline'

import CategoryButton from './CategoryButton'

export default {
  title: 'Components/CategoryButton',
  component: CategoryButton,
}

const DefaultTemplate = (_, { args }) => ({
  components: { CategoryButton, LeisureIcon },
  props: Object.keys(args),
  template: `
    <CategoryButton v-bind="$props" v-on="$props">
      <LeisureIcon class="w-7 h-7" />
    </CategoryButton>`,
})

export const Default = DefaultTemplate.bind({})

Default.args = {
  color: 'rebeccapurple',
  id: '123',
  label: 'Leisure',
  selected: false,
}

export const Selected = DefaultTemplate.bind({})

Selected.args = {
  color: 'rebeccapurple',
  id: '123',
  label: 'Leisure',
  selected: true,
}
