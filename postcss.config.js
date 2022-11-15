module.exports = (ctx) => ({
  plugins: [
    require('autoprefixer')(),
    require('postcss-preset-env')({ stage: 0 }),
    require('postcss-sort-media-queries')(),
    ctx.env === 'production' ? require('cssnano')() : false,
  ],
})
