import Vue, { VueConstructor } from 'vue'

import mockStyleGL from './storybook-types-mock-stylegl'

type Args = { [key: string]: any }
type Def = {
  args: Args | null
  __call__: (args: Args) => any
  bind: (context: Object) => Def
}

export const mockData = {
  styleGlEmpty: {
    url: 'https://example.com/style.json',
    method: 'GET',
    status: 200,
    response: mockStyleGL,
  },
}

export function bind<T extends VueConstructor<Vue>>(
  t: T,
  args: Args,
  slots: string = ''
) {
  const Template = ((args: Args) => ({
    components: { t },
    props: Object.keys(args),
    template: `<t v-bind="$props" v-on="$props" >${slots}</t>`,
  })) as unknown as Def

  const b = Template.bind({})
  b.args = args
  return b
}
