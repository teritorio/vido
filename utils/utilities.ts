import { VidoFeature } from '@/utils/types'

export const flattenFeatures = (features: {
  [categoryId: string]: VidoFeature[]
}) =>
  Object.values(features)
    .flat()
    .filter((f: VidoFeature) => f.properties.vido_visible)
