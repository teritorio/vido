import type { Meta, StoryObj } from '@storybook/vue3'
import DateRange from './DateRange.vue'

const meta = {
  component: DateRange,
} satisfies Meta<typeof DateRange>

export default meta
type Story = StoryObj<typeof DateRange>

export const Default = {
  args: {
    start: '01/01/01',
    end: '02/02/02',
  },
} satisfies Story

export const StartDate = {
  args: {
    ...Default.args,
    end: undefined,
  },
} satisfies Story

export const EndDate = {
  args: {
    ...Default.args,
    start: undefined,
  },
} satisfies Story

export const SameDay = {
  args: {
    ...Default.args,
    end: Default.args.start,
  },
} satisfies Story
