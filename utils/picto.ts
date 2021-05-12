import memoize from 'lodash.memoize'
import { hex } from 'wcag-contrast'

type GetPictoMode = 'inline' | 'raw' | 'data'

/**
 * Tries to find a component/file based on a picto name and returns it
 */
export function getPicto(pictoName: string, mode: GetPictoMode = 'inline') {
  let path = ''

  if (pictoName) {
    if (pictoName.startsWith('teritorio')) {
      path = `${pictoName.replace(/^teritorio icon-/, '')}•.svg`
    } else if (pictoName.startsWith('glyphicons')) {
      // path = ${pictoName.replace(/^teritorio\ icon\-/, '')}•.svg`
    } else if (pictoName.startsWith('icocustom')) {
      // path = ${pictoName.replace(/^teritorio\ icon\-/, '')}•.svg`
    } else {
      path = `${pictoName}•.svg`
    }
  }

  if (path) {
    try {
      // If I try to use `${mode}` in the path, the `require` breaks
      switch (mode) {
        case 'data':
          return require(`@/assets/icons/${path}?data`)

        case 'raw':
          return require(`@/assets/icons/${path}?raw`)

        case 'inline':
        default:
          return require(`@/assets/icons/${path}?inline`)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Vido error: Unable to find a picto', error)
    }
  }

  return null
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
