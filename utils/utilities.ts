import { VidoFeature } from '@/utils/types'

export const flattenFeatures = (features: {
  [categoryId: string]: VidoFeature[]
}) =>
  Object.values(features)
    .flat()
    .filter((f: VidoFeature) => f.properties.vido_visible)

export const getPreviousMonday = () => {
  const date = new Date()

  if (date.getDay() !== 0) {
    return new Date().setDate(date.getDate() - 7 - 6)
  }

  return new Date().setDate(date.getDate() - date.getDate() - 6)
}

export const displayTime = (dateGMT: Date | string) => {
  if (dateGMT) {
    const date = new Date(dateGMT)

    let hh = date.getHours()
    let mm = date.getMinutes()
    if (hh < 10) {
      hh = '0' + hh
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    return `${hh}:${mm}`
  }
  return ''
}
