import mockStyleGL from './storybook-types-mock-stylegl'

type Args = { [key: string]: any }
type Def = {
  args: Args | null
  __call__: (args: Args) => any
  bind: (context: object) => Def
}

export const mockData = {
  style: [
    {
      url: 'https://example.com/style.json',
      method: 'GET',
      status: 200,
      response: mockStyleGL,
    },
    {
      url: 'https://example.com/data/tiles.json',
      method: 'GET',
      status: 200,
      response: {
        type: 'vector',
        attribution:
          '© OpenMapTiles © OpenStreetMap contributors © Teritorio © SirtaquiBD Alti IGN 2021',
        tiles: ['https://example.com/data/tiles/{z}/{x}/{y}.pbf'],
        minzoom: 0,
        maxzoom: 1,
      },
    },
    {
      url: 'https://example.com/data/tiles/:z/:x/:y.pbf',
      method: 'GET',
      status: 204,
      response: {},
    },
  ],
}

export const parametersMap = {
  mockData: mockData.style,
}

export const mapCss = `
position: absolute;
top: 0;
bottom: 0;
width: 100%;
`

export function bind<T>(
  t: T,
  args: Args,
  {
    slots = '',
    id = '',
    classs = '',
    style = '',
  }: {
    slots?: string
    id?: string
    classs?: string
    style?: string
  } = {}
) {
  const Template = (args: Args) =>
    ({
      components: { t },
      setup() {
        return { args }
      },
      template: `<t v-bind="args" ${
        id ? `id="${id}"` : ''
      } v-on="args" class="${classs}" style="${style}">${slots}</t>`,
    } as unknown as Def)

  const b = Template.bind({})
  // @ts-ignore
  b.args = args
  return b
}
