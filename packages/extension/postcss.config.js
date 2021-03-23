// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-import'),
    require('@tailwindcss/jit'),
    require('postcss-preset-env'),
    require('autoprefixer'),
    // require('tailwindcss'),
  ],
}
