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
        'screen-1/4': '25vh',
        'screen-1/3': '31.3vh',
        'screen-1/2': '50vh',
        'screen-2/5': '40vh',
        'screen-3/5': '60vh',
        'screen-4/6': '65vh',
      }),
      minHeight: () => ({
        'screen-1/4': '25vh',
        'screen-1/2': '50vh',
        'screen-3/5': '60vh',
      }),
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
