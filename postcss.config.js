module.exports = {
  plugins: [
    require('postcss-sort-media-queries')(),
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 2 versions',
        '> 0.2%',
        'not dead'
      ]
    }),
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
    // require('cssnano')()
  ]
}
