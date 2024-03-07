import type { Meta, StoryObj } from '@storybook/vue3'
import Phone from './Phone.vue'

const meta = {
  component: Phone,
} satisfies Meta<typeof Phone>

export default meta
type Story = StoryObj<typeof Phone>

export const Default = {
  args: {
    number: '+33610203040',
  },
} satisfies Story
