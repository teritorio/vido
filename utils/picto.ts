import memoize from 'lodash.memoize'
import { hex } from 'wcag-contrast'

export function getPictoClassName(picto: string) {
  return picto.replace(/^teritorio icon/, 'teritorio-tourism')
}

/**
 * Given a background color, it returns the better contrasted color between black-ish and white
 */
export const getContrastedTextColor = memoize((backgroundColor: string) => {
  const darkColor = '#222'
  const lightColor = '#fff'
  const darkColorContrast = hex(darkColor, backgroundColor)
  const lightColorContrast = hex(lightColor, backgroundColor)
  const wcagAAAThreshold = 7

  if (
    darkColorContrast < wcagAAAThreshold &&
    lightColorContrast < wcagAAAThreshold
  ) {
    return lightColor
  }

  return darkColorContrast > lightColorContrast ? darkColor : lightColor
})
