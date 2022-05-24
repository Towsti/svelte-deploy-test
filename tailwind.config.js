module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    content: ['./public/index.html', './src/**/*.svelte', "./node_modules/flowbite/**/*.js"],
    options: {
      defaultExtractor: content => [
        ...(content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []),
        ...(content.match(/(?<=class:)[^=>\/\s]*/g) || []),
      ],
    },
  },
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },

  // darkMode: 'class',

  plugins: [
    // require('tailwind-scrollbar'),
    // require('tw-elements/dist/plugin')
    require('flowbite/plugin')
  ],
  
}