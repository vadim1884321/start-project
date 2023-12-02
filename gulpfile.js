import * as fs from 'node:fs';
import gulp from 'gulp';
import { rimraf } from 'rimraf';
import nunjucksRender from 'gulp-nunjucks-render';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import lightningcss from 'gulp-lightningcss';
import esbuild from 'gulp-esbuild';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import plumber from 'gulp-plumber';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);

const isProduction = process.env.NODE_ENV == 'production';

// Разметка
export const nunjucks = () => {
	return (
		gulp
			.src('./src/_includes/pages/**/*.{html,njk}')
			.pipe(
				plumber({
					errorHandler: function (err) {
						console.log(err.message);
						this.emit('end');
					},
				})
			)
			.pipe(
				nunjucksRender({
					path: ['./src/_includes'],
					envOptions: {
						trimBlocks: true,
						lstripBlocks: true,
					},
					data: {
						nav: JSON.parse(fs.readFileSync('./src/_data/navigation.json', 'utf8')),
						site: JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf8')),
						year: new Date().getFullYear(),
					},
				})
			)
			// .pipe(htmlBeautify())
			// .pipe(posthtml())
			.pipe(replace(/\.\.\//g, './'))
			.pipe(gulp.dest('./src'))
			.pipe(browserSync.stream())
	);
};

// Обработка стилей
export const styles = () => {
	return gulp
		.src('src/scss/**/*.scss', { sourcemaps: !isProduction })
		.pipe(
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				},
			})
		)
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(lightningcss({ minify: isProduction }))
		.pipe(replace(/(\.\.\/|\.\/){1,}/g, '../'))
		.pipe(gulp.dest('./src/css/', { sourcemaps: !isProduction }))
		.pipe(browserSync.stream());
};

// Обработка скриптов
export const scripts = () => {
	return gulp
		.src('./src/js/main.js', { sourcemaps: !isProduction })
		.pipe(
			plumber({
				errorHandler: function (err) {
					console.log(err.message);
					this.emit('end');
				},
			})
		)
		.pipe(
			esbuild({
				target: 'es6',
				outfile: 'main.bundle.js',
				bundle: true,
				minify: isProduction,
				sourcemap: !isProduction,
				// external: ['jquery'],
			})
		)
		.pipe(gulp.dest('./src/js', { sourcemaps: !isProduction }))
		.pipe(browserSync.stream());
};

// Очистка папки c svg-спрайтом
export const svgClean = () => {
	return rimraf('./src/images/svg-sprite/**/*');
};

// Обработка SVG, создание svg-спрайта
export const svgSprite = () => {
	return gulp
		.src('./src/images/svg/**/*.svg')
		.pipe(
			svgmin({
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
			})
		)
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('./src/images/svg-sprite'));
};

export const svg = gulp.series(svgClean, gulp.parallel(svgSprite));

// Автоперезагрузка браузера (Live Server)
export const serve = () => {
	browserSync.init({
		server: {
			baseDir: './src',
		},
		ui: false,
		notify: false,
		// tunnel: true,
		// tunnel: 'projectname', //Demonstration page: http://projectname.localtunnel.me
	});
	// browserSync.watch('./src/*.html', browserSync.reload);
};

export const watch = () => {
	gulp.watch('./src/_includes/**/*.{html,njk}', gulp.series(nunjucks));
	gulp.watch('./src/scss/**/*.scss', gulp.series(styles));
	gulp.watch('./src/js/**/!(main.bundle.js)*.js', gulp.series(scripts));
	gulp.watch('./src/images/svg/**/*.svg', gulp.series(svg));
};

export const build = gulp.series(gulp.parallel(nunjucks, styles, scripts, svg));
export default gulp.series(gulp.parallel(nunjucks, styles, scripts, svg), gulp.parallel(watch, serve));
