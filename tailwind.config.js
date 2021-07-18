module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['checked', 'focus-visible'],
      borderColor: ['checked'],
      borderRadius: ['focus'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
