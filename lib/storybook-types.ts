import Vue, { VueConstructor } from 'vue'

type Args = { [key: string]: any }
type Def = {
  args: Args | null
  __call__: (args: Args) => any
  bind: (context: Object) => Def
}

export function bind<T extends VueConstructor<Vue>>(
  t: T,
  args: Args,
  slots: string | undefined = undefined
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
