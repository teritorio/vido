import { useGrid, useScreen } from 'vue-screen'

export default function (): ComputedRef<{
  smallScreen: boolean
  touch: boolean
  phone: boolean
}> {
  const screen = useScreen()
  const grid = useGrid('tailwind')

  const device = computed(() => ({
    smallScreen: !grid.md,
    touch: screen.touch,
    // Quick heuristic for device having phone capability
    phone: screen.touch && !grid.lg,
  }))

  return device
}
