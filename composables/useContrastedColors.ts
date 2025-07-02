import type { TextColors } from '~/lib/apiPois'

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
