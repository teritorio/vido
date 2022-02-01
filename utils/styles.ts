import { StyleSpecification } from 'maplibre-gl'

export const fetchStyle = (
  styleUrl: string,
  attributions: string[]
): Promise<StyleSpecification> => {
  return fetch(styleUrl)
    .then((res) => res.json())
    .then(async (style: any) => {
      const vectoSources: {
        url: string
        attribution: string
      }[] = Object.values(style.sources)
      const vectoSourceUrl: string[] = vectoSources
        .map((src: any) => src.url)
        .filter((url) => url)

      const vectoSourceAttribution = await Promise.all(
        vectoSourceUrl.map((url) => {
          if (!url) return null

          return fetch(url)
            .then((res) => res.json())
            .then((res) => {
              return res.attribution
            })
        })
      )

      let nuAttribution = ''

      vectoSourceAttribution.forEach((attr, i) => {
        if (attr) {
          const existingAttributions = attributions.filter(
            (att: string) => !attr.includes(att)
          )

          nuAttribution += [attr].concat(existingAttributions).join(' ')
        } else if (vectoSources[i]?.attribution) {
          nuAttribution += ' ' + vectoSources[i]?.attribution
        }
      })

      const nuStyle = { ...style }

      Object.keys(style.sources).forEach((key) => {
        nuStyle.sources[key] = {
          ...style.sources[key],
          attribution: nuAttribution,
        }
      })

      return nuStyle
    })
}
