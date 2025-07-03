import type { TextColors } from '~/lib/apiPois'

const colorMigrationTable: Record<string, string> = {
  '#2a62ac': '#2a62ac', // Services de proximité & Équipements de proximité
  '#db7900': '#cc4b00', // Restauration & Bar
  '#009cb8': '#0075db', // Commerces de proximité
  '#c58511': '#996e0a', // Artisanat
  '#76009e': '#76009e', // Culture et patrimoine
  '#a04c97': '#a04c97', // Commerces culturels
  '#4076f6': '#3366ff', // Education
  '#99163a': '#99163a', // Hébergements
  '#00a757': '#008a00', // Loisirs
  '#008ecf': '#007f94', // Mobilités
  '#8cc56f': '#006b31', // Nature
  '#f25c05': '#eb1700', // Produits locaux
  '#1d1d1b': '#000000', // Point de repères du territoire
  '#e50980': '#c02469', // Elements notables
  '#e42224': '#e42224', // Santé
  '#4e7ab5': '#278096', // Commerces de services
  '#808080': '#767676', // Commerces
  '#006660': '#006660', // Services sociaux
}

export function useContrastedColors(backgroundColor: MaybeRef<string>, foregroundColor?: MaybeRef<TextColors | undefined>) {
  const colorFill = ref('#FFFFFF')
  const colorText = ref<TextColors>('#000000')

  const bgColorRef = toRef(backgroundColor)
  const fgColorRef = toRef(foregroundColor)

  watchEffect(() => {
    const { fill, text } = getContrastedColors(bgColorRef.value, fgColorRef.value)
    colorFill.value = fill
    colorText.value = text
  })

  function getContrastedColors(
    fill: string,
    text?: TextColors,
  ): { fill: string, text: TextColors } {
    fill = colorMigrationTable[fill.toLowerCase()] || fill
    const AAA_CONTRAST_THRESHOLD = 4.5

    const contrastWithWhite = getContrastRatio(fill, '#FFFFFF')
    const contrastWithBlack = getContrastRatio(fill, '#000000')

    let finalText: TextColors = '#FFFFFF'

    if (!text) {
      if (contrastWithWhite >= AAA_CONTRAST_THRESHOLD) {
        finalText = '#FFFFFF' // Prefer white
      }
      else if (contrastWithBlack >= AAA_CONTRAST_THRESHOLD) {
        finalText = '#000000' // Fallback to black
      }
      else {
        // Neither passes AAA — pick best (even if below AAA)
        finalText = contrastWithWhite >= contrastWithBlack ? '#FFFFFF' : '#000000'
      }
    }

    return { fill, text: finalText }
  }

  function hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace('#', '')
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('')
    }

    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)
    return [r, g, b]
  }

  function getRelativeLuminance([r, g, b]: [number, number, number]): number {
    const srgb = [r, g, b].map(v => v / 255)
    const linear = srgb.map(c =>
      c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
    )
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  }

  function getContrastRatio(hex1: string, hex2: string): number {
    const lum1 = getRelativeLuminance(hexToRgb(hex1))
    const lum2 = getRelativeLuminance(hexToRgb(hex2))
    const lighter = Math.max(lum1, lum2)
    const darker = Math.min(lum1, lum2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  return {
    colorFill,
    colorText,
  }
}
