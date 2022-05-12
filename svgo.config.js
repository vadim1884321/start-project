// https://github.com/svg/svgo#configuration
const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  multipass: true,
  js2svg: {
    indent: 2,
    pretty: !isProduction,
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    {
      name: 'sortAttrs',
      params: {
        xmlnsOrder: 'alphabetical',
      },
    },
  ],
}
