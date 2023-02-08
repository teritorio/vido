module.exports = {
  content: [],
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
