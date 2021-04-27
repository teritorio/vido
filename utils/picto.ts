import { hex } from 'wcag-contrast'

/**
 * Tries to find a component/file based on a picto name and returns it
 */
export function pictoComponent(pictoName: string) {
  if (pictoName) {
    if (pictoName.startsWith('teritorio')) {
      return require(`@/assets/icons/${pictoName.replace(
        /^teritorio icon-/,
        ''
      )}•.svg?inline`)
    } else if (pictoName.startsWith('glyphicons')) {
      // return require(`@/assets/icons/${pictoName.replace(/^teritorio\ icon\-/, '')}•.svg?inline`)
    } else if (pictoName.startsWith('icocustom')) {
      // return require(`@/assets/icons/${pictoName.replace(/^teritorio\ icon\-/, '')}•.svg?inline`)
    } else {
      return require(`@/assets/icons/${pictoName}•.svg?inline`)
    }
  }

  return null
}

/**
 * Given a background color, it returns the better contrasted color between black-ish and white
 */
export function getContrastedTextColor(backgroundColor: string) {
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
}
