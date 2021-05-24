module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'defaults'
      ]
    }),
    require('postcss-sort-media-queries')(),
    // require('postcss-pxtorem')({
    //   rootValue: 16,
    //   unitPrecision: 5,
    //   propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
    //   selectorBlackList: [],
    //   replace: true,
    //   mediaQuery: false,
    //   minPixelValue: 0,
    //   exclude: /(node_modules)/
    // }),
    require('postcss-csso')()
  ]
}
