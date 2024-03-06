import type { Meta, StoryObj } from '@storybook/vue3'
import Stars from './Stars.vue'
import { StarsEnum } from '~/utils/types'

const meta = {
  component: Stars,
  argTypes: {
    stars: {
      control: 'select',
      options: StarsEnum,
    },
  },
} satisfies Meta<typeof Stars>

export default meta
type Story = StoryObj<typeof Stars>

export const Default = {
  args: {
    stars: StarsEnum.Four,
  },
} satisfies Story

export const SNotation = {
  args: {
    stars: StarsEnum.FourS,
  },
} satisfies Story
