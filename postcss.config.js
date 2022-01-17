const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
	plugins: [
		require('autoprefixer')({
			overrideBrowserslist: [
				'defaults'
			]
		}),
		require('postcss-sort-media-queries')(),
		isProduction ? require('cssnano')() : false
	]
};
