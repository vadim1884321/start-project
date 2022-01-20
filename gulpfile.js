const fs = require('fs');
const rimraf = require('rimraf');
const { src, dest, series, parallel, watch } = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlBeautify = require('gulp-html-beautify');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const terser = require('gulp-terser');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const browserSync = require('browser-sync');

const isProduction = process.env.NODE_ENV === 'production';

// Разметка
const nunjucks = () => {
	return src('src/_includes/pages/**/*.{html,njk}')
		.pipe(plumber())
		.pipe(nunjucksRender({
			path: [
				'src/_includes/'
			],
			envOptions: {
				trimBlocks: true,
				lstripBlocks: true
			},
			data: {
				nav: JSON.parse(fs.readFileSync('src/_data/navigation.json', 'utf8')),
				site: JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8')),
				year: new Date().getFullYear()
			}
		}))
		.pipe(htmlBeautify())
		.pipe(replace('../../', './'))
		.pipe(dest('src/'))
		.pipe(browserSync.stream());
};

exports.nunjucks = nunjucks;

// Обработка стилей
const styles = () => {
	return src('src/scss/**/*.scss', { sourcemaps: !isProduction })
		.pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
		.pipe(postcss())
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(replace('../../', '../'))
		.pipe(dest('src/css/', { sourcemaps: !isProduction }))
		.pipe(browserSync.stream());
};

exports.styles = styles;

// Обработка скриптов
const scripts = () => {
	return src([
		// Подключаем JS библиотеки
		'!node_modules/pixel-glass/script.js',
		'src/js/common.js'
	], { sourcemaps: !isProduction })
		.pipe(gulpif(isProduction, terser()))
		.pipe(concat('main.min.js'))
		.pipe(dest('src/js/', { sourcemaps: !isProduction }))
		.pipe(browserSync.stream());
};

exports.scripts = scripts;

// Очистка папки c svg-спрайтом
const svgClean = (cb) => {
	return rimraf('src/images/svg-sprite/**/*', cb);
};

exports.svgClean = svgClean;

// Обработка SVG, создание svg-спрайта
const svgSprite = () => {
	return src('src/images/svg/**/*.svg')
		.pipe(svgmin({
			multipass: true,
			js2svg: {
				pretty: true,
				indent: '	',
			},
			plugins: [
				'sortAttrs',
				{
					name: 'removeViewBox',
					active: false,
				}
			]
		}))
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename('sprite.svg'))
		.pipe(dest('src/images/svg-sprite/'));
};

exports.svgSprite = svgSprite;

const svg = series(svgClean, parallel(svgSprite));

// Автоперезагрузка браузера (Live Server)
const serve = () => {
	browserSync.init({
		server: {
			baseDir: 'src',
		},
		ui: false,
		notify: false,
		open: true,
		// tunnel: true,
		// tunnel: 'projectname', //Demonstration page: http://projectname.localtunnel.me
	});
	// browserSync.watch('src/*.html', browserSync.reload);
};

exports.serve = serve;

const watcher = () => {
	watch('src/_includes/**/*.{html,njk}', series(nunjucks));
	watch('src/scss/**/*.scss', series(styles));
	watch('src/js/common.js', series(scripts));
	watch('src/images/svg/**/*.svg', series(svg));
};

exports.watcher = watcher;

exports.build = series(parallel(nunjucks, styles, scripts, svg));
exports.default = series(parallel(nunjucks, styles, scripts, svg), parallel(watcher, serve));
