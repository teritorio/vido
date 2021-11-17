import { VidoFeature } from '@/utils/types'

export const flattenFeatures = (features: {
  [categoryId: number]: VidoFeature[]
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

export const displayTime = (dateGMT: Date | string | undefined) => {
  if (dateGMT) {
    const date = new Date(dateGMT)

    const hh = date.getHours()
    const mm = date.getMinutes()

    return `${hh < 10 ? `0${hh}` : hh}:${mm < 10 ? `0${mm}` : mm}`
  }
  return ''
}
