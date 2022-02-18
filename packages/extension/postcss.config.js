// postcss.config.js
module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-preset-env"),
    require("autoprefixer"),
    // require('postcss-windicss'),
  ],
};
