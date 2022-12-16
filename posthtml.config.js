module.exports = (ctx) => ({
  plugins: [
    ctx.env !== 'production'
      ? require('posthtml-beautify')({
          rules: {
            indent: 2,
            blankLines: false,
            sortAttr: true,
          },
        })
      : false,
  ],
});
