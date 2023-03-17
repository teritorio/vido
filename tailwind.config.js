module.exports = {
  prefix: 'tw-',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  media: {
    darkMode: false,
  },
  theme: {
    extend: {
      fontSize: () => ({
        '2xs': '.6rem',
      }),
      height: () => ({
        'screen-3/5': '60vh',
      }),
      maxHeight: () => ({
        'screen-3/5': '60vh',
        'screen-4/6': '65vh',
      }),
      minHeight: () => ({
        'screen-3/5': '60vh',
      }),
      flexBasis: {
        max: 'max-content',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@vueform/slider/tailwind'),
  ],
}
